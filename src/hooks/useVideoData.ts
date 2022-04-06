import { useStaticQuery, graphql } from "gatsby"
import type { AllVideosQuery } from "../../graphql-types"

type VideoQuery = AllVideosQuery['allFile']['videos'][number]
type VideoH264 = NonNullable<VideoQuery['videoH264']>

type H264 = {
  [K in keyof VideoH264]: NonNullable<VideoH264[K]>
}

type VideoData = {
  videoH264: H264
}

/**
 * Get video data for use with the Video or BackgroundVideo components.
 *
 * @param src filename of an image in `config/videos`. A helpful error will be thrown if no image found.
 * @returns ...
 */
export default function useImageData(src: string): VideoData  {
  const { allFile: { videos } }: AllVideosQuery = useStaticQuery(
    graphql`
      query AllVideos {
        allFile(filter: {sourceInstanceName: {eq: "videos"}}) {
          videos: nodes {
            relativePath
            videoH264 {
              name
              duration
              aspectRatio
              absolutePath
              bitRate
              ext
              formatName
              height
              path
              size
              width
              startTime
            }
          }
        }
      }
    `
  )

  const video = videos.find(v => v.relativePath === src)

  if (!video) {
    throw new Error(
      `No video "${src}" in PROJECT_ROOT/config/videos. Set "src" to one of the following:\n  • ${videos
        .map(v => v.relativePath)
        .join("\n  • ")}`
    )
  }

  if (!video.videoH264) {
    throw new Error(
      `Video "PROJECT_ROOT/config/videos/${src}" returned bad data; expected videoH264 to both be present, got: ${JSON.stringify(video)}`
    )
  }

  return {
    videoH264: video.videoH264 as H264,
  }
}