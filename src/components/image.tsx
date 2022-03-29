import * as React from "react"
import { GatsbyImage } from "gatsby-plugin-image"
import type { GatsbyImageProps } from "gatsby-plugin-image"
import useImageData from "../hooks/useImageData"

export type ImageProps = Omit<GatsbyImageProps, "image"> & {
  src: string
}

/**
 * Simple image handling for Gatsby! Pass in the name of a file in
 * `config/images`, and this will render it correctly. It will render it either
 * as an SVG using the gatsby-transformer-inline-svg plugin, or using
 * GatsbyImage.
 */
export default function ({ src, ...props }: ImageProps) {
  const { svg, image } = useImageData(src)

  if (svg) {
    if (svg.svg?.content) {
      // Inlined SVGs
      return <div dangerouslySetInnerHTML={{ __html: svg.svg.content }} />
    }
    // SVGs that can/should not be inlined
    return <img src={svg.svg?.dataURI ?? undefined} alt={props.alt} />
  }

  return (
    <GatsbyImage
      image={image.childImageSharp?.gatsbyImageData}
      objectFit="contain"
      {...props}
    />
  )
}
