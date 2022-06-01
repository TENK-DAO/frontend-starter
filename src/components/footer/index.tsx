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
        <span>A <a href="https://tenk.dev/">TenK</a> Contract & UI Fork, powered by 🧀</span>
      </div>
    </footer>
  )
}
