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
  const { videoH264 } = useVideoData(src)
  return (
    <video playsInline muted preload="auto" {...props}>
      <source src={withPrefix(videoH264.path!)} />
    </video>
  )
}

export default Video
