import React from "react"
import ReactMarkdown from "react-markdown"
import { ReactMarkdownOptions } from "react-markdown/lib/react-markdown"

const Markdown: React.FC<ReactMarkdownOptions> = (props) => (
  <ReactMarkdown {...props} linkTarget="_blank" />
)

export default Markdown