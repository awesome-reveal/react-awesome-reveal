const pkg = require("../lib/package.json");

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "React Awesome Reveal",
  tagline: "Add revealing animations to your website with ease",
  url: pkg.homepage,
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "morellodev", // Usually your GitHub org/user name.
  projectName: pkg.name, // Usually your repo name.
  themeConfig: {
    colorMode: {
      disableSwitch: true,
    },
    navbar: {
      title: "React Awesome Reveal",
      logo: {
        alt: "React Awesome Reveal Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "doc",
          docId: "intro",
          label: "Docs",
          position: "left",
        },
        {
          type: "doc",
          docId: "effects/attention-seekers",
          label: "Effects",
          position: "left",
        },
        {
          href: pkg.repository.url,
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Introduction",
              to: "/docs/intro",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Twitter",
              href: "https://twitter.com/morellodev",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: pkg.repository.url,
            },
          ],
        },
      ],
      copyright: `Copyleft <span class="copyleft">&copy;</span> ${new Date().getFullYear()} Dennis Morello`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          remarkPlugins: [
            [require("@docusaurus/remark-plugin-npm2yarn"), { sync: true }],
          ],
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  themes: [
    "@docusaurus/theme-live-codeblock",
    [require.resolve("@easyops-cn/docusaurus-search-local"), { hashed: true }],
  ],
};
