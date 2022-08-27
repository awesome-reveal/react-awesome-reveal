import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import { h } from "hastscript";

const AnchorLinkIcon = h(
  "svg",
  {
    version: 1.1,
    viewBox: "0 0 24 24",
    xlmns: "http://www.w3.org/2000/svg",
  },
  h("path", {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101m-.758-4.899a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656l-1.1 1.1",
  })
);

// https://astro.build/config
export default defineConfig({
  site: "https://react-awesome-reveal.morello.dev",
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: ["remark-gfm", "remark-smartypants", "remark-emoji"],
    rehypePlugins: [
      "rehype-slug",
      [
        "rehype-autolink-headings",
        {
          properties: {
            class: "h-link",
          },
          behavior: "after",
          group: (props) =>
            h(`div.h-wrapper.level-${props.tagName}`, { tabIndex: -1 }),
          content: h(`span.h-icon`, { ariaHidden: "true" }, AnchorLinkIcon),
        },
      ],
    ],
  },
  vite: {
    ssr: {
      external: ["svgo"],
    },
  },
});
