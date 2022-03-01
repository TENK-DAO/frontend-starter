import * as React from "react"
import { navigate } from "gatsby"

import Banner from "../banner"
import Nav from "../nav"
import "./layout.scss"
import useLocales from "../../hooks/useLocales"

const Layout: React.FC<{ title?: string }> = ({ title, children }) => {
  const { locales, locale } = useLocales()
  return (
    <>
      <Banner />
      <Nav />
      {children}
    </>
  )
}

export default Layout
