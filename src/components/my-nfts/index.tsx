
import * as React from "react"
import { wallet } from "../../near"
import Section from '../section'
import useLocales from '../../hooks/useLocales'
import useTenk from '../../hooks/useTenk'
import * as css from './my-nfts.module.css'

const MyNFTs: React.FC<{}> = () => {
  const currentUser = wallet.getAccountId()
  const { locale } = useLocales()
  const { contractMetadata, nfts } = useTenk()

  if (!locale || !currentUser || !contractMetadata || nfts.length === 0) return null

  const { base_uri } = contractMetadata

  return (
    <Section>
      <h1>{locale.myNFTs}</h1>
      <div className={css.grid}>
        {nfts.map(nft => (
          <div
            key={nft.token_id}
            className={css.nft}
          >
            <div style={{ backgroundImage: `url("${base_uri ?? ''}${nft.metadata?.media}")` }} />
            <span className="visually-hidden">{nft.metadata?.description}</span>
            <footer>#{nft.token_id}</footer>
          </div>
        ))}
      </div>
    </Section>
  )
}

export default MyNFTs