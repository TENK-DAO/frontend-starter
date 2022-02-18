import type { SaleInfo } from '../../src/near/contracts'

type Data = SaleInfo & { mintLimit: number } & { locale?: string }

type NanosecondTimestamp = number

function dateFrom(d: NanosecondTimestamp): Date {
  const adjustedTimestamp = d / 1e6
  if (Math.log10(adjustedTimestamp) < 12) {
    throw new Error(
      `dateFrom expects a nanosecond-based timestamp, like those from NEAR. ` +
      `Was given ${d}, which results in a calculated date of ${new Date(adjustedTimestamp)}`
    )
  }
  return new Date(adjustedTimestamp)
}

function formatDate(
  d: NanosecondTimestamp | Date,
  // `undefined` will default to browser's locale (may not work correctly in Node during build)
  locale?: string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const date = typeof d === "number" ? dateFrom(d) : d

  return new Intl.DateTimeFormat(locale,  {
    dateStyle: 'short',
    timeStyle: 'short',
    ...options,
  }).format(date)
}

const replacers = {
  SALE_START: (d: Data) => formatDate(d.sale_start, d.locale),
  PRESALE_START: (d: Data) => formatDate(d.presale_start, d.locale),
  MINT_LIMIT: (d: Data) => d.mintLimit,
  INITIAL_COUNT: (d: Data) => d.tokens.initial
} as const

export type PlaceholderString = keyof typeof replacers

export function fill(text: string, data: Data): string {
  let updatedText = text
  Object.entries(replacers).forEach(([placeholder, replacer]) => {
    console.log({ placeholder, var: replacer(data) })
    updatedText = updatedText.replace(new RegExp(placeholder, 'gm'), String(replacer(data)))
  })
  console.log({updatedText})
  return updatedText
}

const actions = {
  'ADD_TO_CALENDAR(SALE_START)': (d: Data) => alert(`Add ${dateFrom(d.sale_start).toISOString()} to calendar!`),
  'ADD_TO_CALENDAR(PRESALE_START)': (d: Data) => alert(`Add ${dateFrom(d.presale_start).toISOString()} to calendar!`),
  'SIGN_IN': (d: Data) => alert('Sign in!'),
  'MINT_ONE': (d: Data) => alert('Mint one!'),
  'GO_TO_PARAS': (d: Data) => alert('Go to Paras!'),
}

export type Action = keyof typeof actions

export function act(action: Action, data: Data): void {
  actions[action](data)
}