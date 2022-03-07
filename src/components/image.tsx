import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import type { GatsbyImageProps } from "gatsby-plugin-image"
import type { AllImagesQuery } from "../../graphql-types"

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
  const {
    svg: { nodes: svgs },
    nonSvg: { nodes: images },
  }: AllImagesQuery = useStaticQuery(
    graphql`
      query AllImages {
        svg: allFile(filter: { sourceInstanceName: { eq: "images" }, extension: { eq: "svg" } }) {
          nodes {
            relativePath
            svg {
              content
              dataURI
            }
          }
        }
        nonSvg: allFile(filter: { sourceInstanceName: { eq: "images" }, extension: { ne: "svg" } }) {
          nodes {
            relativePath
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
    `
  )

  const svg = svgs.find(s => s.relativePath === src)

  if (svg) {
    if (svg.svg?.content) {
      // Inlined SVGs
      return <div dangerouslySetInnerHTML={{ __html: svg.svg.content }} />
    }
    // SVGs that can/should not be inlined
    return <img src={svg.svg?.dataURI ?? undefined} alt={props.alt} />
  }

  const image = images.find(i => i.relativePath === src)

  if (!image) {
    console.error(
      new Error(
        `No image "${src}" in PROJECT_ROOT/config/images. Set "src" to one of the following:\n  • ${images
          .map(i => i.relativePath)
          .join("\n  • ")}`
      )
    )
    return null
  }

  return (
    <GatsbyImage
      image={image.childImageSharp?.gatsbyImageData}
      objectFit="contain"
      {...props}
    />
  )
}
