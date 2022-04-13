import settings from "../../../config/settings.json"
import React from "react"
import { signIn, wallet } from "../../near"
import * as css from "./nav.module.css"
import useLocales from "../../hooks/useLocales"
import Dropdown from "../../components/dropdown"
import Image from "../../components/image"
import LangPicker from "../lang-picker"

function signOut() {
  wallet.signOut()
  window.location.replace(window.location.origin + window.location.pathname)
}

export default function Nav() {
  const currentUser = wallet.getAccountId()
  const { locale } = useLocales()
  if (!locale) return null
  return (
    <nav className={css.nav}>
      <h1 className={css.title}>
        {locale.title}
      </h1>
      <div className={css.social}>
        {settings.social.map(({ href, img, alt }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" title={alt} key={alt}>
            <Image src={img} alt={alt} />
          </a>
        ))}
      </div>
      <LangPicker />
      {currentUser ? (
        <span>
          {/* extra span so that Gatsby's hydration notices this is not the same as the signIn button */}
          <Dropdown
            trigger={currentUser}
            items={[
              {
                children: locale.signOut,
                onSelect: signOut,
              },
            ]}
          />
        </span>
      ) : (
        <button className="secondary" onClick={signIn}>{locale.connectWallet}</button>
      )}
    </nav>
  )
}
