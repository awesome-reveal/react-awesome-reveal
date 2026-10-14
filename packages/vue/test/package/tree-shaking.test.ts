import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import { build, type Rolldown } from "vite";

const root = fileURLToPath(new URL("../../", import.meta.url));
const { resolve } = createRequire(import.meta.url);

// Resolves through the package "exports" map, as consumers do.
const alias = ["@awesome-reveal/vue"].map((specifier) => ({
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
    const { keptExports, size } = await bundle("reveal-only.js");

    expect(keptExports["core/dist/adapter.js"]).toContain("createReveal");
    expect(size).toBeLessThan(5650);
  });

  it("keeps no Reveal component for the directive alone", async () => {
    const { keptExports, size } = await bundle("directive-only.js");

    expect(keptExports["core/dist/adapter.js"]).toContain("createReveal");
    expect(size).toBeLessThan(5450);
    expect(keptExports).not.toHaveProperty("vue/dist/Reveal.js");
  });
});
