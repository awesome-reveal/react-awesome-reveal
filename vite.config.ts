import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({ staticImport: true })],
  build: {
    target: "esnext",
    minify: false,
    lib: {
      entry: "src/index.ts",
    },
    rolldownOptions: {
      // Every bare import is a dependency or peer dependency, so none gets bundled.
      external: /^[^./](?!:[/\\])/,
      // Rolldown keeps the "use client" directive of the entry module, but still warns about it.
      checks: { moduleLevelDirective: false },
      // The .d.ts files carry the JSDoc; annotations stay for tree-shaking.
      output: [
        {
          format: "cjs",
          exports: "named",
          entryFileNames: "[name].cjs",
          strict: true,
          comments: { jsdoc: false },
        },
        {
          format: "es",
          exports: "named",
          entryFileNames: "[name].js",
          comments: { jsdoc: false },
        },
      ],
    },
  },
});
