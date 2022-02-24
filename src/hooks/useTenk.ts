import React from "react"
import { SaleInfo, Status, Token } from "../near/contracts/tenk"
import { TenK } from "../near/contracts"
import { wallet } from "../near"

const currentUser = wallet.getAccountId()

const stubSaleInfo: SaleInfo = {
  status: Status.Closed,
  presale_start: 1648771200000, // 2022-04-01T00:00:00Z
  sale_start: 1648774800000, // 2022-04-01T01:00:00Z
  token_final_supply: 0,
  price: '0',
}

const rpcCalls = Promise.all([
  TenK.get_sale_info(),
  currentUser && TenK.whitelisted({ account_id: currentUser }),
  currentUser && TenK.remaining_allowance({ account_id: currentUser }),
  currentUser && TenK.nft_tokens_for_owner({ account_id: currentUser }),
])

export default function useTenk() {
  // TODO: get at least some data in a static query so some version of hero is available at build time
  const [data, setData] = React.useState<{
    saleInfo: SaleInfo
    vip: boolean
    mintLimit: number
    nfts: Token[]
  }>({
    saleInfo: stubSaleInfo,
    vip: false,
    mintLimit: 0,
    nfts: []
  })
  React.useEffect(() => {
    rpcCalls.then(([saleInfo, vip, mintLimit, nfts]) => {
      setData({ saleInfo, vip, mintLimit: mintLimit ?? 0, nfts })
    })
  }, [])
  return data
}