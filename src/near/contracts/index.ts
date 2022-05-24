import settings from "../../../config/settings.json"
import { wallet } from ".."
import { Contract } from "./tenk"
import { ftContract } from "./ft"

export const TenK = new Contract(wallet.account(), settings.contractName)
export const FT = new ftContract(wallet.account(), settings.ftcontractName)
