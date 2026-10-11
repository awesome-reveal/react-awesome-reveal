import { defineConfig, type PluginOption } from "vite";
import dts from "vite-plugin-dts";

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
        // Every bare import is a dependency or peer dependency, so none gets bundled.
        external: /^[^./](?!:[/\\])/,
        // Rolldown keeps the "use client" directive of each preserved module, but still warns about it.
        checks: { moduleLevelDirective: false },
        output: {
          // One file per module lets bundlers drop unused modules through "sideEffects": false.
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
