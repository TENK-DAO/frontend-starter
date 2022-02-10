import * as React from "react"
import Markdown from "react-markdown"
import Image from "../components/image"
import type { SectionI18n } from "../../lib/locales"

import * as css from "./section.module.css"

export default function Section({
  backgroundColor,
  backgroundImage,
  text,
  cta,
  image,
}: SectionI18n) {
  return (
    <section
      className={css.section}
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      {backgroundImage && <Image src={backgroundImage} alt="" />}
      {/* following div is styled by `css.section` to overlap backgroundImage */}
      <div>
        <div className="container">
          <div className={css.content}>
            <div>
              {text && <Markdown children={text} />}
              {cta && <button className="cta">{cta}</button>}
            </div>
            {image && <Image src={image} alt="" />}
          </div>
        </div>
      </div>
    </section>
  )
}
