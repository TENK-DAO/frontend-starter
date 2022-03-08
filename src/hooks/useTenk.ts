import React from "react"
import { NftContractMetadata, SaleInfo, Status, Token } from "../near/contracts/tenk"
import { TenK } from "../near/contracts"
import { wallet } from "../near"
import staleData from "./stale-data-from-build-time.json"

const account_id = wallet.getAccountId()

const stubSaleInfo: SaleInfo = {
  status: Status.Closed,
  presale_start: 1648771200000, // 2022-04-01T00:00:00Z
  sale_start: 1648774800000, // 2022-04-01T01:00:00Z
  token_final_supply: 0,
  price: '0',
}

interface TenkData {
  saleInfo: SaleInfo
  contractMetadata?: NftContractMetadata
  vip: boolean
  mintLimit: number
  nfts: Token[]
  mintRateLimit?: number
}

// initialize calls at root of file so that first evaluation of this file causes
// calls to start, and subsequent imports of this file just use those same calls
const rpcCalls = Promise.all([
  TenK.get_sale_info(),
  TenK.nft_metadata(),
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
    vip,
    mintLimit,
    nfts,
    mintRateLimit
  ] = await rpcCalls
  return {
    saleInfo,
    contractMetadata,
    vip: vip ?? false,
    mintLimit: mintLimit ?? 0,
    nfts: nfts ?? [],
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