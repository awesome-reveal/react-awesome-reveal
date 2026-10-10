import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({ staticImport: true })],
  build: {
    target: "esnext",
    minify: false,
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
    },
    rolldownOptions: {
      // Every bare import is a dependency or peer dependency, so none gets bundled.
      external: /^[^./](?!:[/\\])/,
      // Rolldown keeps the "use client" directive of the entry module, but still warns about it.
      checks: { moduleLevelDirective: false },
      // The .d.ts files carry the JSDoc; annotations stay for tree-shaking.
      output: { comments: { jsdoc: false } },
    },
  },
});
