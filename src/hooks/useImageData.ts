import { useStaticQuery, graphql } from "gatsby"
import type { AllImagesQuery } from "../../graphql-types"

type SvgOrImage = {
  svg: AllImagesQuery['svg']['nodes'][number]
  image: undefined
} | {
  svg: undefined
  image: AllImagesQuery['nonSvg']['nodes'][number]
}

/**
 * Get image data for use with an inline/data-URL SVG or with GatsbyImage.
 *
 * @param src filename of an image in `config/images`. A helpful error will be thrown if no image found.
 * @returns an object with either an `svg` key or an `image` key
 */
export default function useImageData(src: string): SvgOrImage {
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
            publicURL
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
    `
  )

  const svg = svgs.find(s => s.relativePath === src)
  const image = images.find(i => i.relativePath === src)

  if (!svg && !image) {
    console.error(
      new Error(
        `No image "${src}" in PROJECT_ROOT/config/images. Set "src" to one of the following:\n  • ${images
          .map(i => i.relativePath)
          .join("\n  • ")}`
      )
    )
  }

  return { svg, image } as SvgOrImage
}