import settings from "./config/settings.json"
import pkg from "./package.json"

// Build with env var PREFIX_PATHS=true to prefix all links & image paths with pathPrefix
// see https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/
export const pathPrefix = pkg.name

export const siteMetadata = settings

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
  `gatsby-transformer-inline-svg`,
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `images`,
      path: `${__dirname}/config/images`,
    },
  },
  {
    // See https://www.gatsbyjs.com/plugins/gatsby-plugin-image/
    resolve: `gatsby-plugin-sharp`,
    options: {
      defaults: {
        formats: [`auto`, `avif`, `webp`],
        placeholder: `blurred`,
      },
    },
  },
  `gatsby-transformer-sharp`,
  `gatsby-plugin-image`,
  {
    resolve: `gatsby-plugin-manifest`,
    options: {
      name: pkg.name,
      short_name: pkg.name,
      start_url: `/`,
      background_color: `#663399`,
      // This will impact how browsers show your PWA/website
      // https://css-tricks.com/meta-theme-color-and-trickery/
      // theme_color: `#663399`,
      display: `minimal-ui`,
      icon: `config/images/favicon.png`, // This path is relative to the root of the site.
    },
  },
  `gatsby-plugin-sass`,
  // this (optional) plugin enables Progressive Web App + Offline functionality
  // To learn more, visit: https://gatsby.dev/offline
  // `gatsby-plugin-offline`,
]
