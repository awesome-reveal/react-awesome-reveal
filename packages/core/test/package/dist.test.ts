import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import * as api from "../../dist/index.js";
import * as adapter from "../../dist/adapter.js";
import { describeDocs } from "@awesome-reveal/test-utils/docs";

const root = new URL("../../", import.meta.url);
const dist = new URL("dist/", root);
const files = readdirSync(dist, { recursive: true, encoding: "utf8" });
const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
const { resolve } = createRequire(import.meta.url);

it("exports exactly the frozen runtime and adapter boundary", () => {
  expect(Object.keys(api).sort()).toEqual(["cascade", "reveal"]);
  expect(Object.keys(adapter).sort()).toEqual([
    "cascadeHiddenAttributes",
    "createCascade",
    "createReveal",
    "hiddenAttributes",
  ]);
  expect(Object.keys(pkg.exports).sort()).toEqual([".", "./adapter", "./package.json"]);
  expect(pkg.sideEffects).toBe(false);
  expect(resolve("@awesome-reveal/core")).toBe(new URL("index.js", dist).pathname);
});
it("ships no DSL or stylesheet and declarations contain no obsolete public APIs", () => {
  expect(files.some((f) => f.includes("keyframes") || f.endsWith(".css"))).toBe(false);
  expect(files.some((f) => f.includes("test"))).toBe(false);
  const declarations = files
    .filter((f) => f.endsWith(".d.ts"))
    .map((f) => readFileSync(new URL(f, dist), "utf8"))
    .join("\n");
  expect(declarations).toContain("keyframes: Keyframe[]");
  expect(readFileSync(new URL("index.d.ts", dist), "utf8")).not.toMatch(
    /createReveal|RevealStore|hiddenAttributes|setOptions/,
  );
});
describeDocs(root);
