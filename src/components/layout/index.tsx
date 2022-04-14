import * as React from "react"
import Banner from "../banner"
import Nav from "../nav"
import "./layout.scss"

const Layout: React.FC<{ style?: React.CSSProperties }> = ({ style, children }) => {
  return (
    <div style={style}>
      <Banner />
      <Nav />
      {children}
    </div>
  )
}

export default Layout
