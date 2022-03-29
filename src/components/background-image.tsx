import * as React from "react"
import { convertToBgImage } from "gbimage-bridge"
import GatsbyBackgroundImage, { IBackgroundImageProps } from 'gatsby-background-image'
import useImageData from "../hooks/useImageData"

type Props = IBackgroundImageProps & JSX.IntrinsicElements['div'] & {
  src?: string
  /**
   * Could add more; gatsby-background-image allows any of JSX.IntrinsicElements, but that doesn't type-check well
   */
  Tag: 'section' | 'div' | 'header' | 'footer' | 'aside'
}

/**
 * Same as `Props`, but `src` must be present
 */
type StrictProps = Omit<Props, 'src'> & {
  src: string
}

/**
 * Simple background images for Gatsby! Pass in the name of a file in
 * `config/images`, and this will render it correctly.
 *
 * Uses gatsby-transformer-inline-svg plugin to render SVG backgrounds.
 * Uses gatsby-background-image plugin to render all other backgrounds.
 *
 * @param Tag HTML Element to use. @default "div"
 * @param src filename of an image in `config/images`. If undefined, `Tag` will be rendered with all children and other props directly, with no background-image styling.
 */
const BackgroundImage: React.FC<Props> = ({ src, Tag = 'div', ...props }) => {
  if (!src) return <Tag {...props} />

  return <StrictBackgroundImage src={src} Tag={Tag} {...props} />
}

export default BackgroundImage

const StrictBackgroundImage: React.FC<StrictProps> = ({ src, Tag, style, ...props }) => {
  const { svg, image } = useImageData(src)

  if (svg) {
    return (
      <Tag
        {...props}
        style={{
          backgroundImage: `url("${svg.svg?.dataURI ?? undefined}")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          ...style,
        }}
      />
    )
  }

  const bgImage = convertToBgImage(image.childImageSharp?.gatsbyImageData)

  return (
    // @ts-expect-error type woes; gatsby-background-image does not make it easy to work with their types
    <GatsbyBackgroundImage
      {...(bgImage ?? {})}
      Tag={Tag}
      {...props}
      preserveStackingContext
    />
  )
}
