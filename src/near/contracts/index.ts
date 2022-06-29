import settings from "../../../config/settings.json"
import { wallet } from ".."
import { Contract } from "./tenk"

export const TENK = new Contract(wallet.account(), settings.contractName)
