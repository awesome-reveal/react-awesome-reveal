import node from "@astrojs/node";
import { defineConfig } from "astro/config";

export default defineConfig({
  // Server islands render on demand, so they need an adapter.
  adapter: node({ mode: "standalone" }),
  // The hidden state must work without style attributes, which a hashed CSP blocks.
  security: { csp: true },
});
