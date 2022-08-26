const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("active-link", "&[aria-current=page]");
      addVariant("!active-link", "&[aria-current=false]");
    }),
  ],
};
