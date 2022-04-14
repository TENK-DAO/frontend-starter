import React, { useState } from "react"
import { signIn, wallet } from "../../near"
import * as css from "./nav.module.css"
import useLocales from "../../hooks/useLocales"
import useTenk from "../../hooks/useTenk"
import Dropdown from "../../components/dropdown"
import MyNFTs from "../../components/my-nfts"

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
      <nav className={`${css.nav} container`}>
        <h1 className={css.title}>
          {locale.title}
        </h1>
        <div className={css.actions}>
          {nfts.length > 0 && (
            <button className="link" onClick={() => setShowNFTs(true)}>
              My NFTs
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
      </nav>
      {showNFTs && <MyNFTs onClose={() => setShowNFTs(false)} />}
    </>
  )
}
