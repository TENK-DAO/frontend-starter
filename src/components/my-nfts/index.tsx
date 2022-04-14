import React, { useState } from "react"
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { wallet } from "../../near"
import useLocales from '../../hooks/useLocales'
import useTenk from '../../hooks/useTenk'

const MyNFTs: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const currentUser = wallet.getAccountId()
  const { locale } = useLocales()
  const { contractMetadata, nfts } = useTenk()
  const [photoIndex, setPhotoIndex] = useState(0)

  if (!locale || !currentUser || !contractMetadata || nfts.length === 0) return null

  const nextSrc = nfts.length > 1 ? nfts[(photoIndex + 1) % nfts.length].media : undefined
  const prevSrc = nfts.length > 1 ? nfts[(photoIndex + nfts.length - 1) % nfts.length].media : undefined

  return (
    <Lightbox
      mainSrc={nfts[photoIndex].media}
      imageTitle={nfts[photoIndex].metadata?.title}
      imageCaption={nfts[photoIndex].metadata?.description}
      nextLabel={locale.nextNFT}
      prevLabel={locale.prevNFT}
      zoomInLabel={locale.zoomIn}
      zoomOutLabel={locale.zoomOut}
      closeLabel={locale.close}
      nextSrc={nextSrc}
      prevSrc={prevSrc}
      onCloseRequest={onClose}
      onMovePrevRequest={() =>
        setPhotoIndex((photoIndex + nfts.length - 1) % nfts.length)
      }
      onMoveNextRequest={() =>
        setPhotoIndex((photoIndex + 1) % nfts.length)
      }
    />
  )
}

export default MyNFTs