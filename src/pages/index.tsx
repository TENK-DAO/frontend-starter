import * as React from "react"
import { Link, navigate } from "gatsby"

import useLocales from "../hooks/useLocales"
import Layout from "../components/layout"

const IndexPage = () => {
  const { locales } = useLocales()

  React.useEffect(() => {
    const preferredLocale = window.navigator.language
    let matchingLocale = locales.find(
      l => l.id.replace("_", "-") === preferredLocale
    )
    if (!matchingLocale)
      matchingLocale = locales.find(
        l => l.id === preferredLocale.replace(/-[A-Z]{2}/, "")
      )

    if (matchingLocale) {
      console.log({ locales, preferredLocale, matchingLocale })
      navigate(`/${matchingLocale.id}/`)
    }
  }, [])

  return (
    <Layout>
      {locales.map(({ id, i18n }) => (
        <p key={id}>
          <Link to={`/${id}/`}>{i18n.viewIn}</Link>
        </p>
      ))}
    </Layout>
  )
}

export default IndexPage
