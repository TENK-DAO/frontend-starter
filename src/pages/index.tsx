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
      navigate(`/${matchingLocale.id}/`)
    }
  }, [])

  return (
    <Layout>
      {locales.map(locale => (
        <p key={locale.id}>
          <Link to={`/${locale.id}/`}>{locale.viewIn}</Link>
        </p>
      ))}
    </Layout>
  )
}

export default IndexPage
