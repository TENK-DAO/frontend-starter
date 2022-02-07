import fs from "fs"
import path from "path"

const i18nFields = [
  "view_in",
  "lang_picker",
  "title",
  "description",
  "hero_title",
  "hero_body",
  "hero_cta",
] as const

export type I18nFields = {
  [K in typeof i18nFields[number]]: string
}

export interface Locale {
  id: string
  i18n: I18nFields
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

const localesDirectory = path.join(process.cwd(), "i18n")

/**
 * Returns something close to `I18nFields`, but with the type of each field being `unknown`
 *
 * This and the subsequent check that each field is a string can be combined
 * into a single loop once TS implements `in` as a proper type guard:
 * https://github.com/microsoft/TypeScript/issues/21732
 */
function isI18nShape(
  fileName: string,
  obj: {}
): obj is { [K in typeof i18nFields[number]]: unknown } {
  i18nFields.forEach(field => {
    if (!(field in obj)) {
      console.error(`Expected ${fileName} to have field "${field}"`)
      return false
    }
  })
  return true
}
function checkI18nFields(fileName: string, fileContents: string): I18nFields {
  const json: unknown = JSON.parse(fileContents)
  if (
    typeof json !== "object" ||
    json === null ||
    !isI18nShape(fileName, json)
  ) {
    throw new Error(
      `Expected ${fileName} to contain an object with keys: ${i18nFields}`
    )
  }
  i18nFields.forEach(attr => {
    if (typeof json[attr] !== "string") {
      throw new Error(`Expected ${fileName} to have string field "${attr}"`)
    }
  })

  return json as I18nFields
}

export function getLocales(): Locale[] {
  // Get file names under /i18n
  let fileNames: string[]
  try {
    fileNames = fs.readdirSync(localesDirectory)
  } catch {
    fileNames = []
  }
  const allLocalesData = fileNames.map(fileName => {
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

  return allLocalesData.sort(alphabeticOrder)
}

export async function getLocale(id: string): Promise<Locale> {
  const fileName = `${id}.json`
  const fullPath = path.join(localesDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, "utf8")
  const i18n = checkI18nFields(fileName, fileContents)

  return {
    id,
    i18n,
  }
}
