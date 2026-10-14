import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import * as api from "../../dist/index.js";
import { describeDocs } from "@awesome-reveal/test-utils/docs";
import ts from "typescript";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

const root = new URL("../../", import.meta.url);
const dist = new URL("dist/", root);
const files = readdirSync(dist, { recursive: true, encoding: "utf8" });
const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
const { resolve } = createRequire(import.meta.url);
it("exposes only the framework primitives and package-owned CSS", () => {
  expect(resolve("@awesome-reveal/react")).toBe(new URL("index.js", dist).pathname);
  expect(Object.keys(api).sort()).toEqual(["Reveal", "useReveal"]);
  expect(Object.keys(pkg.exports)).toEqual([".", "./package.json"]);
  expect(files.some((f) => f.includes("keyframes") || f.includes("test"))).toBe(false);
  expect(readFileSync(new URL("reveal.css", dist), "utf8")).toBe(
    readFileSync(new URL("src/reveal.css", root), "utf8"),
  );
});
it("automatically imports SSR visibility CSS through its bindings", () => {
  expect(readFileSync(new URL("useReveal.js", dist), "utf8")).toContain('import "#reveal-style"');
});
it("renders hidden server content without setup", async () => {
  expect(renderToString(createElement(api.Reveal, {}, "hello"))).toBe(
    '<div data-reveal="hidden">hello</div>',
  );
});
describeDocs(root, {
  jsx: { jsx: ts.JsxEmit.ReactJSX },
  skipFences: /from ["']react-awesome-reveal["']/,
});
