const { author, siteUrl } = require("./config/settings.json")
const { name } = require("./package.json")

// Build with env var PREFIX_PATHS=true to prefix all links & image paths with pathPrefix
// see https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/
export const pathPrefix = name

export const siteMetadata = {
  author: author,
  siteUrl: siteUrl,
}

export const plugins = [
  // generates `./graphql-types.ts`
  `gatsby-plugin-graphql-codegen`,
  // generates `./schema.graphql`, which is referenced by `.graphqlrc.yml`, used by VS Code plugin GraphQL.vscode-graphql
  `gatsby-plugin-extract-schema`,
  // types for CSS modules
  `gatsby-plugin-dts-css-modules`,
  `gatsby-plugin-react-helmet`,
  `gatsby-transformer-json`,
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `i18n`,
      path: `${__dirname}/config/i18n`,
    },
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `images`,
      path: `${__dirname}/config/images`,
    },
  },
  `gatsby-plugin-image`,
  `gatsby-transformer-sharp`,
  {
    // See https://www.gatsbyjs.com/plugins/gatsby-plugin-image/
    resolve: `gatsby-plugin-sharp`,
    options: {
      defaults: {
        formats: [`auto`, `webp`],
        placeholder: `dominantColor`,
        quality: 50,
        breakpoints: [750, 1080, 1366, 1920],
        backgroundColor: `transparent`,
        tracedSVGOptions: {},
        blurredOptions: {},
        jpgOptions: {},
        pngOptions: {},
        webpOptions: {},
        avifOptions: {},
      },
    },
  },
  {
    resolve: `gatsby-plugin-manifest`,
    options: {
      name: `gatsby-starter-default`,
      short_name: `starter`,
      start_url: `/`,
      background_color: `#663399`,
      // This will impact how browsers show your PWA/website
      // https://css-tricks.com/meta-theme-color-and-trickery/
      // theme_color: `#663399`,
      display: `minimal-ui`,
      icon: `config/images/hero.png`, // This path is relative to the root of the site.
    },
  },
  `gatsby-plugin-sass`,
  // this (optional) plugin enables Progressive Web App + Offline functionality
  // To learn more, visit: https://gatsby.dev/offline
  // `gatsby-plugin-offline`,
]
