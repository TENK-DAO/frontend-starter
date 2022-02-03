import * as React from "react"
import { PageProps } from "gatsby"
import Markdown from "react-markdown"
import { StaticImage } from "gatsby-plugin-image"

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
      <section title="hero">
        <h1>
          <Markdown children={i18n.hero_title} />
        </h1>
        <Markdown children={i18n.hero_body} />
        <button>
          <Markdown children={i18n.hero_cta} />
        </button>
        <StaticImage
          src="../images/hero.png"
          width={325}
          quality={95}
          formats={["auto", "webp", "avif"]}
          alt=""
          style={{ marginBottom: `1.45rem` }}
        />
      </section>
    </Layout>
  )
}

export default Landing
