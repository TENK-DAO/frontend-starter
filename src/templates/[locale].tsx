import * as React from "react"
import { PageProps } from "gatsby"

import Section from "../components/section"
import Layout from "../components/layout"
import Seo from "../components/seo"
import type { Locale } from "../../lib/locales"

type PageContext = {
  locale: Locale
}

const Landing: React.FC<PageProps<{}, PageContext>> = ({
  pageContext: {
    locale: { id, i18n },
  },
}) => {
  return (
    <Layout title={i18n.title}>
      <Seo lang={id} title={i18n.title} description={i18n.description} />
      {i18n.pageSections.map((section, i) => (
        <Section key={i} {...section} />
      ))}
    </Layout>
  )
}

export default Landing
