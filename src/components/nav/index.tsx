import settings from "../../../config/settings.json"
import React, { useEffect, useState } from "react"
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

type Props = {
  showConnectModal: boolean
}

export default function Nav({ showConnectModal }: Props) {
  const currentUser = wallet.getAccountId()
  const { locale } = useLocales()
  const { nfts } = useTenk()
  const [showNFTs, setShowNFTs] = useState(false)
  const [firstRender, setFirstRender] = useState(true)
  const [buttonClass, setButtonClass] = useState("secondary")

  if (!locale) return null

  const handleOnAnimationEnd = () => {
    setButtonClass("secondary")
  }

  useEffect(() => {
    if (showConnectModal) {
      setFirstRender(false)
    }
    if (!showConnectModal && !firstRender) {
      setButtonClass(`secondary ${css.buttonAnimation}`)
    }
  }, [showConnectModal])

  return (
    <>
      <nav className={css.bg}>
        <div className={`container ${css.content}`}>
          <div className={css.social}>
            {settings.social.map(({ href, img, alt }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={alt}
                key={alt}
              >
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
              <button
                onAnimationEnd={handleOnAnimationEnd}
                className={buttonClass}
                onClick={signIn}
              >
                {locale.connectWallet}
              </button>
            )}
          </div>
        </div>
      </nav>
      {showNFTs && <MyNFTs onClose={() => setShowNFTs(false)} />}
    </>
  )
}
