import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import remarkA11yEmoji from "@fec/remark-a11y-emoji";
import { defineConfig } from "astro/config";
import rehypeSlug from "rehype-slug";
import remarkEmoji from "remark-emoji";

import rehypeExternalLinks from "./plugins/rehypeExternalLinks";

// https://astro.build/config
export default defineConfig({
  site: "https://react-awesome-reveal.morello.dev",
  integrations: [tailwind(), sitemap()],
  markdown: {
    remarkPlugins: [remarkEmoji, remarkA11yEmoji],
    rehypePlugins: [rehypeSlug, rehypeExternalLinks],
  },
  vite: {
    ssr: {
      external: ["svgo"],
    },
  },
});
