const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Mona Sans", ...defaultTheme.fontFamily.sans],
      },
      zIndex: {
        "-1": "-1",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    plugin(({ addVariant }) => {
      addVariant("active-link", "&[aria-current=page]");
    }),
  ],
};
