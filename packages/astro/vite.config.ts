import { readFile } from "node:fs/promises";

import { defineLibConfig } from "../../vite.lib.config.ts";

const components = ["Reveal.astro", "Cascade.astro", "Host.astro"];

// Astro compiles the .astro files of dependencies, so the components ship uncompiled.
export default defineLibConfig(
  ["src/index.ts", "src/element.ts", "src/tags.ts"],
  [
    {
      name: "ship-astro-components",
      enforce: "pre",
      resolveId(id) {
        return components.some((file) => id === `./${file}`) ? { id, external: true } : null;
      },
      async generateBundle() {
        for (const fileName of [...components, "reveal.css"])
          this.emitFile({
            type: "asset",
            fileName,
            source: await readFile(new URL(`src/${fileName}`, import.meta.url), "utf8"),
          });
      },
    },
  ],
);
