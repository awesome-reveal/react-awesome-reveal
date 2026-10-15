import { defineLibConfig, revealCss } from "../../vite.lib.config.ts";

// A strict pnpm install hides transitive dependencies, so compat users cannot import the React stylesheet.
export default defineLibConfig(
  ["src/index.ts"],
  [revealCss(new URL("../react/src/reveal.css", import.meta.url))],
);
