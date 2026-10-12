import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import { build, type Rolldown } from "vite";

const root = fileURLToPath(new URL("../../", import.meta.url));
const { resolve } = createRequire(import.meta.url);

// Resolves through the package "exports" map, as consumers do.
const alias = ["@awesome-reveal/vue", "@awesome-reveal/vue/keyframes"].map((specifier) => ({
  find: new RegExp(`^${specifier}$`),
  replacement: resolve(specifier),
}));

async function bundle(fixture: string) {
  const output = (await build({
    configFile: false,
    logLevel: "silent",
    root,
    resolve: { alias },
    build: {
      write: false,
      minify: true,
      lib: {
        entry: fileURLToPath(new URL(`fixtures/${fixture}`, import.meta.url)),
        formats: ["es"],
      },
      rolldownOptions: { external: ["vue"] },
    },
  })) as Rolldown.RolldownOutput[];
  const chunk = output[0]!.output[0];

  const keptExports = Object.fromEntries(
    Object.entries(chunk.modules)
      .filter(([id]) => id.includes("/dist/"))
      // Keeps the package folder, so that core and vue modules stay apart.
      .map(([id, module]) => [
        id.slice(id.lastIndexOf("/", id.indexOf("/dist/") - 1) + 1),
        module.renderedExports,
      ]),
  );
  // Rolldown's //#region comments are not code.
  const code = chunk.code.replace(/^\/\/#(end)?region.*\n/gm, "");
  return { keptExports, size: code.length };
}

describe("consumer bundle", () => {
  it("keeps only the modules and exports that it imports", async () => {
    const { keptExports, size } = await bundle("reveal-slide.js");

    expect(keptExports).toEqual({
      "vue/dist/Reveal.js": ["Reveal"],
      "core/dist/keyframes/enter.js": ["enter"],
      "core/dist/keyframes/presets.js": ["slide"],
      "core/dist/observe.js": ["observe"],
      "core/dist/play.js": ["play", "defaultKeyframes"],
      "core/dist/report.js": ["report"],
      "core/dist/reveal.js": ["hiddenStyle"],
    });
    expect(size).toBeLessThan(3500);
  });

  it("keeps neither Reveal nor keyframes factories for the directive alone", async () => {
    const { keptExports, size } = await bundle("directive-only.js");

    expect(keptExports).toEqual({
      "vue/dist/vReveal.js": ["vReveal"],
      "core/dist/observe.js": ["observe"],
      "core/dist/play.js": ["play", "defaultKeyframes"],
      "core/dist/report.js": ["report"],
      "core/dist/reveal.js": ["hiddenStyle", "reveal", "createReveal"],
    });
    expect(size).toBeLessThan(3350);
  });
});
