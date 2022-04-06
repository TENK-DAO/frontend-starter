import React from 'react'
import { withPrefix } from 'gatsby'
import useVideoData from "../../hooks/useVideoData"

export type VideoProps = React.DetailedHTMLProps<
  React.VideoHTMLAttributes<HTMLVideoElement>,
  HTMLVideoElement
> & {
  src: string
}

const Video: React.FC<VideoProps> = ({ src, ...props }) => {
  const { videoH264, videoVP9 } = useVideoData(src)
  return (
    <video playsInline muted preload="auto" {...props}>
      <source src={withPrefix(videoVP9.path!)} type="video/webm; codecs=vp9,opus" />
      <source src={withPrefix(videoH264.path!)} type="video/mp4; codecs=avc1" />
    </video>
  )
}

export default Video
