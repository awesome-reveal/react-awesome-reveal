import { readFile } from "node:fs/promises";

import { defineConfig, type Plugin, type PluginOption } from "vite";
import dts from "vite-plugin-dts";

/** Emits reveal.css for the browser build, and an empty module for the `node` import condition. */
export function revealCss(css: URL): Plugin {
  return {
    name: "reveal-css",
    async generateBundle() {
      this.emitFile({ type: "asset", fileName: "reveal.css", source: await readFile(css, "utf8") });
      this.emitFile({ type: "asset", fileName: "reveal.css.d.ts", source: "export {};\n" });
      this.emitFile({ type: "asset", fileName: "no-style.js", source: "export {};\n" });
      this.emitFile({ type: "asset", fileName: "no-style.d.ts", source: "export {};\n" });
    },
  };
}

/** `plugins` takes the compiler plugin of the framework, if it has one. */
export function defineLibConfig(entry: string[], plugins: PluginOption[] = []) {
  return defineConfig({
    // The tsconfig paths point to the sources of other packages; declarations must keep the package imports.
    plugins: [...plugins, dts({ entryRoot: "src", staticImport: true, pathsToAliases: false })],
    build: {
      target: "esnext",
      minify: false,
      lib: { entry, formats: ["es"] },
      rolldownOptions: {
        // Every bare import is a dependency or peer dependency, so the build bundles none of them.
        external: /^[^./](?!:[/\\])/,
        // Rolldown keeps the "use client" directive of each preserved module, but still warns about it.
        checks: { moduleLevelDirective: false },
        output: {
          // One file per module lets bundlers drop unused modules, because "sideEffects" is false or lists only the CSS.
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].js",
          // The .d.ts files carry the JSDoc; annotations stay for tree-shaking.
          comments: { jsdoc: false },
        },
      },
    },
  });
}
