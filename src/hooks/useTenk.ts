import React from "react"
import {
  NftContractMetadata,
  SaleInfo,
  Token as RawToken,
} from "../near/contracts/tenk"
import { TenK } from "../near/contracts"
import { wallet } from "../near"
import staleData from "../../stale-data-from-build-time.json"

const account_id = wallet.getAccountId()

type Token = RawToken & {
  media: string
}

export interface TenkData {
  contractMetadata?: NftContractMetadata
  remainingAllowance?: number
  mintRateLimit: number
  nfts: Token[]
  saleInfo: SaleInfo
  tokensLeft: number
  vip: boolean
}

interface ReturnedData extends TenkData {
  stale: boolean
  price_cheddar_near: string
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
    remainingAllowance,
    nfts,
    mintRateLimit,
  ] = await rpcCalls
  return {
    saleInfo,
    contractMetadata,
    tokensLeft,
    vip: vip ?? false,
    remainingAllowance: remainingAllowance ?? undefined,
    nfts:
      nfts?.map(nft => ({
        ...nft,
        media: new URL(
          nft.metadata?.media ?? "",
          contractMetadata.base_uri ?? ""
        ).href,
      })) ?? [],
    mintRateLimit: mintRateLimit ?? 10,
  }
}

const axios = require("axios")

const cheddarNearPrice = async (nftNearPrice: string) => {
  const url = "https://api.stats.ref.finance/api/top-tokens"
  const returns = await axios.get(url)
  const prices = returns.data

  let price_near = 0
  let price_cheddar = 0
  let price_cheddar_near = 0
  if (prices) {
    for (let i = 0; i < prices.length; i++) {
      const price = prices[i]
      if (price.symbol == "wNEAR") {
        price_near = price.price
      } else if (price.symbol == "Cheddar") {
        price_cheddar = price.price
      }
    }

    if (price_near > 0 && price_cheddar > 0) {
      price_cheddar_near =
        Math.round(price_near / price_cheddar) * Math.pow(10, 3)
    }
  }
  const nftCheddarPrice = (
    (BigInt(nftNearPrice) * BigInt(price_cheddar_near)) /
    BigInt(Math.pow(10, 3))
  ).toString()

  return nftCheddarPrice
}

export default function useTenk(): ReturnedData {
  const [data, setData] = React.useState<ReturnedData>({
    ...(staleData as unknown as TenkData),
    stale: true,
    price_cheddar_near: "0",
  })

  React.useEffect(() => {
    rpcData().then(d =>
      cheddarNearPrice(d.saleInfo.price).then(resp =>
        setData({ ...d, stale: false, price_cheddar_near: resp })
      )
    )
  }, [])

  return data
}
