import * as React from "react"
import Image, { ImageProps } from "../image"
import type { Hero, SectionI18n } from "../../../lib/locales/Locale"

import * as css from "./section.module.css"

const Section: React.FC<{
  backgroundColor?: string,
  backgroundImage?: string | ImageProps,
  image?: string | ImageProps
}> = ({
  backgroundColor, backgroundImage, image, children
}) => (
  <section
    className={css.section}
    style={{
      backgroundColor: backgroundColor,
    }}
  >
    {backgroundImage && (typeof backgroundImage === 'string'
      ? <Image src={backgroundImage} alt="" />
      : <Image {...backgroundImage} />
    )}
    {/* following div is styled by `css.section` to overlap backgroundImage */}
    <div>
      <div className="container">
        <div className={`${css.content} ${image ? css.hasImage : ''}`}>
          <div>
            {children}
          </div>
          {image && (typeof image === 'string'
            ? <Image src={image} alt="" />
            : <Image {...image} />
          )}
        </div>
      </div>
    </div>
  </section>
)

export default Section