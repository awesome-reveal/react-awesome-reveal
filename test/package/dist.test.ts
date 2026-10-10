import { readdirSync, readFileSync } from "node:fs";

import { createElement } from "react";
import { renderToString } from "react-dom/server";

const root = new URL("../../", import.meta.url);
const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
const distFiles = readdirSync(new URL("dist/", root), { recursive: true, encoding: "utf8" });
const entry = new URL(pkg.exports["."].default, root);

describe("dist", () => {
  it("contains one JavaScript file, and declarations only for src", () => {
    expect(distFiles.filter((file) => /\.(c|m)?js$/.test(file))).toEqual(["index.js"]);
    expect(distFiles).toContain("index.d.ts");
    expect(distFiles.filter((file) => /(^|\/)test/.test(file))).toEqual([]);
  });

  it("starts with the 'use client' directive", () => {
    expect(readFileSync(entry, "utf8")).toMatch(/^["']use client["'];\n/);
  });

  it("keeps dependencies and peer dependencies external", () => {
    const source = readFileSync(entry, "utf8");
    const imports = [...source.matchAll(/^import .* from "([^"]+)";$/gm)].map(([, id]) => id);

    expect(imports.sort()).toEqual(
      [
        "@emotion/react",
        "@emotion/react/jsx-runtime",
        "react",
        "react-intersection-observer",
      ].sort(),
    );
  });

  it("exposes the public API", async () => {
    const mod = await import(entry.href);

    expect(mod.default).toBe(mod.Reveal);
    expect(Object.keys(mod).sort()).toEqual(
      [
        "AttentionSeeker",
        "Bounce",
        "Fade",
        "Flip",
        "Hinge",
        "JackInTheBox",
        "Reveal",
        "Roll",
        "Rotate",
        "Slide",
        "Zoom",
        "default",
      ].sort(),
    );
  });

  it("renders hidden content on the server", async () => {
    const { Fade } = await import(entry.href);

    const html = renderToString(createElement(Fade, null, createElement("p", null, "hello")));

    expect(html).toContain(">hello</p>");
    expect(html).toMatch(/opacity:\s*0/);
  });
});
