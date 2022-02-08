import * as React from "react"
import { PageProps } from "gatsby"
import Markdown from "react-markdown"

import Image from "../components/image"
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
        <section
          key={i}
          style={{
            display: "grid",
            backgroundColor: section.backgroundColor,
          }}
        >
          {section.backgroundImage && (
            <Image
              src={section.backgroundImage}
              alt=""
              style={{
                gridArea: "1/1",
              }}
            />
          )}
          <div
            style={{
              // By using the same grid area for both, they are stacked on top of each other
              gridArea: "1/1",
              position: "relative",
              // This centers the other elements inside the hero component
              placeItems: "center",
              display: "flex",
            }}
          >
            <div>
              {section.text && <Markdown children={section.text} />}
              {section.cta && (
                <button>
                  <Markdown children={section.cta} />
                </button>
              )}
            </div>
            {section.image && (
              <Image
                src={section.image}
                alt=""
                style={{ marginBottom: `1.45rem` }}
              />
            )}
          </div>
        </section>
      ))}
    </Layout>
  )
}

export default Landing

// export const pageQuery = graphql`
// `
