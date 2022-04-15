import settings from "../../../config/settings.json"
import React from "react"
import * as css from "./footer.module.css"
import Image from "../image"
import LangPicker from "../lang-picker"

export default function Nav() {
  return (
    <footer className={`${css.footer} container`}>
      <div className={css.social}>
        {settings.social.map(({ href, img, alt }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" title={alt} key={alt}>
            <Image src={img} alt={alt} />
          </a>
        ))}
      </div>
      <LangPicker />
    </footer>
  )
}
