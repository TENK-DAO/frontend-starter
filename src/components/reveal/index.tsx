import React, { useEffect, useMemo, useState } from "react"
import { wallet } from "../../near"
import { Token } from "../../near/contracts/tenk"
import useTenk from '../../hooks/useTenk'
import * as css from "./reveal.module.css"

const Reveal: React.FC<{
  onClose: () => void,
  tokens?: Token[],
}> = ({ onClose, tokens }) => {
  const currentUser = wallet.getAccountId()
  const { contractMetadata, stale, nfts } = useTenk()

  const onKeyPress = useMemo(() => (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [])

  useEffect(() => {
    document.addEventListener('keyup', onKeyPress)
    return function onUnmount() {
      document.removeEventListener('keyup', onKeyPress)
    }
  }, [])

  useEffect(() => {
    if (!currentUser || (!stale && !nfts.length)) {
      onClose()
    }
  }, [currentUser, stale, nfts])

  if (!currentUser || !nfts.length) return null

  // TODO: support multiple tokens
  const nft = tokens?.[0] ?? nfts[nfts.length - 1]

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
          src={
            new URL(
              nft.metadata?.media ?? '',
              contractMetadata?.base_uri ?? ''
            ).href
          }
        />
        <figcaption>
          #{nft.token_id}
        </figcaption>
      </figure>
    </div>
  )
}

export default Reveal