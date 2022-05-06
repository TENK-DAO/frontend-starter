import React from "react"
import { StaticImage } from "gatsby-plugin-image"
import * as css from "./footer.module.css"
import LangPicker from "../lang-picker"
import useLocales from "../../hooks/useLocales"

export default function Footer() {
  const { locale } = useLocales()
  if (!locale) return null
  return (
    <footer className={`${css.footer} container`}>
      <LangPicker />
      <div className={css.launchPartner}>
        <span>Powered By <a href="https://tenk.dev/">TenK DAO</a></span>
        <a href="https://tenk.dev/">
          <StaticImage
            src="../../../config/images/tenk-logo.png"
            alt="TenK Logo"
            height={40}
          />
        </a>
      </div>
    </footer>
  )
}
