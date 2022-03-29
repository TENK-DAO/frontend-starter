import React from "react"
import { NftContractMetadata, SaleInfo, Token as RawToken } from "../near/contracts/tenk"
import { TenK } from "../near/contracts"
import { wallet } from "../near"
import staleData from "./stale-data-from-build-time.json"

const account_id = wallet.getAccountId()

type Token = RawToken & {
  media: string
}

export interface TenkData {
  contractMetadata?: NftContractMetadata
  mintLimit: number
  mintRateLimit?: number
  nfts: Token[]
  saleInfo: SaleInfo
  tokensLeft?: number
  vip: boolean
}

// initialize calls at root of file so that first evaluation of this file causes
// calls to start, and subsequent imports of this file just use those same calls
const rpcCalls = Promise.all([
  TenK.get_sale_info(),
  TenK.nft_metadata(),
  TenK.tokens_left(),
  !account_id ? undefined : TenK.whitelisted({ account_id }),
  !account_id ? undefined : TenK.remaining_allowance({ account_id }),
  !account_id ? undefined : TenK.nft_tokens_for_owner({ account_id }),
  !account_id ? undefined : TenK.mint_rate_limit({ account_id }),
])

// Export utility to get data in object form, rather than array form.
// Used by gatsby-node.ts to create the stale data JSON file.
export async function rpcData(): Promise<TenkData> {
  const [
    saleInfo,
    contractMetadata,
    tokensLeft,
    vip,
    mintLimit,
    nfts,
    mintRateLimit
  ] = await rpcCalls
  return {
    saleInfo,
    contractMetadata,
    tokensLeft,
    vip: vip ?? false,
    mintLimit: mintLimit ?? 0,
    nfts: nfts?.map(nft => ({ ...nft,
      media: `${contractMetadata.base_uri ?? ''}${nft.metadata?.media}`
    })) ?? [],
    mintRateLimit: mintRateLimit ?? undefined,
  }
}

export default function useTenk() {
  const [data, setData] = React.useState<TenkData>(staleData as unknown as TenkData)
  React.useEffect(() => {
    rpcData().then(setData)
  }, [])
  return data
}