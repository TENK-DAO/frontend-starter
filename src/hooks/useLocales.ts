import { useStaticQuery, graphql } from "gatsby"
import { useLocation } from "@reach/router"
import type { AllLocalesQuery } from "../../graphql-types"

/**
 * Gatsby really wants to push everything, even simple stuff like JSON files in
 * a project folder, through a complicated GraphQL pipeline. This hook hides the
 * details of looking up the locale files in the `i18n` folder and makes them
 * easily accessible to any component that needs them. It also adds a `current`
 * field for the current locale based on the current route.
 */
export default function useLocales() {
  const { allFile }: AllLocalesQuery = useStaticQuery(
    graphql`
      query AllLocales {
        allFile(filter: { sourceInstanceName: { eq: "i18n" } }) {
          nodes {
            name
            childI18NJson {
              viewIn
              langPicker
              title
              description
              connectWallet
            }
          }
        }
      }
    `
  )
  const { pathname } = useLocation()

  return allFile.nodes.map(node => ({
    current: new RegExp(`/${node.name}`).test(pathname),
    id: node.name,
    i18n: node.childI18NJson!,
  }))
}
