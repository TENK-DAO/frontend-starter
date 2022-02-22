
import * as React from "react"
import { wallet } from "../../near"
import { TenK } from "../../near/contracts"
import type { Token } from "../../near/contracts/tenk"
import Section from '../section'
import useLocales from '../../hooks/useLocales'
import * as css from './my-nfts.module.css'

const MyNFTs: React.FC<{}> = () => {
  const currentUser = wallet.getAccountId()
  const { locale } = useLocales()
  const [nfts, setNfts] = React.useState<Token[]>([])
  React.useEffect(() => {
    if (currentUser) {
      TenK.nft_tokens_for_owner({ account_id: currentUser }).then(setNfts)
    }
  }, [currentUser])

  if (!locale || !currentUser) return null

  return (
    <Section>
      <h1>{locale.myNFTs}</h1>
      <div className={css.grid}>
        {nfts.map(nft => (
          <div key={nft.token_id}>
            <img alt={nft.metadata?.description} src={nft.metadata?.media} />
            #{nft.token_id}
          </div>
        ))}
      </div>
    </Section>
  )
}

export default MyNFTs