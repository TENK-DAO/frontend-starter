import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { getImage, GatsbyImage } from "gatsby-plugin-image"
import type { GatsbyImageProps } from "gatsby-plugin-image"
import type { AllImagesQuery } from "../../graphql-types"

type Props = Omit<GatsbyImageProps, "image"> & {
  src: string
}

/**
 * Gatsby optimizes images well, but makes it REALLY hard to actually use them.
 * You have to use a static query, meaning NO VARIABLES, and the fact that you
 * have to use GraphQL at all is just really unfortunate.
 *
 * But! This component simplifies it all for you. Just pass the name of one of
 * the files in `PROJECT_ROOT/images` and this component will take care of the
 * rest.
 */
export default function ({ src, ...props }: Props) {
  const {
    allFile: { nodes: images },
  }: AllImagesQuery = useStaticQuery(
    graphql`
      query AllImages {
        allFile(filter: { sourceInstanceName: { eq: "images" } }) {
          nodes {
            relativePath
            publicURL
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
    `
  )
  const image = images.find(i => i.relativePath === src)
  if (image) {
    if (image.childImageSharp) {
      if (image.childImageSharp?.gatsbyImageData) {
        return (
          <GatsbyImage
            image={image.childImageSharp.gatsbyImageData}
            {...props}
          />
        )
      } else {
        console.error(
          new Error(
            `childImageSharp defined but does not have gatsbyImageData! Found image: ${image}`
          )
        )
      }
    }
    if (image.publicURL) {
      if (/\.svg$/.test(src)) {
        return <object tabIndex={-1} type="image/svg+xml" data={image.publicURL}></object>
      }
      return <img src={image.publicURL} {...props} />
    }
    console.error(
      new Error(
        `Don't know how to render image; maybe need to query more attributes and read some docs? image: ${image}`
      )
    )
  } else {
    console.error(
      new Error(
        `No image "${src}" in PROJECT_ROOT/images. Set "src" to one of the following:\n  • ${images
          .map(i => i.relativePath)
          .join("\n  • ")}`
      )
    )
  }
  console.error(new Error(`Image ${src} found, but don't know how to render it :(\n\nImage data: ${image}`))
  return <span>🖼</span>
}
