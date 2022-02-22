import { useStaticQuery, graphql } from "gatsby"
import { useLocation } from "@reach/router"
import type { AllLocalesQuery } from "../../graphql-types"

type I18n = AllLocalesQuery["allFile"]["nodes"][number]["childI18NJson"]
type Locale = NonNullable<I18n> & {
  id: string
}

/**
 * Gatsby really wants to push everything, even simple stuff like JSON files in
 * a project folder, through a complicated GraphQL pipeline. This hook hides the
 * details of looking up the locale files in the `i18n` folder and makes them
 * easily accessible to any component that needs them. It also adds a `current`
 * field for the current locale based on the current route.
 */
export default function useLocales(): { locales: Locale[]; locale?: Locale } {
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
              signOut
              myNFTs
            }
          }
        }
      }
    `
  )
  const { pathname } = useLocation()

  const locales = allFile.nodes.map(node => ({
    id: node.name,
    ...node.childI18NJson!,
  }))

  const locale = locales.find(l => new RegExp(`/${l.id}`).test(pathname))

  return { locales, locale }
}
