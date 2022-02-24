import { SaleInfo } from '../../src/near/contracts/tenk'
import { saleStatuses, userStatuses } from './Locale'

type Timestamp = number

type Data = Omit<SaleInfo, 'status'> & {
  saleStatus: typeof saleStatuses[number]
  userStatus: typeof userStatuses[number]
  mintLimit: number
  locale?: string
  currentUser: string
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
  'SIGN_IN': (d: Data) => alert('Sign in!'),
  'MINT_ONE': (d: Data) => alert('Mint one!'),
  'GO_TO_PARAS': (d: Data) => alert('Go to Paras!'),
}

export type Action = keyof typeof actions

export function act(action: Action, data: Data): void {
  actions[action](data)
}

export function can(action: Action, data: Data): boolean {
  if (action === 'MINT_ONE') {
    return Boolean(data.currentUser) && (
      (data.saleStatus === 'presale' && data.mintLimit > 0) ||
      (data.saleStatus === 'saleOpen')
    )
  }
  return true
}