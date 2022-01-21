import { useStaticQuery, graphql } from "gatsby"
import { useLocation } from "@reach/router"

interface I18nFields {
  view_in: string
  lang_picker: string
  title: string
  description: string
  hero_title: string
  hero_body: string
  hero_cta: string
}

interface Node {
  name: string
  childI18NJson: I18nFields
}

interface Locale {
  current: boolean
  id: string
  i18n: I18nFields
}

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
