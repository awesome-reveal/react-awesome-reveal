module.exports = {
  siteMetadata: {
    title: `React Awesome Reveal`,
    description: `Playground to showcase React Awesome Reveal effects and features.`,
    githubUrl: `https://github.com/morellodev/react-awesome-reveal`,
    siteUrl: `https://react-awesome-reveal.morello.dev`,
    author: {
      name: `Dennis Morello`,
      twitter: `@morellodev`,
      website: `https://morello.dev`,
    },
    keywords: [
      `gatsby`,
      `js`,
      `javascript`,
      `typescript`,
      `react`,
      `reactjs`,
      `web`,
      `webdev`,
      `library`,
      `npm`,
      `yarn`,
      `node`,
      `nodejs`,
    ],
  },
  pathPrefix: `/docs`,
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `@chakra-ui/gatsby-plugin`,
      options: {
        isResettingCSS: true,
        isUsingColorMode: false,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: process.env.GTM_ID,
      },
    },
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-robots-txt`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `React Awesome Reveal`,
        short_name: `Reveal`,
        start_url: `docs/`,
        background_color: `#1A202C`,
        theme_color: `#1A202C`,
        display: `standalone`,
        icon: `src/images/logo.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    /*{
      resolve: `gatsby-plugin-offline`,
      options: {
        workboxConfig: {
          modifyURLPrefix: {
            "/": `docs/`,
          },
        },
      },
    },*/
  ],
};
