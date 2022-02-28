import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import { requiredHeroFields, optionalHeroFields, saleStatuses, userStatuses } from "./Locale"
import type Locale from "./Locale"
import { placeholderStrings } from './runtimeUtils'
import type { Hero, RawHeroTree } from "./Locale"

// re-create `Locale.validator.ts` based of current contents of `Locale.ts`
execSync(`yarn typescript-json-validator --noExtraProps ${__dirname}/Locale.ts Locale`)

// now that we re-created the file we can import the latest version
const validate: (x: unknown) => Locale = require('./Locale.validator').default

class LocaleError extends Error {}

interface HeroSaleState {
  signedOut: Hero
  signedIn: Hero
  vip: Hero
}

export interface ExpandedHeroTree {
  saleClosed: HeroSaleState
  presale: HeroSaleState
  saleOpen: HeroSaleState
  allSold: HeroSaleState
}

export interface DecoratedLocale extends Locale {
  id: string
  hero: ExpandedHeroTree
}

function computeField({ rawHeroTree, saleStatus, userStatus, required }: {
  rawHeroTree: RawHeroTree
  saleStatus: keyof ExpandedHeroTree
  userStatus: keyof HeroSaleState
  required: boolean
}) {
  return (hero: Partial<Hero>, field: keyof Hero) => {
    // @ts-expect-error Type 'string | undefined' is not assignable to type 'Action'
    hero[field] =
      rawHeroTree[saleStatus]?.[userStatus]?.[field] ??
      rawHeroTree[saleStatus]?.[field] ??
      rawHeroTree[field]
    if (required && typeof hero[field] === "undefined") {
      throw new LocaleError(
        `"hero" must include computable "${field}" in each branch; please include at least one of:\n` +
        `  • "hero.${field}"\n` +
        `  • "hero.${saleStatus}.${field}"\n` +
        `  • "hero.${saleStatus}.${userStatus}.${field}"\n` +
        `(if set in more than one of these, a more specific setting overrides a more general)`
      )
    }
    // warn if it looks like there might be an unknown placeholder string
    // ('action' field values are validated as part of the schema, so we can skip them here)
    const allCapsSubStrings = field !== 'action' && hero[field]?.matchAll(/\b[A-Z_]+\b/g)
    Array.from(allCapsSubStrings || []).forEach(([possiblePlaceholder]) => {
      // TODO: update above regex to only match strings with underscores in them to avoid `.match('_')`
      if (possiblePlaceholder.match('_') && !placeholderStrings.includes(possiblePlaceholder)) {
        console.warn(
          `"hero" field "${field}" contains what looks like a placeholder string "${possiblePlaceholder}", ` +
          `but no substitution is available for this string. Did you mean to include one of the following?\n\n` +
          `  • ${placeholderStrings.join('\n  • ')}\n\n` +
          `The full text given for this field was:\n\n  ${hero[field]}\n\n`
        )
      }
    })
    return hero
  }
}

function hoistHeroFields(rawHeroTree: RawHeroTree): ExpandedHeroTree {
  return saleStatuses.reduce((a, saleStatus) => ({ ...a,
    [saleStatus]: userStatuses.reduce((b, userStatus) => ({ ...b,
      [userStatus]: {
        ...requiredHeroFields.reduce(computeField({ rawHeroTree, saleStatus, userStatus, required: true }), {}),
        ...optionalHeroFields.reduce(computeField({ rawHeroTree, saleStatus, userStatus, required: false }), {}),
      } as Hero
    }), {} as HeroSaleState)
  }), {} as ExpandedHeroTree)
}

// for use with `sort`
function alphabeticOrder({ id: a }: DecoratedLocale, { id: b }: DecoratedLocale): -1 | 0 | 1 {
  if (a < b) {
    return -1
  } else if (a > b) {
    return 1
  } else {
    return 0
  }
}

const localesDirectory = path.join(process.cwd(), "config/i18n")

let fileNames: string[]
try {
  fileNames = fs.readdirSync(localesDirectory)
} catch {
  fileNames = []
}

const IS_JSON = /.json$/

export const locales: DecoratedLocale[] = fileNames.filter(f => IS_JSON.test(f))
  .map(fileName => {
    // Remove ".json" from file name to get id
    // TODO: validate that `id` is valid according to https://www.npmjs.com/package/iso-639-1
    const id = fileName.replace(/\.json$/, "")
    const fullPath = path.join(localesDirectory, fileName)
    const fileContents: unknown = JSON.parse(fs.readFileSync(fullPath, "utf8"))
    const i18n = validate(fileContents)

    let hero: ExpandedHeroTree
    try {
      hero = hoistHeroFields(i18n.hero)
    } catch (e: unknown) {
      if (e instanceof LocaleError) {
        throw new Error(`Error parsing ${fileName}:\n\n${e.message}`)
      }
      throw e
    }

    // Combine the data with the id
    return {
      id,
      ...i18n,
      hero,
    }
  })
  .sort(alphabeticOrder)
