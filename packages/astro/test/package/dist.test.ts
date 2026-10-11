import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

import { describeSkills } from "@awesome-reveal/test-utils/skills";

import { buildSite, scripts, type Site } from "../build-site";

const root = new URL("../../", import.meta.url);
const dist = new URL("dist/", root);
const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
const distFiles = readdirSync(dist, { recursive: true, encoding: "utf8" });
const jsFiles = distFiles.filter((file) => /\.(c|m)?js$/.test(file)).sort();
const { resolve } = createRequire(import.meta.url);

const factories = ["blur", "enter", "fade", "pop", "scale", "slide", "spring"];

// Resolves through the package "exports" map, as consumers do.
function load(subpath: string) {
  return import(pathToFileURL(resolve(`@awesome-reveal/astro${subpath.slice(1)}`)).href);
}

function packageName(specifier: string): string {
  return specifier.split("/", specifier.startsWith("@") ? 2 : 1).join("/");
}

function source(file: string): string {
  return readFileSync(new URL(file, dist), "utf8");
}

describe("dist", () => {
  it("contains one JavaScript file per source module, the component, and declarations only for src", () => {
    expect(jsFiles).toEqual(["element.js", "index.js", "keyframes.js"]);
    expect(distFiles).toContain("Reveal.astro");
    expect(distFiles).toContain("index.d.ts");
    expect(distFiles.filter((file) => /(^|\/)test/.test(file))).toEqual([]);
  });

  it("ships the component uncompiled, as Astro compiles the components of dependencies", () => {
    expect(source("Reveal.astro")).toBe(readFileSync(new URL("src/Reveal.astro", root), "utf8"));
  });

  it("imports only its dependencies and peer dependencies", () => {
    const allowed = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies });
    const imports = [...jsFiles, "Reveal.astro"].flatMap((file) =>
      [...source(file).matchAll(/^\s*(?:import|export) (?:.* from )?"([^"]+)";$/gm)]
        .map(([, id]) => id!)
        .filter((id) => !id.startsWith("."))
        .map(packageName),
    );

    expect(imports.filter((id) => !allowed.includes(id))).toEqual([]);
  });

  it("exposes the public API of ./keyframes", async () => {
    expect(Object.keys(await load("./keyframes")).sort()).toEqual(
      [...factories, "defineKeyframes"].sort(),
    );
  });

  // Node cannot import a .astro file, so only a build with Astro loads the root entry.
  it("exports the component from the root entry, with declarations that plain TypeScript reads", () => {
    expect(source("index.js")).toContain('import Component from "./Reveal.astro";');
    expect(source("index.d.ts")).toContain("export declare const Reveal:");
    expect(source("index.d.ts")).not.toContain(".astro");
  });

  it("exports only the subpaths above and package.json", () => {
    expect(Object.keys(pkg.exports)).toEqual([".", "./keyframes", "./package.json"]);
  });
});

describe("a static build of a page with the published component", () => {
  let site: Site;

  beforeAll(async () => {
    site = await buildSite(
      Object.fromEntries(
        ["@awesome-reveal/astro", "@awesome-reveal/astro/keyframes"].map((specifier) => [
          specifier,
          resolve(specifier),
        ]),
      ),
    );
  }, 60_000);

  it("renders the element hidden", () => {
    expect(site.html.replace(/ data-astro-cid-\w+(="true")?/g, "")).toContain(
      '<div data-reveal="hidden"><p>hello</p></div>',
    );
  });

  it("bundles a small client script with no keyframes factories", () => {
    const code = scripts(site);

    expect(code).toMatch(/customElements\.define\(["`]awesome-reveal["`]/);
    // slide() runs in the frontmatter, so enter(), which it calls, stays on the server.
    expect(code).not.toContain("rotate");
    expect(code.length).toBeLessThan(2300);
  });
});

describeSkills(root, {
  keyframes: "@awesome-reveal/astro/keyframes",
  factories,
});
