import { readFile } from "node:fs/promises";

import { defineLibConfig } from "../../vite.lib.config.ts";

// Astro compiles the .astro files of dependencies, so the component ships uncompiled.
export default defineLibConfig(
  ["src/index.ts", "src/keyframes.ts", "src/element.ts"],
  [
    {
      name: "copy-astro-components",
      async generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "Reveal.astro",
          source: await readFile("src/Reveal.astro", "utf8"),
        });
      },
    },
  ],
);
