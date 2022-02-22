import settings from "../../../config/settings.json"
import { wallet } from ".."
import { Contract, Token, ViewFunctionOptions } from "./tenk"

export interface SaleInfo {
  status: 'CLOSED' | 'OPEN' | 'PRESALE'
  presale_start: number // nanosecond-based timestamp
  sale_start: number // nanosecond-based timestamp
  tokens: {
    initial: number
    remaining: number
  }
}

const fakeToken = (id: number, owner_id: string): Token  => ({
  token_id: String(id),
  owner_id,
  metadata: {
    title: 'lol',
    description: 'omg nfts hahaha',
    media: 'https://ipfs.io/ipfs/bafybeiabjp7akpupfhnr53bmwp5gyesorlqzn4a3qk4g5hdami3epfw2me/1844.png'
  }
})

class TenKContract extends Contract {
  async get_sale_info(
    args: {} = {},
    options?: ViewFunctionOptions
  ): Promise<SaleInfo> {
    const [totalSupply, tokensLeft] = await Promise.all([
      this.nft_total_supply(),
      this.tokens_left(),
    ])
    return {
      status: 'CLOSED',
      presale_start: 1645239600000000000, // 2022-02-19T03:00:00Z
      sale_start: 1645243200000000000, // 2022-02-19T04:00:00Z
      tokens: {
        initial: parseInt(totalSupply) + tokensLeft,
        remaining: tokensLeft,
      }
    }
  }

  async nft_tokens_for_owner(
    { account_id }: {
      account_id: string,
      from_index?: string, // default: 0
      limit?: number, // default: unlimited (could fail due to gas limit)
    },
    options?: ViewFunctionOptions
  ): Promise<Token[]> {
    const supply = Number(await this.nft_supply_for_owner({ account_id }))
    return [...Array(supply).keys()].map(id => fakeToken(id, account_id))
  }
}

export const TenK = new TenKContract(wallet.account(), settings.contractName)
