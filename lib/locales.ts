import fs from "fs"
import path from "path"

const rootFields = [
  "viewIn",
  "langPicker",
  "title",
  "description",
  "connectWallet",
] as const

const pageSectionFields = [
  "text",
  "cta",
  "image",
  "backgroundImage",
  "backgroundColor",
] as const

export type SectionI18n = {
  [K in typeof pageSectionFields[number]]: string | undefined
}

export type I18n = {
  [K in typeof rootFields[number]]: string
} & {
  pageSections: SectionI18n[]
}

export interface Locale {
  id: string
  i18n: I18n
}

// for use with `sort`
function alphabeticOrder({ id: a }: Locale, { id: b }: Locale): -1 | 0 | 1 {
  if (a < b) {
    return -1
  } else if (a > b) {
    return 1
  } else {
    return 0
  }
}

const localesDirectory = path.join(process.cwd(), "config/i18n")

function isI18n(fileName: string, obj: {}): obj is I18n {
  rootFields.forEach(field => {
    if (!(field in obj)) {
      console.error(`Expected ${fileName} to have field "${field}"`)
      return false
    }
    // @ts-expect-error Property '...' does not exist on type '{}'. https://github.com/microsoft/TypeScript/issues/21732
    if (typeof obj[field] !== "string") {
      console.error(`Expected ${fileName} to have string field "${field}"`)
      return false
    }
  })
  for (let key of Object.keys(obj)) {
    if (![...rootFields, "pageSections"].includes(key)) {
      console.error(`Unknown i18n field "${key}" in ${fileName}`)
      return false
    }
  }

  if (!obj.hasOwnProperty("pageSections")) {
    console.error(`Expected ${fileName} to have array field "pageSections"`)
    return false
  }
  // @ts-expect-error Property 'pageSections' does not exist on type '{}'. https://github.com/microsoft/TypeScript/issues/21732
  return obj.pageSections.reduce(
    (
      lookingGood: boolean,
      pageSection: { [K in typeof pageSectionFields[number]]: unknown }
    ) => {
      pageSectionFields.forEach(field => {
        if (!["string", "undefined"].includes(typeof pageSection[field])) {
          console.error(
            `Expected ${fileName} to have string field "pageSections[].${field}" or to omit it entirely`
          )
          return false
        }
      })
      for (let key of Object.keys(pageSection)) {
        // @ts-expect-error Argument of type 'string' is not assignable to parameter of type (union of literal values in pageSectionFields)
        if (!pageSectionFields.includes(key)) {
          console.error(
            `Unknown i18n field "pageSections[].${key}" in ${fileName}`
          )
          return false
        }
      }
      return lookingGood && true
    },
    true
  )
}

function checkI18nFields(fileName: string, fileContents: string): I18n {
  const json: unknown = JSON.parse(fileContents)

  if (typeof json !== "object" || json === null || !isI18n(fileName, json)) {
    throw new Error(`Malformed JSON in ${fileName}`)
  }

  return json
}

let fileNames: string[]
try {
  fileNames = fs.readdirSync(localesDirectory)
} catch {
  fileNames = []
}

export const locales: Locale[] = fileNames
  .map(fileName => {
    // Remove ".json" from file name to get id
    const id = fileName.replace(/\.json$/, "")
    const fullPath = path.join(localesDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const i18n = checkI18nFields(fileName, fileContents)

    // Combine the data with the id
    return {
      id,
      i18n,
    }
  })
  .sort(alphabeticOrder)
