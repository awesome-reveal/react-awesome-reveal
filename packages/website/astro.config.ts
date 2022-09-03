import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

import rehypeAutolinkHeadings from "./plugins/rehypeAutolinkHeadings";
import rehypeExternalLinks from "./plugins/rehypeExternalLinks";

// https://astro.build/config
export default defineConfig({
  site: "https://react-awesome-reveal.morello.dev",
  integrations: [tailwind(), sitemap()],
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: ["remark-emoji", "@fec/remark-a11y-emoji"],
    rehypePlugins: ["rehype-slug", rehypeAutolinkHeadings, rehypeExternalLinks],
  },
  vite: {
    ssr: {
      external: ["svgo"],
    },
  },
});
