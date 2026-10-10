import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const root = new URL("../../", import.meta.url);
const dist = new URL("dist/", root);
const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
const distFiles = readdirSync(dist, { recursive: true, encoding: "utf8" });
const jsFiles = distFiles.filter((file) => /\.(c|m)?js$/.test(file)).sort();
const { resolve } = createRequire(import.meta.url);

// Resolves through the package "exports" map, as consumers do.
function load(subpath: string) {
  return import(pathToFileURL(resolve(`@awesome-reveal/core${subpath.slice(1)}`)).href);
}

function source(file: string): string {
  return readFileSync(new URL(file, dist), "utf8");
}

describe("dist", () => {
  it("contains one JavaScript file per source module, and declarations only for src", () => {
    expect(jsFiles).toEqual([
      "keyframes/define.js",
      "keyframes/enter.js",
      "keyframes/index.js",
      "keyframes/presets.js",
    ]);
    expect(distFiles).toContain("keyframes/index.d.ts");
    expect(distFiles.filter((file) => /(^|\/)test/.test(file))).toEqual([]);
  });

  it.each(jsFiles)("has a source module for %s and no 'use client' directive", (file) => {
    expect(existsSync(new URL(`src/${file.replace(/\.js$/, ".ts")}`, root))).toBe(true);
    expect(source(file)).not.toMatch(/^["']use client["'];/);
  });

  it("imports nothing outside the package", () => {
    const imports = jsFiles.flatMap((file) =>
      [...source(file).matchAll(/^(?:import|export) (?:.* from )?"([^"]+)";$/gm)]
        .map(([, id]) => id!)
        .filter((id) => !id.startsWith(".")),
    );

    expect(imports).toEqual([]);
  });

  it("exposes the public API of ./keyframes", async () => {
    expect(Object.keys(await load("./keyframes")).sort()).toEqual([
      "blur",
      "defineKeyframes",
      "enter",
      "fade",
      "scale",
      "slide",
    ]);
  });

  it("exports only the subpaths above and package.json", () => {
    expect(Object.keys(pkg.exports)).toEqual(["./keyframes", "./package.json"]);
  });
});
