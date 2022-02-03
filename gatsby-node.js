const { getLocales } = require("./lib/locales")

const locales = getLocales()

exports.createPages = async ({ actions }) => {
  locales.forEach(locale => {
    actions.createPage({
      path: locale.id,
      component: require.resolve("./src/templates/[locale].tsx"),
      context: { locale },
    })
  })
}
