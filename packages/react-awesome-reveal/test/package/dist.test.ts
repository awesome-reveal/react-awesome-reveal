import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const root = new URL("../../", import.meta.url);
const dist = new URL("dist/", root);
const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
const distFiles = readdirSync(dist, { recursive: true, encoding: "utf8" });
const { resolve } = createRequire(import.meta.url);

// Resolves through the package "exports" map, as consumers do.
function load(specifier: string) {
  return import(pathToFileURL(resolve(specifier)).href);
}

describe("dist", () => {
  it("contains only the two re-export modules and their declarations", () => {
    expect(distFiles.sort()).toEqual(["index.d.ts", "index.js", "keyframes.d.ts", "keyframes.js"]);
  });

  it.each([".", "./keyframes"])(
    "re-exports the same values as @awesome-reveal/react%s",
    async (subpath) => {
      const compat = await load(`react-awesome-reveal${subpath.slice(1)}`);
      const target = await load(`@awesome-reveal/react${subpath.slice(1)}`);

      expect(Object.keys(compat).sort()).toEqual(Object.keys(target).sort());
      for (const name of Object.keys(target)) {
        expect(compat[name]).toBe(target[name]);
      }
    },
  );

  it("exports only the subpaths of @awesome-reveal/react", () => {
    expect(Object.keys(pkg.exports)).toEqual([".", "./keyframes", "./package.json"]);
  });
});

describe("skills", () => {
  // v4 users approve the skills of this package, not those of @awesome-reveal/react.
  it("ships the migrating-from-v4 skill of @awesome-reveal/react unchanged", () => {
    const skill = "skills/migrating-from-v4/SKILL.md";
    const react = new URL("../react/", root);

    expect(pkg.files).toContain("skills");
    expect(readFileSync(new URL(skill, root), "utf8")).toBe(
      readFileSync(new URL(skill, react), "utf8"),
    );
  });
});
