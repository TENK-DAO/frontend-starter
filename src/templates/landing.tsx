import * as React from "react"
import { PageProps } from "gatsby"
import Markdown from "react-markdown"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"

type PageContext = {
  lang: string
  i18n: {
    title: string
    description: string
    hero_title: string
    hero_body: string
    hero_cta: string
  }
}

const Landing: React.FC<PageProps<{}, PageContext>> = ({
  pageContext: { lang, i18n },
}) => {
  return (
    <Layout title={i18n.title}>
      <Seo lang={lang} title={i18n.title} description={i18n.description} />
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
