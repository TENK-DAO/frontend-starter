import settings from "../../../config/settings.json"
import { wallet } from ".."
import { Contract } from "./tenk"

class TenKContract extends Contract {
  async mint_rate_limit(args: { account_id: string }): Promise<number> {
    return 10
  }
}

export const TenK = new TenKContract(wallet.account(), settings.contractName)
