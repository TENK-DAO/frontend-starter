import * as React from "react"
import Image, { ImageProps } from "../image"
import BackgroundImage from "../background-image"

import * as css from "./section.module.css"

const Section: React.FC<{
  backgroundColor?: string,
  backgroundImage?: string,
  image?: string | ImageProps
}> = ({
  backgroundColor, backgroundImage, image, children
}) => (
  <BackgroundImage
    src={backgroundImage}
    Tag="section"
    className={css.section}
    style={{ backgroundColor }}
  >
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
  </BackgroundImage>
)

export default Section