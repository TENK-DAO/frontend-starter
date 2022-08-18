import { Gas, NEAR } from "near-units"
import { atcb_action as addToCalendar } from "add-to-calendar-button"
import settings from "../../config/settings.json"
import { signIn } from "../../src/near"
import { TenK } from "../../src/near/contracts"
import { TenkData } from "../../src/hooks/useTenk"
import { saleStatuses, userStatuses } from "./Locale"
import { Locale } from "../../src/hooks/useLocales"
import { transactions } from "near-api-js"
import { BN } from "bn.js"

type Timestamp = number

type Data = TenkData & {
  currentUser: string
  locale: Locale
  numberToMint?: number
  nearMint?: number
  chedMint?: number
  saleStatus: typeof saleStatuses[number]
  userStatus: typeof userStatuses[number]
  price_cheddar_near: string
}

function formatNumber(
  num: number | string,

  /**
   * `undefined` will default to browser's locale (may not work correctly in Node during build)
   */
  locale?: string
) {
  return new Intl.NumberFormat(locale, {
    maximumSignificantDigits: 3,
  }).format(Number(num))
}

function formatCurrency(
  num: number | string,
  currency: string = "NEAR",

  /**
   * `undefined` will default to browser's locale (may not work correctly in Node during build)
   */
  locale?: string
) {
  return `${formatNumber(num, locale)} ${currency}`
}

function formatCurrencyCheddar(
  num: number | string,
  currency: string = "Cheddar",

  /**
   * `undefined` will default to browser's locale (may not work correctly in Node during build)
   */
  locale?: string
) {
  return `${formatNumber(num, locale)} ${currency}`
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

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
    timeStyle: "short",
    ...options,
  }).format(date)
}

const replacers = {
  CURRENT_USER: (d: Data) => d.currentUser,
  PRESALE_START: (d: Data) => formatDate(d.saleInfo.presale_start),
  SALE_START: (d: Data) => formatDate(d.saleInfo.sale_start),
  MINT_LIMIT: (d: Data) => d.remainingAllowance ?? 0,
  MINT_PRICE: (d: Data) =>
    d.nearMint == 1
      ? formatCurrency(
          NEAR.from(d.saleInfo.price)
            .mul(NEAR.from("" + (d.numberToMint ?? 1)))
            .toHuman()
            .split(" ")[0]
        )
      : formatCurrencyCheddar(
          (BigInt(d.price_cheddar_near) / BigInt(Math.pow(10, 24))).toString()
        ),
  MINT_RATE_LIMIT: (d: Data) => d.mintRateLimit,
  INITIAL_COUNT: (d: Data) => formatNumber(d.saleInfo.token_final_supply),
  REMAINING_COUNT: (d: Data) => formatNumber(d.tokensLeft),
} as const

export const placeholderStrings = Object.keys(replacers)

export type PlaceholderString = keyof typeof replacers

const placeholderRegex = new RegExp(`(${placeholderStrings.join("|")})`, "gm")

export function fill(text: string, data: Data): string {
  return text.replace(placeholderRegex, match => {
    return String(replacers[match as PlaceholderString](data))
  })
}

// add-to-calendar-button has strange strict requirements on time format
function formatDatesForAtcb(d: Timestamp) {
  let [start, end] = new Date(d).toISOString().split("T")
  return [
    start,
    end.replace(/:\d\d\..*$/, ""), // strip seconds, ms, & TZ
  ]
}

// add-to-calendar-button doesn't allow passing simple ISO strings for start/end
function getStartAndEnd(d: Timestamp) {
  const [startDate, startTime] = formatDatesForAtcb(d)
  const [endDate, endTime] = formatDatesForAtcb(d + 3600000)
  return { startDate, startTime, endDate, endTime }
}

const actions = {
  "ADD_TO_CALENDAR(SALE_START)": (d: Data) =>
    addToCalendar({
      name: d.locale.calendarEvent!,
      ...getStartAndEnd(d.saleInfo.sale_start),
      options: [
        "Google",
        "iCal",
        "Apple",
        "Microsoft365",
        "MicrosoftTeams",
        "Outlook.com",
        "Yahoo",
      ],
      timeZone: "UTC",
      trigger: "click",
    }),
  "ADD_TO_CALENDAR(PRESALE_START)": (d: Data) =>
    addToCalendar({
      name: d.locale.calendarEvent!,
      ...getStartAndEnd(d.saleInfo.presale_start),
      options: [
        "Google",
        "iCal",
        "Apple",
        "Microsoft365",
        "MicrosoftTeams",
        "Outlook.com",
        "Yahoo",
      ],
      timeZone: "UTC",
      trigger: "click",
    }),
  SIGN_IN: signIn,
  MINT: (d: Data) =>
    TenK.nft_mint_many(
      { num: d.numberToMint ?? 1 },
      {
        gas: Gas.parse("40 Tgas").mul(Gas.from("" + d.numberToMint)),
        attachedDeposit: NEAR.from(d.saleInfo.price).mul(
          NEAR.from("" + d.numberToMint)
        ),
      }
    ),
  MintForNear: (d: Data) =>
    TenK.nft_mint_many(
      { num: d.numberToMint ?? 1, with_cheddar: false },
      {
        gas: Gas.parse("40 Tgas").mul(Gas.from("" + d.numberToMint)),
        attachedDeposit: NEAR.from(d.saleInfo.price).mul(
          NEAR.from("" + d.numberToMint)
        ),
      }
    ),
  MintForChed: (d: Data) => {
    TenK.get_cheddar_storage_balance("oreos.testnet").then(resp => {
      const cheddarActions = []
      const tenkActions = []
      const finalActions = []
      if (!resp) {
        cheddarActions.push(
          transactions.functionCall(
            "storage_deposit",
            {},
            Gas.parse("100 Tgas"),
            new BN("1120000000000000000000")
          )
        )
      }
      cheddarActions.push(
        transactions.functionCall(
          "ft_transfer_call",
          {
            receiver_id: TenK.contractId,
            amount: d.price_cheddar_near,
            msg: "",
          },
          Gas.parse("200 Tgas"),
          new BN("1")
        )
      )
      tenkActions.push(
        transactions.functionCall(
          "nft_mint_many",
          { num: d.numberToMint ?? 1, with_cheddar: true },

          Gas.parse("40 Tgas").mul(Gas.from("" + d.numberToMint)),
          new BN("1")
        )
      )
      finalActions.push(
        TenK.makeTransaction("token-v3.cheddar.testnet", cheddarActions)
      )
      finalActions.push(TenK.makeTransaction(TenK.contractId, tenkActions))
      TenK.passToWallet(finalActions)
    })
  },
  GO_TO_PARAS: () =>
    window.open(
      `https://paras.id/search?q=${settings.contractName}&sort=priceasc&pmin=.01&is_verified=true`
    ),
}

export type Action = keyof typeof actions

export function act(action: Action, data: Data): void {
  actions[action](data)
}

export function can(action: Action, data: Data): boolean {
  if (action === "MINT") {
    return (
      Boolean(data.currentUser) &&
      ((data.saleStatus === "presale" &&
        data.remainingAllowance !== undefined &&
        data.remainingAllowance > 0) ||
        (data.saleStatus === "saleOpen" &&
          // users are added to the whitelist as they mint during saleOpen;
          // undefined means they haven't minted yet
          (data.remainingAllowance === undefined ||
            data.remainingAllowance > 0)))
    )
  }
  return true
}
