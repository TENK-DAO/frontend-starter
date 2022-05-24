import { baseDecode } from 'borsh';
import BN from 'bn.js';
import { connect, Contract, keyStores, Near, WalletConnection, ConnectedWalletAccount, RequestSignTransactionsOptions, utils } from 'near-api-js'
import { Action, createTransaction, functionCall, Transaction} from 'near-api-js/lib/transaction';
import { PublicKey } from 'near-api-js/lib/utils'

import { Gas, NEAR } from 'near-units'
import { atcb_action as addToCalendar } from 'add-to-calendar-button'
import settings from '../../config/settings.json'
import { signIn, wallet, near} from '../../src/near'
import { TenK } from '../../src/near/contracts'
//import { FT } from '../../src/near/contracts'
import { TenkData } from "../../src/hooks/useTenk"
import { saleStatuses, userStatuses } from './Locale'
import { Locale } from '../../src/hooks/useLocales'

type Timestamp = number
let nearWebWalletConnection: WalletConnection
let nearConnectedWalletAccount: ConnectedWalletAccount
let requestSignTransOptions: RequestSignTransactionsOptions
let present_account_id = wallet.account().accountId
let ft_num: number = 23
let zero: string = "00000000000000000000000000"

type Data = TenkData & {
  currentUser: string
  locale: Locale
  numberToMint?: number
  saleStatus: typeof saleStatuses[number]
  userStatus: typeof userStatuses[number]
}

async function setupTransaction({
  receiverId,
  actions,
  nonceOffset = 1,
}: {
  receiverId: string;
  actions: Action[];
  nonceOffset?: number;
}) {


  const localKey = await nearConnectedWalletAccount.connection.signer.getPublicKey(
    nearConnectedWalletAccount.accountId,
    nearConnectedWalletAccount.connection.networkId
  );
  let accessKey = await nearConnectedWalletAccount.accessKeyForTransaction(
    receiverId,
    actions,
    localKey
  );
  if (!accessKey) {
    throw new Error(
      `Cannot find matching key for transaction sent to ${receiverId}`
    );
  }

  const block = await nearConnectedWalletAccount.connection.provider.block({ finality: 'final' });
  const blockHash = baseDecode(block.header.hash);

  const publicKey = PublicKey.from(accessKey.public_key);
  const nonce = accessKey.access_key.nonce + nonceOffset;

  return createTransaction(
    nearConnectedWalletAccount.accountId,
    publicKey,
    receiverId,
    nonce,
    actions,
    blockHash
  );
}


function formatNumber(
  num: number | string,

  /**
   * `undefined` will default to browser's locale (may not work correctly in Node during build)
   */
  locale?: string,
) {

  return new Intl.NumberFormat(locale, {
    maximumSignificantDigits: 3,
  }).format(Number(num))
}

function formatCurrency(
  num: number | string,
  currency: string = 'NEAR',

  /**
   * `undefined` will default to browser's locale (may not work correctly in Node during build)
   */
  locale?: string,
) {
  return `${formatNumber(num, locale)} ${currency}`
}

function formatCheddar(
  num: number | string,
  currency: string = 'CHEDDAR',

  /**
   * `undefined` will default to browser's locale (may not work correctly in Node during build)
   */
  locale?: string,
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

  return new Intl.DateTimeFormat(locale,  {
    dateStyle: 'short',
    timeStyle: 'short',
    ...options,
  }).format(date)
}

const replacers = {
  CURRENT_USER: (d: Data) => d.currentUser,
  PRESALE_START: (d: Data) => formatDate(d.saleInfo.presale_start),
  SALE_START: (d: Data) => formatDate(d.saleInfo.sale_start),
  MINT_LIMIT: (d: Data) => d.remainingAllowance ?? 0,
  MINT_PRICE: (d: Data) => formatCurrency(
    NEAR.from(d.saleInfo.price).mul(NEAR.from('' + (d.numberToMint ?? 1))).toHuman().split(' ')[0]
  ),
  MINT_CHED: (d: Data) => {},
  MINT_RATE_LIMIT: (d: Data) => d.mintRateLimit,
  INITIAL_COUNT: (d: Data) => formatNumber(d.saleInfo.token_final_supply),
  REMAINING_COUNT: (d: Data) => formatNumber(d.tokensLeft),
} as const

export const placeholderStrings = Object.keys(replacers)

export type PlaceholderString = keyof typeof replacers

const placeholderRegex = new RegExp(`(${placeholderStrings.join('|')})`, 'gm')

export function fill(text: string, data: Data): string {
  return text.replace(placeholderRegex, (match) => {
    return String(replacers[match as PlaceholderString](data))
  })
}

// add-to-calendar-button has strange strict requirements on time format
function formatDatesForAtcb(d: Timestamp) {
  let [start, end] = new Date(d).toISOString().split('T')
  return [
    start,
    end.replace(/:\d\d\..*$/, '') // strip seconds, ms, & TZ
  ]
}

// add-to-calendar-button doesn't allow passing simple ISO strings for start/end
function getStartAndEnd(d: Timestamp) {
  const [startDate, startTime] = formatDatesForAtcb(d)
  const [endDate, endTime] = formatDatesForAtcb(d + 3600000)
  return { startDate, startTime, endDate, endTime }
}

const actions = {
  'ADD_TO_CALENDAR(SALE_START)': (d: Data) => addToCalendar({
    name: d.locale.calendarEvent!,
    ...getStartAndEnd(d.saleInfo.sale_start),
    options: ['Google', 'iCal', 'Apple', 'Microsoft365', 'MicrosoftTeams', 'Outlook.com', 'Yahoo'],
    timeZone: "UTC",
    trigger: 'click',
  }),
  'ADD_TO_CALENDAR(PRESALE_START)': (d: Data) => addToCalendar({
    name: d.locale.calendarEvent!,
    ...getStartAndEnd(d.saleInfo.presale_start),
    options: ['Google', 'iCal', 'Apple', 'Microsoft365', 'MicrosoftTeams', 'Outlook.com', 'Yahoo'],
    timeZone: "UTC",
    trigger: 'click',
  }),
  'SIGN_IN': signIn,
  'MintForNear': (d: Data) => TenK.nft_mint_many({ with_cheddar: false, num: d.numberToMint ?? 1 }, {
    gas: Gas.parse('40 Tgas').mul(Gas.from('' + d.numberToMint)),
    attachedDeposit: NEAR.from("5150000000000000000000000").mul(NEAR.from('' + d.numberToMint)),
  }),
  'MintForChed': (d:Data) => {},
  'GO_TO_PARAS': () => window.open(`https://paras.id/search?q=${settings.contractName}&sort=priceasc&pmin=.01&is_verified=true`),
}

export type ActionE = keyof typeof actions

export async function act(action: ActionE, data: Data): void {

  if(action === "MintForChed") {
      
      const transactions: Transaction[] = []
      
      let ft_amount: string = ""

      ft_amount = (ft_num * (data.numberToMint ?? 1)).toString() + zero
      console.log(ft_amount);

      nearWebWalletConnection = wallet
      nearConnectedWalletAccount = new ConnectedWalletAccount(nearWebWalletConnection, near.connection, nearWebWalletConnection.getAccountId())

      transactions.unshift({
        receiverId: settings.contractName,
        functionCalls: [
          {
            methodName: 'nft_mint_many',
            args: {
              with_cheddar: true,
              num: data.numberToMint ?? 1
            },
            amount: new BN(utils.format.parseNearAmount('0.2')),
            gas: new BN('100000000000000')
          }
        ]
      });

      transactions.unshift({
        receiverId: settings.ftcontractName,
        functionCalls: [
          {
            methodName: 'ft_transfer_call',
            args: {
              receiver_id: settings.contractName,
              amount: ft_amount,
              msg: "transfer ft"
            },
            amount: new BN(utils.format.parseNearAmount('0.000000000000000000000001')),
            gas: new BN('75000000000000')
          }
        ]
      });
     
      transactions.unshift({
        receiverId: settings.ftcontractName,
        functionCalls: [
          {
            methodName: 'storage_deposit',
            args: {
              account_id: present_account_id
            },
            amount: new BN(utils.format.parseNearAmount('0.2')),
            gas: new BN('100000000000000')
          }
        ]
      });

      const currentTransactions = await Promise.all(
        transactions.map((t, i) => {
          return setupTransaction({
              receiverId: t.receiverId,
              nonceOffset: i + 1,
              actions: t.functionCalls.map((fc) =>
                functionCall(
                  fc.methodName,
                  fc.args,
                  fc.gas,
                  fc.amount
                )
              ),
            });
          })
        );

      requestSignTransOptions = currentTransactions
      nearWebWalletConnection.requestSignTransactions(requestSignTransOptions)
     
    }

    else {

      actions[action](data)

    }
}

export function can(action: ActionE, data: Data): boolean {
  if (action === 'MintForNear' || action === 'MintForChed') {
    return Boolean(data.currentUser) && (
      (data.saleStatus === 'presale' &&
        data.remainingAllowance !== undefined &&
        data.remainingAllowance > 0
      ) ||
      (data.saleStatus === 'saleOpen' && (
        // users are added to the whitelist as they mint during saleOpen;
        // undefined means they haven't minted yet
        data.remainingAllowance === undefined ||
        data.remainingAllowance > 0
      ))
    )
  }
  return true
}


  // if(action === "MintForNear")
  // {
  //     let s;
  //     console.log("Here is MintForNear!")
      
  //     s = TenK.nft_mint_many({ with_cheddar: false, num: data.numberToMint ?? 1 }, {
  //       gas: Gas.parse('40 Tgas').mul(Gas.from('' + data.numberToMint)),
  //       attachedDeposit: NEAR.from("5150000000000000000000000").mul(NEAR.from('' + data.numberToMint)),
  //     })
  //     console.log("\ndata: " + s)
  // }

  // if(action === "MintForChed")
  // {
  //     console.log("Here is MintForChed!");
  //     FT.storage_deposit({ account_id: "aronpayout.testnet" }, {
  //       attachedDeposit: NEAR.from("150000000000000000000000"),
  //     })
      
  //     FT.ft_transfer_call({ receiver_id: settings.contractName, amount: "2250000000000000000000000000", msg: "transfer ft" }, {
  //       gas: Gas.parse('75000000000000 gas'),
  //       attachedDeposit: NEAR.from("1"),
  //     })

  //     TenK.nft_mint_many({ with_cheddar: true, num: data.numberToMint ?? 1 }, {
  //       attachedDeposit: NEAR.from("1500000000000000000000000"),
  //     })
  // }

