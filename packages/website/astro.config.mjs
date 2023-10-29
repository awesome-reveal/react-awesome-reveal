import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
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
    }),
  ],
});
