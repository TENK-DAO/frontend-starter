import React from "react"
import { SaleInfo, Status, Token } from "../near/contracts/tenk"
import { TenK } from "../near/contracts"
import { wallet } from "../near"

const account_id = wallet.getAccountId()

const stubSaleInfo: SaleInfo = {
  status: Status.Closed,
  presale_start: 1648771200000, // 2022-04-01T00:00:00Z
  sale_start: 1648774800000, // 2022-04-01T01:00:00Z
  token_final_supply: 0,
  price: '0',
}

const rpcCalls = Promise.all([
  TenK.get_sale_info(),
  account_id && TenK.whitelisted({ account_id }),
  account_id && TenK.remaining_allowance({ account_id }),
  account_id && TenK.nft_tokens_for_owner({ account_id }),
  account_id && TenK.mint_rate_limit({ account_id }),
])

export default function useTenk() {
  // TODO: get at least some data in a static query so some version of hero is available at build time
  const [data, setData] = React.useState<{
    saleInfo: SaleInfo
    vip: boolean
    mintLimit: number
    nfts: Token[]
    mintRateLimit: number
  }>({
    saleInfo: stubSaleInfo,
    vip: false,
    mintLimit: 0,
    nfts: [],
    mintRateLimit: 10,
  })
  React.useEffect(() => {
    rpcCalls.then(([saleInfo, vip, mintLimit, nfts, mintRateLimit ]) => {
      setData({ saleInfo, vip, mintLimit: mintLimit ?? 0, nfts, mintRateLimit })
    })
  }, [])
  return data
}