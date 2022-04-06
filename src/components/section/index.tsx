import * as React from "react"
import Image, { ImageProps } from "../image"
import Video, { VideoProps } from "../video"
import BackgroundImage from "../background-image"

import * as css from "./section.module.css"

const Section: React.FC<{
  backgroundColor?: string,
  backgroundImage?: string,
  image?: string | ImageProps
  video?: string | VideoProps
}> = ({
  backgroundColor, backgroundImage, image, video, children
}) => (
  <BackgroundImage
    src={backgroundImage}
    Tag="section"
    className={css.section}
    style={{ backgroundColor }}
  >
    <div className="container">
      <div className={`${css.content} ${(image || video) ? css.hasMedia : ''}`}>
        <div>
          {children}
        </div>
        {video && (typeof video === 'string'
          ? <Video src={video} />
          : <Video {...video} />
        )}
        {image && (typeof image === 'string'
          ? <Image src={image} alt="" />
          : <Image {...image} />
        )}
      </div>
    </div>
  </BackgroundImage>
)

export default Section