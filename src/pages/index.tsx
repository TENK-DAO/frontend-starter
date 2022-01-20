import * as React from "react"
import { Link } from "gatsby"

import useLocales from "../hooks/useLocales"
import Layout from "../components/layout"

const IndexPage = () => {
  const locales = useLocales()
  return (
    <Layout>
      {locales.map(({ id, i18n }) => (
        <p key={id}>
          <Link to={`/${id}/`}>{i18n.view_in}</Link>
        </p>
      ))}
    </Layout>
  )
}

export default IndexPage
