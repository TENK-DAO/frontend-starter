const { author, siteUrl } = require("./settings.json")
const { name } = require("./package.json")

// Build with env var PREFIX_PATHS=true to prefix all links & image paths with pathPrefix
// see https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/
export const pathPrefix = name

export const siteMetadata = {
  author: author,
  siteUrl: siteUrl,
}

export const plugins = [
  `gatsby-plugin-react-helmet`,
  `gatsby-transformer-json`,
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `i18n`,
      path: `${__dirname}/i18n`,
    },
  },
  `gatsby-plugin-image`,
  `gatsby-transformer-sharp`,
  `gatsby-plugin-sharp`,
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
      icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
    },
  },
  // this (optional) plugin enables Progressive Web App + Offline functionality
  // To learn more, visit: https://gatsby.dev/offline
  // `gatsby-plugin-offline`,
]
