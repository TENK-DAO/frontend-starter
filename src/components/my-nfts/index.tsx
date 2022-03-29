import React, { useState } from "react"
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { wallet } from "../../near"
import Section from '../section'
import useLocales from '../../hooks/useLocales'
import useTenk from '../../hooks/useTenk'
import * as css from './my-nfts.module.css'

const MyNFTs: React.FC<{}> = () => {
  const currentUser = wallet.getAccountId()
  const { locale } = useLocales()
  const { contractMetadata, nfts } = useTenk()
  const [photoIndex, setPhotoIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (!locale || !currentUser || !contractMetadata || nfts.length === 0) return null

  return (
    <>
      <Section>
        <h1>{locale.myNFTs}</h1>
        <div className={css.grid}>
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
              <footer>#{nft.token_id}</footer>
            </button>
          ))}
        </div>
      </Section>
      {lightboxOpen && (
        <Lightbox
          mainSrc={nfts[photoIndex].media}
          imageTitle={nfts[photoIndex].metadata?.title}
          imageCaption={nfts[photoIndex].metadata?.description}
          nextLabel={locale.nextNFT}
          prevLabel={locale.prevNFT}
          zoomInLabel={locale.zoomIn}
          zoomOutLabel={locale.zoomOut}
          closeLabel={locale.close}
          nextSrc={nfts[(photoIndex + 1) % nfts.length].media}
          prevSrc={nfts[(photoIndex + nfts.length - 1) % nfts.length].media}
          onCloseRequest={() => setLightboxOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + nfts.length - 1) % nfts.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % nfts.length)
          }
        />
      )}
    </>
  )
}

export default MyNFTs