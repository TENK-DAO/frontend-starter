import { GatsbyNode } from "gatsby"
import { getLocales } from "./lib/locales"

const locales = getLocales()

export const createPages: GatsbyNode["createPages"] = async ({ actions }) => {
  locales.forEach(locale => {
    actions.createPage({
      path: locale.id,
      component: require.resolve("./src/templates/[locale].tsx"),
      context: { locale },
    })
  })
}
