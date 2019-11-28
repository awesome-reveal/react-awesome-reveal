module.exports = {
  siteMetadata: {
    title: `React Awesome Reveal`,
    description: `Playground to test React Awesome Reveal features.`,
    author: `@dennismorello`,
  },
  pathPrefix: `/docs`,
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-chakra-ui`,
      options: {
        isResettingCSS: true,
        isUsingColorMode: true,
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
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `React Awesome Reveal`,
        short_name: `reveal`,
        start_url: `docs/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        workboxConfig: {
          modifyURLPrefix: {
            "/": `docs/`,
          },
        },
      },
    },
  ],
}
