/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import pkg from "./package.json";

export default defineConfig({
  plugins: [
    dts({
      entryRoot: "src",
      staticImport: true,
      rollupTypes: false,
    }),
    react(),
  ],
  build: {
    target: "esnext",
    minify: false,
    sourcemap: true,
    lib: {
      entry: "src/index.ts",
    },
    rollupOptions: {
      external: [
        ...Object.keys(pkg.dependencies),
        ...Object.keys(pkg.peerDependencies),
        "react/jsx-runtime",
        "@emotion/react/jsx-runtime",
      ],
      output: [
        {
          format: "cjs",
          exports: "named",
          entryFileNames: "[name].cjs",
        },
        {
          format: "es",
          exports: "named",
          entryFileNames: "[name].js",
        },
      ],
    },
  },
});
