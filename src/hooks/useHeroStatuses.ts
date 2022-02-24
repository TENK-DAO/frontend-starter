import { useLocation } from "@reach/router"
import { wallet } from "../near"
import { Status } from "../near/contracts/tenk"
import useTenk from './useTenk'

const overrides = [
  { saleStatus: 'saleClosed', userStatus: 'signedOut' },
  { saleStatus: 'saleClosed', userStatus: 'signedIn' },
  { saleStatus: 'saleClosed', userStatus: 'vip' },
  { saleStatus: 'presale', userStatus: 'signedOut' },
  { saleStatus: 'presale', userStatus: 'signedIn' },
  { saleStatus: 'presale', userStatus: 'vip' },
  { saleStatus: 'saleOpen', userStatus: 'signedOut' },
  { saleStatus: 'saleOpen', userStatus: 'signedIn' },
  { saleStatus: 'saleOpen', userStatus: 'vip' },
  { saleStatus: 'allSold', userStatus: 'signedOut' },
  { saleStatus: 'allSold', userStatus: 'signedIn' },
  { saleStatus: 'allSold', userStatus: 'vip' },
] as const

const saleStatuses = {
  [Status.Closed]: 'saleClosed',
  [Status.Presale]: 'presale',
  [Status.Open]: 'saleOpen',
  [Status.SoldOut]: 'allSold',
} as const

export default function useHeroStatuses() {
  const { saleInfo, vip } = useTenk()
  const heroParamStr = new URLSearchParams(useLocation().search).get('hero')
  const heroParam = heroParamStr ? parseInt(heroParamStr) : undefined
  const override = overrides[heroParam ?? -1]

  return {
    heroParam,
    overrides,
    saleStatus: override?.saleStatus ?? saleStatuses[saleInfo.status],
    userStatus: override?.userStatus ??
      (vip ? 'vip' : wallet.getAccountId() ? 'signedIn' : 'signedOut'),
  }
}