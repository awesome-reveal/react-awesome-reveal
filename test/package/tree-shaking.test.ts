import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import { build, type Rolldown } from "vite";

const root = fileURLToPath(new URL("../../", import.meta.url));
const { resolve } = createRequire(import.meta.url);

// Resolves through the package "exports" map, as consumers do.
const alias = ["react-awesome-reveal", "react-awesome-reveal/keyframes"].map((specifier) => ({
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
      rolldownOptions: { external: ["react"] },
    },
  })) as Rolldown.RolldownOutput[];
  const chunk = output[0]!.output[0];

  const keptExports = Object.fromEntries(
    Object.entries(chunk.modules)
      .filter(([id]) => id.includes("/dist/"))
      .map(([id, module]) => [id.slice(id.indexOf("/dist/") + 1), module.renderedExports]),
  );
  return { keptExports, size: chunk.code.length };
}

describe("consumer bundle", () => {
  it("keeps only the modules and exports that it imports", async () => {
    const { keptExports, size } = await bundle("reveal-slide.js");

    expect(keptExports).toEqual({
      "dist/Reveal.js": ["Reveal"],
      "dist/useReveal.js": ["useReveal"],
      "dist/keyframes/enter.js": ["enter"],
      "dist/keyframes/presets.js": ["slide"],
    });
    expect(size).toBeLessThan(3300);
  });

  it("keeps neither Reveal nor keyframes for the hook alone", async () => {
    const { keptExports, size } = await bundle("hook-only.js");

    expect(keptExports).toEqual({ "dist/useReveal.js": ["useReveal"] });
    expect(size).toBeLessThan(1450);
  });
});
