import React, { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from 'react-dom'
import Lightbox from 'react-image-lightbox';
import { wallet } from "../../near"
import useLocales from '../../hooks/useLocales'
import useTenk from '../../hooks/useTenk'
import * as css from './my-nfts.module.css'
import 'react-image-lightbox/style.css';

const portalRoot: undefined | HTMLElement = typeof document !== 'undefined'
  ? document.getElementById("portal")!
  : undefined

const MyNFTs: React.FC<{
  highlight?: string[],
  onClose: () => void,
}> = ({ highlight, onClose }) => {
  const currentUser = wallet.getAccountId()
  const { locale } = useLocales()
  const { contractMetadata, nfts } = useTenk()
  const [photoIndex, setPhotoIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const portalElement = useRef(document.createElement("div"))
  const containerElement = useRef<HTMLDivElement>(null)

  const onClick = useMemo(() => function onCloseRaw(this: Document, event: MouseEvent) {
    if (!lightboxOpen && event.target && !containerElement.current?.contains(event.target as Node)) {
      onClose()
    }
  }, [lightboxOpen, onClose])

  useEffect(() => {
    portalRoot?.appendChild(portalElement.current)
    const bgContent: HTMLDivElement = document.querySelector('#___gatsby')!
    bgContent.style.filter = 'blur(4px)'
    bgContent.style.overflow = 'hidden'
    document.addEventListener('click', onClick)
    return function onUnmount() {
      bgContent.style.filter = ''
      bgContent.style.overflow = ''
      portalRoot?.removeChild(portalElement.current)
      document.removeEventListener('click', onClick)
    }
  }, [onClick, portalRoot])

  if (
    !portalRoot ||
    !locale ||
    !currentUser ||
    !contractMetadata ||
    nfts.length === 0
  ) {
    return null
  }

  const nextSrc = nfts.length > 1 ? nfts[(photoIndex + 1) % nfts.length].media : undefined
  const prevSrc = nfts.length > 1 ? nfts[(photoIndex + nfts.length - 1) % nfts.length].media : undefined

  return createPortal(
    <>
      <div className={css.myNfts}>
        <div className="container">
          <header>
            <h1>{locale.myNFTs}</h1>
            <button className={css.close} onClick={onClose}>
              &times;
            </button>
          </header>
          <div className={css.grid} ref={containerElement}>
            {nfts.map((nft, index) => (
              <button
                key={nft.token_id}
                className={css.nft}
                onClick={() => {
                  setPhotoIndex(index)
                  setLightboxOpen(true)
                }}
              >
                <div style={{ backgroundImage: `url("${nft.media}")` }} />
                <span className="visually-hidden">{nft.metadata?.description}</span>
                <footer>
                  <span>#{nft.token_id}</span>
                  {highlight?.includes(nft.token_id) && (
                    <span className={css.highlight}>{locale.new}</span>
                  )}
                </footer>
              </button>
            ))}
          </div>
        </div>
      </div>
      {lightboxOpen && (
        <Lightbox
          mainSrc={nfts[photoIndex].media}
          imageTitle={`#${nfts[photoIndex].metadata?.title}`}
          imageCaption={nfts[photoIndex].metadata?.description}
          nextLabel={locale.nextNFT}
          prevLabel={locale.prevNFT}
          zoomInLabel={locale.zoomIn}
          zoomOutLabel={locale.zoomOut}
          closeLabel={locale.close}
          nextSrc={nextSrc}
          prevSrc={prevSrc}
          onCloseRequest={() => setLightboxOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + nfts.length - 1) % nfts.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % nfts.length)
          }
        />
      )}
    </>,
    portalElement.current
  )
}

export default MyNFTs