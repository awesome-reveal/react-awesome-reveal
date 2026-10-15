import { defineLibConfig, noStyle, revealCss } from "../../vite.lib.config.ts";

export default defineLibConfig(
  ["src/index.ts"],
  [revealCss(new URL("src/reveal.css", import.meta.url)), noStyle()],
);
