import node from "@astrojs/node";
import { defineConfig } from "astro/config";

export default defineConfig({
  // Server islands render on demand, so they need an adapter.
  adapter: node({ mode: "standalone" }),
});
