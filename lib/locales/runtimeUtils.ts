import settings from '../../config/settings.json'
import { signIn } from '../../src/near'
import { TenK } from '../../src/near/contracts'
import { SaleInfo } from '../../src/near/contracts/tenk'
import { saleStatuses, userStatuses } from './Locale'

type Timestamp = number

type Data = Omit<SaleInfo, 'status'> & {
  currentUser: string
  locale?: string
  mintLimit: number
  mintRateLimit: number
  numberToMint?: number
  saleStatus: typeof saleStatuses[number]
  userStatus: typeof userStatuses[number]
}

function formatDate(
  d: Timestamp | Date,

  /**
   * `undefined` will default to browser's locale (may not work correctly in Node during build)
   */
  locale?: string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const date = typeof d === "number" ? new Date(d) : d

  return new Intl.DateTimeFormat(locale,  {
    dateStyle: 'short',
    timeStyle: 'short',
    ...options,
  }).format(date)
}

const replacers = {
  CURRENT_USER: (d: Data) => d.currentUser,
  PRESALE_START: (d: Data) => formatDate(d.presale_start, d.locale),
  SALE_START: (d: Data) => formatDate(d.sale_start, d.locale),
  MINT_LIMIT: (d: Data) => d.mintLimit,
  MINT_RATE_LIMIT: (d: Data) => d.mintRateLimit,
  INITIAL_COUNT: (d: Data) => d.token_final_supply,
} as const

export const placeholderStrings = Object.keys(replacers)

export type PlaceholderString = keyof typeof replacers

const placeholderRegex = new RegExp(`(${placeholderStrings.join('|')})`, 'gm')

export function fill(text: string, data: Data): string {
  return text.replace(placeholderRegex, (match) => {
    return String(replacers[match as PlaceholderString](data))
  })
}

const actions = {
  'ADD_TO_CALENDAR(SALE_START)': (d: Data) => alert(`Add ${new Date(d.sale_start).toISOString()} to calendar!`),
  'ADD_TO_CALENDAR(PRESALE_START)': (d: Data) => alert(`Add ${new Date(d.presale_start).toISOString()} to calendar!`),
  'SIGN_IN': signIn,
  'MINT': (d: Data) => TenK.nft_mint_many({ num: d.numberToMint ?? 1 }),
  'GO_TO_PARAS': () => window.open(`https://paras.id/search?q=${settings.contractName}&sort=priceasc&pmin=.01&is_verified=true`),
}

export type Action = keyof typeof actions

export function act(action: Action, data: Data): void {
  actions[action](data)
}

export function can(action: Action, data: Data): boolean {
  if (action === 'MINT') {
    return Boolean(data.currentUser) && (
      (data.saleStatus === 'presale' && data.mintLimit > 0) ||
      (data.saleStatus === 'saleOpen')
    )
  }
  return true
}