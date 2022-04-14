import * as React from "react"
import { PageProps, navigate } from "gatsby"

import Hero from "../components/hero"
import Reveal from "../components/reveal"
import Section from "../components/section"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Markdown from "../components/markdown"
import type { DecoratedLocale } from "../../lib/locales"

type PageContext = {
  locale: DecoratedLocale
}

const Landing: React.FC<PageProps<{}, PageContext>> = ({ location, pageContext: { locale } }) => {
  const params = new URLSearchParams(location.search)
  const transactionHashes = params.get('transactionHashes') ?? undefined

  return (
    <>
      <Layout style={{ filter: transactionHashes && 'blur(4px)' }}>
        <Seo lang={locale.id} title={locale.title} description={locale.description} />
        <Hero heroTree={locale.hero} />
        {locale.extraSections?.map((section, i) => (
          <Section key={i} {...section}>
            <Markdown children={section.text} />
          </Section>
        ))}
      </Layout>
      {transactionHashes && (
        <Reveal onClose={() => navigate(`/${locale.id}`)} />
      )}
    </>
  )
}

export default Landing
