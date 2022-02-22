import * as React from "react"
import Image from "../image"
import type { Hero, SectionI18n } from "../../../lib/locales/Locale"

import * as css from "./section.module.css"

const Section: React.FC<{ backgroundColor?: string, backgroundImage?: string, image?: string }> = ({
  backgroundColor, backgroundImage, image, children
}) => (
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
            {children}
          </div>
          {image && <Image src={image} alt="" />}
        </div>
      </div>
    </div>
  </section>
)

export default Section