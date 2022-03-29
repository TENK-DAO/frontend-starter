import { useStaticQuery, graphql } from "gatsby"
import { useLocation } from "@reach/router"
import type { AllLocalesQuery } from "../../graphql-types"

type I18n = NonNullable<AllLocalesQuery["allFile"]["nodes"][number]["childI18NJson"]>

export type Locale = {
  id: string
} & {
  [K in keyof I18n]: NonNullable<I18n[K]>
}

/**
 * Gatsby really wants to push everything, even simple stuff like JSON files in
 * a project folder, through a complicated GraphQL pipeline. This hook hides the
 * details of looking up the locale files in the `i18n` folder and makes them
 * easily accessible to any component that needs them.
 *
 * @returns the list of all `locales`, as well as the current `locale` given by the URL
 */
export default function useLocales(): { locales: Locale[]; locale?: Locale } {
  const { allFile }: AllLocalesQuery = useStaticQuery(
    graphql`
      query AllLocales {
        allFile(filter: { sourceInstanceName: { eq: "i18n" }, extension: {eq: "json"}}) {
          nodes {
            name
            childI18NJson {
              viewIn
              langPicker
              title
              description
              calendarEvent
              connectWallet
              signOut
              myNFTs
              nextNFT
              prevNFT
              close
              zoomIn
              zoomOut
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
  }) as Locale) // type coercion removes the `| null` that GraphQL includes

  const locale = locales.find(l => new RegExp(`/${l.id}`).test(pathname))

  return { locales, locale }
}
