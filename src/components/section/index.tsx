import * as React from "react"
import Image, { ImageProps } from "../image"
import Video, { VideoProps } from "../video"
import BackgroundImage from "../background-image"

import * as css from "./section.module.css"

const Section: React.FC<{
  backgroundColor?: string,
  backgroundImage?: string,
  className?: string,
  image?: string | ImageProps
  video?: string | VideoProps
}> = ({
  backgroundColor, backgroundImage, className, image, video, children
}) => (
  <BackgroundImage
    src={backgroundImage}
    Tag="section"
    className={`${css.section} ${className ?? ''}`}
    style={{ backgroundColor }}
  >
    <div className="container">
      <div className={`${css.content} ${(image || video) ? css.hasMedia : ''}`}>
        <div>
          {children}
        </div>
        {video && <div>{
          // wrap in div for proper styling
          typeof video === 'string'
              ? <Video src={video} />
              : <Video {...video} />
        }</div>}
        {image && (typeof image === 'string'
          ? <Image src={image} alt="" />
          : <Image {...image} />
        )}
      </div>
    </div>
  </BackgroundImage>
)

export default Section