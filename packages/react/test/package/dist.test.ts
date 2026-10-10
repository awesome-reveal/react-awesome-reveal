import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

import { createElement } from "react";
import { renderToString } from "react-dom/server";

const root = new URL("../../", import.meta.url);
const dist = new URL("dist/", root);
const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
const distFiles = readdirSync(dist, { recursive: true, encoding: "utf8" });
const jsFiles = distFiles.filter((file) => /\.(c|m)?js$/.test(file)).sort();
const { resolve } = createRequire(import.meta.url);

const directive = /^["']use client["'];\n/;

// Resolves through the package "exports" map, as consumers do.
function load(subpath: string) {
  return import(pathToFileURL(resolve(`@awesome-reveal/react${subpath.slice(1)}`)).href);
}

function packageName(specifier: string): string {
  return specifier.split("/", specifier.startsWith("@") ? 2 : 1).join("/");
}

function source(file: string): string {
  return readFileSync(new URL(file, dist), "utf8");
}

describe("dist", () => {
  it("contains one JavaScript file per source module, and declarations only for src", () => {
    expect(jsFiles).toEqual(["Reveal.js", "index.js", "keyframes.js", "useReveal.js"]);
    expect(distFiles).toContain("index.d.ts");
    expect(distFiles.filter((file) => /(^|\/)test/.test(file))).toEqual([]);
  });

  it.each(jsFiles)("keeps the 'use client' directive of the source of %s", (file) => {
    const sourceFile = new URL(`src/${file.replace(/\.js$/, ".ts")}`, root);

    expect(existsSync(sourceFile)).toBe(true);
    expect(directive.test(source(file))).toBe(directive.test(readFileSync(sourceFile, "utf8")));
  });

  it("imports only its dependencies and peer dependencies", () => {
    const allowed = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies });
    const imports = jsFiles.flatMap((file) =>
      [...source(file).matchAll(/^(?:import|export) (?:.* from )?"([^"]+)";$/gm)]
        .map(([, id]) => id!)
        .filter((id) => !id.startsWith("."))
        .map(packageName),
    );

    expect(imports.filter((id) => !allowed.includes(id))).toEqual([]);
  });

  it.each([
    [".", ["Reveal", "useReveal"]],
    ["./keyframes", ["blur", "defineKeyframes", "enter", "fade", "scale", "slide"]],
  ])("exposes the public API of %s", async (subpath, names) => {
    expect(Object.keys(await load(subpath)).sort()).toEqual(names);
  });

  it("exports only the subpaths above and package.json", () => {
    expect(Object.keys(pkg.exports)).toEqual([".", "./keyframes", "./package.json"]);
  });

  it("renders hidden content on the server", async () => {
    const { Reveal } = await load(".");
    const { slide } = await load("./keyframes");

    const html = renderToString(
      createElement(Reveal, { keyframes: slide() }, createElement("p", null, "hello")),
    );

    expect(html).toBe('<div style="opacity:0" data-reveal="hidden"><p>hello</p></div>');
  });
});

describe("skills", () => {
  const skillsDir = new URL("skills/", root);
  const skills = readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  it("ships the skills folder, where pnpm links skills from", () => {
    expect(skills.length).toBeGreaterThan(0);
    expect(pkg.files).toContain("skills");
  });

  it.each(skills)(
    "names the %s skill after its folder, as the Agent Skills spec requires",
    (skill) => {
      const text = readFileSync(new URL(`${skill}/SKILL.md`, skillsDir), "utf8");
      const [, name, description] = /^---\nname: (.+)\ndescription: (.+)\n---\n/.exec(text) ?? [];

      expect(name).toBe(skill);
      expect(description?.length).toBeLessThanOrEqual(1024);
    },
  );

  it.each(skills)("imports only public exports in the %s skill", async (skill) => {
    const text = readFileSync(new URL(`${skill}/SKILL.md`, skillsDir), "utf8");
    const imports = [
      ...text.matchAll(/^import \{([^}]+)\} from "@awesome-reveal\/react(\/keyframes)?";$/gm),
    ];

    expect(imports.length).toBeGreaterThan(0);
    for (const [, names, subpath = ""] of imports) {
      const values = names!
        .split(",")
        .map((name) => name.trim())
        .filter((name) => !name.startsWith("type "));
      expect(Object.keys(await load(`.${subpath}`))).toEqual(expect.arrayContaining(values));
    }
  });
});
