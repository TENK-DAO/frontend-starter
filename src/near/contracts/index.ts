import settings from "../../../config/settings.json"
import { wallet } from ".."
import { Contract, ViewFunctionOptions } from "./tenk"

// every page load, at least do this:
export interface SaleInfo {
  status: 'CLOSED' | 'OPEN' | 'PRESALE'
  presale_start: number // nanosecond-based timestamp
  sale_start: number // nanosecond-based timestamp
  tokens: {
    initial: number
    remaining: number
  }
}

// if sale closed, no further queries needed
// if presale and user logged in, check if they're `whitelisted`
// if whitelisted, check token price using `total_cost` and `remaining_allowance`
// if sale open, check if sold out using `tokens_left`

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
}

export const TenK = new TenKContract(wallet.account(), settings.contractName)
