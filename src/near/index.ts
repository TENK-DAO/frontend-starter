import * as naj from "near-api-js"

// TODO: remove pending https://github.com/near/near-api-js/issues/757
import { Buffer } from "buffer"
window.Buffer = Buffer

/**
 * NEAR Config object
 */
export const near = new naj.Near({
  keyStore: new naj.keyStores.BrowserLocalStorageKeyStore(),
  networkId: process.env.GATSBY_NEAR_NETWORK!,
  nodeUrl: process.env.GATSBY_RPC_URL!,
  walletUrl: process.env.GATSBY_WALLET_URL,
  helperUrl: process.env.GATSBY_HELPER_URL,

  // TODO: remove `headers` argument pending https://github.com/near/near-api-js/pull/772
  headers: {},
})

/**
 * Interface to NEAR Wallet
 */
export const wallet = new naj.WalletConnection(
  near,

  // TODO: remove this second argument to WalletConnection pending https://github.com/near/near-api-js/pull/772
  process.env.GATSBY_LOCALSTORAGE_PREFIX!
)
