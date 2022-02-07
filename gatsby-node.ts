import { GatsbyNode } from "gatsby"
import { locales } from "./lib/locales"

export const createPages: GatsbyNode["createPages"] = ({ actions }) => {
  locales.forEach(locale => {
    actions.createPage({
      path: locale.id,
      component: require.resolve("./src/templates/[locale].tsx"),
      context: { locale },
    })
  })
}
