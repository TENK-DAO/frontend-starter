import React, { useEffect, useMemo, useState } from "react"
import { wallet } from "../../near"
import useTenk from '../../hooks/useTenk'
import * as css from "./reveal.module.css"

const Reveal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const currentUser = wallet.getAccountId()
  const { stale, nfts } = useTenk()

  const onKeyPress = useMemo(() => (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [])

  useEffect(() => {
    document.addEventListener('keyup', onKeyPress)
    document.addEventListener('click', onClose)
    return function onUnmount() {
      document.removeEventListener('click', onClose)
      document.removeEventListener('keyup', onKeyPress)
    }
  }, [])

  useEffect(() => {
    if (!currentUser || (!stale && !nfts.length)) {
      onClose()
    }
  }, [currentUser, stale, nfts])

  if (!currentUser || !nfts.length) return null

  const nft = nfts[nfts.length - 1]

  return (
    <div className={css.reveal}>
      <header>
        <button onClick={onClose} title="close">
          &times;
        </button>
      </header>
      <figure>
        <img
          alt={nft.metadata?.title}
          src={nft.media}
        />
        <figcaption>
          #{nft.token_id}
        </figcaption>
      </figure>
    </div>
  )
}

export default Reveal