import { readFile } from "node:fs/promises";

import { defineLibConfig } from "../../vite.lib.config.ts";

// Astro compiles the .astro files of dependencies, so the component ships uncompiled.
export default defineLibConfig(
  ["src/index.ts", "src/element.ts"],
  [
    {
      name: "ship-astro-components",
      enforce: "pre",
      resolveId(id) {
        return id === "./Reveal.astro" ? { id, external: true } : null;
      },
      async generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "reveal.css",
          source: await readFile(new URL("src/reveal.css", import.meta.url), "utf8"),
        });
        this.emitFile({
          type: "asset",
          fileName: "Reveal.astro",
          source: await readFile(new URL("src/Reveal.astro", import.meta.url), "utf8"),
        });
      },
    },
  ],
);
