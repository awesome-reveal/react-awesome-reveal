import partytown from "@astrojs/partytown";
import starlight from "@astrojs/starlight";
import vercel from "@astrojs/vercel/static";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  site: "https://react-awesome-reveal.morello.dev",
  integrations: [
    starlight({
      title: "React Awesome Reveal",
      social: {
        email: "mailto:dennis@morello.dev",
        github: "https://github.com/morellodev/react-awesome-reveal",
        linkedin: "https://www.linkedin.com/in/dennismorello",
        "x.com": "https://x.com/morellodev",
      },
      sidebar: [
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
        },
      ],
      head: [
        {
          tag: "script",
          attrs: {
            type: "text/partytown",
            src: "https://www.googletagmanager.com/gtag/js?id=GTM-PNLQX9W4",
          },
        },
        {
          tag: "script",
          attrs: {
            type: "text/partytown",
          },
          content:
            "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','GTM-PNLQX9W4');",
        },
      ],
    }),
    partytown({ config: { forward: ["dataLayer.push"] } }),
  ],
});
