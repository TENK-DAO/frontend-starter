/**
 * This file specifies the exact shape of data required in the locales files
 * located in `config/locales/*.json`
 *
 * We then use `typescript-json-validator` to generate a JSON validator based on
 * these types, which lives in `./Locale.validator.ts`
 */
type Markdown = string

// TODO: should be able to import Action from ./runtimeUtils, but currently breaks with typescript-json-validator
// import type { Action } from './runtimeUtils'
type Action = "ADD_TO_CALENDAR(SALE_START)" | "ADD_TO_CALENDAR(PRESALE_START)" | "SIGN_IN" | "MINT" | "GO_TO_PARAS"

export const requiredHeroFields = [
  'title',
  'body',
  'cta',
  'action',
] as const

export const optionalHeroFields = [
  'backgroundImage',
  'backgroundColor',
  'image',
  'ps',
  'setNumber',
] as const

export type Hero = {
  [K in typeof requiredHeroFields[number]]: K extends 'action' ? Action : Markdown
} & {
  [K in typeof optionalHeroFields[number]]?: string
}

export const userStatuses = ['signedOut', 'signedIn', 'vip'] as const

type HeroSaleStatus = Partial<Hero> & {
  [K in typeof userStatuses[number]]?: Partial<Hero>
}

export const saleStatuses = ['saleClosed', 'presale', 'saleOpen', 'allSold'] as const

export type RawHeroTree = Partial<Hero> & {
  [K in typeof saleStatuses[number]]?: HeroSaleStatus
}

export interface SectionI18n {
  text: Markdown
  image?: string
  backgroundImage?: string
  backgroundColor?: string
}

export default interface Locale {
  viewIn: string
  langPicker: string
  title: string
  description: string
  calendarEvent: string
  connectWallet: string
  signOut: string
  myNFTs: string
  nextNFT: string
  prevNFT: string
  close: string
  zoomIn: string
  zoomOut: string
  hero: RawHeroTree
  extraSections?: SectionI18n[]
}