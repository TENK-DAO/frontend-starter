
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
          <div key={nft.token_id}>
            <img
              alt={nft.metadata?.description}
              src={`${base_uri ?? ''}${nft.metadata?.media}`}
            />
            #{nft.token_id}
          </div>
        ))}
      </div>
    </Section>
  )
}

export default MyNFTs