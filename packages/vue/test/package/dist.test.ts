import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import * as api from "../../dist/index.js";
import { describeDocs } from "@awesome-reveal/test-utils/docs";
import { createSSRApp, h, withDirectives } from "vue";
import { renderToString } from "vue/server-renderer";

const root = new URL("../../", import.meta.url);
const dist = new URL("dist/", root);
const files = readdirSync(dist, { recursive: true, encoding: "utf8" });
const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
const { resolve } = createRequire(import.meta.url);
it("exposes only the framework primitives and package-owned CSS", () => {
  expect(resolve("@awesome-reveal/vue")).toBe(new URL("index.js", dist).pathname);
  expect(Object.keys(api).sort()).toEqual(["Reveal", "vReveal"]);
  expect(Object.keys(pkg.exports)).toEqual([".", "./package.json"]);
  expect(files.some((f) => f.includes("keyframes") || f.includes("test"))).toBe(false);
  expect(readFileSync(new URL("reveal.css", dist), "utf8")).toBe(
    readFileSync(new URL("src/reveal.css", root), "utf8"),
  );
});
it("automatically imports SSR visibility CSS through its bindings", () => {
  for (const file of ["Reveal.js", "vReveal.js"])
    expect(readFileSync(new URL(file, dist), "utf8")).toContain('import "#reveal-style"');
});
it("renders hidden server content without setup", async () => {
  const html = await renderToString(
    createSSRApp(() => [
      h(api.Reveal, {}, () => "hello"),
      withDirectives(h("p", "hello"), [[api.vReveal, {}]]),
    ]),
  );
  expect(html).toContain('<div data-reveal="hidden">hello</div>');
  expect(html).toContain('<p data-reveal="hidden">hello</p>');
});
describeDocs(root, {
  ambient:
    'declare module "*.vue" { const component: import("vue").Component; export default component; }',
});
