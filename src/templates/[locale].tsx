import * as React from "react"
import { PageProps } from "gatsby"

import Hero from "../components/hero"
import MyNFTs from "../components/my-nfts"
import Section from "../components/section"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Markdown from "../components/markdown"
import type { DecoratedLocale } from "../../lib/locales"

type PageContext = {
  locale: DecoratedLocale
}

const Landing: React.FC<PageProps<{}, PageContext>> = ({
  pageContext: {
    locale: { id, ...i18n },
  },
}) => {
  return (
    <Layout title={i18n.title}>
      <Seo lang={id} title={i18n.title} description={i18n.description} />
      <MyNFTs />
      <Hero heroTree={i18n.hero} />
      {i18n.extraSections?.map((section, i) => (
        <Section key={i} {...section}>
          <Markdown children={section.text} />
        </Section>
      ))}
    </Layout>
  )
}

export default Landing
