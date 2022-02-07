import { useStaticQuery, graphql } from "gatsby"
import { useLocation } from "@reach/router"
import type { I18nFields, Locale as RawLocale } from "../../lib/locales"

// TODO: look into for automatic TS typing for GraphQL queries
// https://www.gatsbyjs.com/plugins/gatsby-typescript/
interface Node {
  name: string
  childI18NJson: I18nFields
}

export type Locale = RawLocale & {
  current: boolean
}

/**
 * Gatsby really wants to push everything, even simple stuff like JSON files in
 * a project folder, through a complicated GraphQL pipeline. This hook hides the
 * details of looking up the locale files in the `i18n` folder and makes them
 * easily accessible to any component that needs them. It also adds a `current`
 * field for the current locale based on the current route.
 */
export default function useLocales(): Locale[] {
  const { allFile } = useStaticQuery(
    graphql`
      query {
        allFile {
          edges {
            node {
              name
              childI18NJson {
                view_in
                lang_picker
                title
                description
                hero_title
                hero_body
                hero_cta
              }
            }
          }
        }
      }
    `
  )
  const { pathname } = useLocation()

  return allFile.edges.map(({ node }: { node: Node }) => ({
    current: new RegExp(`^/${node.name}`).test(pathname),
    id: node.name,
    i18n: node.childI18NJson,
  }))
}
