import * as React from "react"
import "./layout.scss"
import Banner from "../banner"
import Nav from "../nav"
import Footer from "../footer"
import * as css from "./layout.module.css"

const Layout: React.FC<{
  style?: React.CSSProperties
  showConnectModal: boolean
}> = ({ style, showConnectModal, children }) => {
  return (
    <div style={style} className={css.wrap}>
      <div>
        <Banner />
        <Nav showConnectModal={showConnectModal} />
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default Layout
