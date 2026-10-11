import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { createElement } from "react";
import { renderToString } from "react-dom/server";
import ts from "typescript";

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
  // A missing folder fails the first test below, not the whole file.
  const skills = existsSync(skillsDir)
    ? readdirSync(skillsDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
    : [];

  function skillText(skill: string): string {
    return readFileSync(new URL(`${skill}/SKILL.md`, skillsDir), "utf8");
  }

  it("ships the skills folder, where pnpm links skills from", () => {
    expect(skills.length).toBeGreaterThan(0);
    expect(pkg.files).toContain("skills");
  });

  it.each(skills)(
    "names the %s skill after its folder, as the Agent Skills spec requires",
    (skill) => {
      const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(skillText(skill))?.[1] ?? "";
      const fields: Record<string, string> = Object.fromEntries(
        frontmatter.split(/\r?\n/).flatMap((line) => {
          const field = /^([\w-]+):\s*(.*)$/.exec(line);
          return field ? [[field[1], field[2]]] : [];
        }),
      );

      expect(fields.name).toBe(skill);
      expect(fields.description).toBeTruthy();
      expect(fields.description!.length).toBeLessThanOrEqual(1024);
    },
  );

  // v4 examples import react-awesome-reveal, which is not installed.
  it("type-checks the TypeScript examples and inline factory calls against the package types", () => {
    const files = new Map<string, string>();
    for (const skill of skills) {
      const text = skillText(skill);
      const fences = [...text.matchAll(/^```tsx?\r?\n([\s\S]*?)^```$/gm)]
        .map(([, code]) => code!)
        .filter((code) => !/from ["']react-awesome-reveal["']/.test(code));
      const calls = [...text.matchAll(/`((?:blur|enter|fade|scale|slide)\([^`]*\))`/g)].map(
        ([, call]) => call!,
      );
      fences.forEach((code, index) =>
        files.set(fileURLToPath(new URL(`${skill}/example-${index + 1}.tsx`, skillsDir)), code),
      );
      files.set(
        fileURLToPath(new URL(`${skill}/factory-calls.ts`, skillsDir)),
        `import { blur, enter, fade, scale, slide } from "@awesome-reveal/react/keyframes";\n` +
          `export const calls = [blur, enter, fade, scale, slide, ${calls.join(", ")}];\n`,
      );
    }

    const options: ts.CompilerOptions = {
      jsx: ts.JsxEmit.ReactJSX,
      lib: ["lib.esnext.d.ts", "lib.dom.d.ts"],
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      noEmit: true,
      skipLibCheck: true,
      strict: true,
      target: ts.ScriptTarget.ESNext,
      types: [],
    };
    const host = ts.createCompilerHost(options);
    const { fileExists, readFile, getSourceFile } = host;
    host.fileExists = (file) => files.has(file) || fileExists(file);
    host.readFile = (file) => files.get(file) ?? readFile(file);
    host.getSourceFile = (file, language, ...rest) =>
      files.has(file)
        ? ts.createSourceFile(file, files.get(file)!, language)
        : getSourceFile(file, language, ...rest);

    const program = ts.createProgram([...files.keys()], options, host);
    const errors = ts.getPreEmitDiagnostics(program).map((diagnostic) => {
      const file = diagnostic.file
        ? relative(fileURLToPath(skillsDir), diagnostic.file.fileName)
        : "";
      return `${file}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`;
    });

    expect(files.size).toBeGreaterThan(skills.length);
    expect(errors).toEqual([]);
  }, 30_000);
});
