import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  sourcemap: true,
  clean: true,
  splitting: true,
  minify: true,
  dts: true,
  format: ["cjs", "esm"],
});
