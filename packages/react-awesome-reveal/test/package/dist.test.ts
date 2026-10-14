import { readdirSync, readFileSync } from "node:fs";

const root = new URL("../../", import.meta.url);
const dist = new URL("dist/", root);
const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
const distFiles = readdirSync(dist, { recursive: true, encoding: "utf8" });

describe("dist", () => {
  it("ships only the React re-export and its declarations", () => {
    expect(distFiles.sort()).toEqual(["index.d.ts", "index.js"]);
    expect(Object.keys(pkg.exports)).toEqual([".", "./package.json"]);
    expect(readFileSync(new URL("index.js", dist), "utf8")).toContain("@awesome-reveal/react");
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
