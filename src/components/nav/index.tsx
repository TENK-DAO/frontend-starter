import settings from "../../../config/settings.json"
import React, { useState } from "react"
import { signIn, wallet } from "../../near"
import * as css from "./nav.module.css"
import useLocales from "../../hooks/useLocales"
import useTenk from "../../hooks/useTenk"
import Dropdown from "../../components/dropdown"
import MyNFTs from "../../components/my-nfts"
import Image from "../image"

function signOut() {
  wallet.signOut()
  window.location.replace(window.location.origin + window.location.pathname)
}

export default function Nav() {
  const currentUser = wallet.getAccountId()
  const { locale } = useLocales()
  const { nfts } = useTenk()
  const [showNFTs, setShowNFTs] = useState(false)

  if (!locale) return null

  return (
    <>
      <nav className={css.bg}>
        <div className={`container ${css.content}`}>
          <div className={css.social}>
            {settings.social.map(({ href, img, alt }) => (
              <a href={href} target="_blank" rel="noopener noreferrer" title={alt} key={alt}>
                <Image src={img} alt={alt} />
              </a>
            ))}
          </div>
          <div className={css.actions}>
            {nfts.length > 0 && (
              <button
                className={`link ${css.button}`}
                onClick={() => setShowNFTs(true)}
              >
                {locale.myNFTs}
              </button>
            )}
            {currentUser ? (
              <span>
                {/* extra span so that Gatsby's hydration notices this is not the same as the signIn button */}
                <Dropdown
                  trigger={currentUser}
                  items={[{ children: locale.signOut, onSelect: signOut }]}
                />
              </span>
            ) : (
              <button className="secondary" onClick={signIn}>{locale.connectWallet}</button>
            )}
          </div>
        </div>
      </nav>
      {showNFTs && <MyNFTs onClose={() => setShowNFTs(false)} />}
    </>
  )
}
