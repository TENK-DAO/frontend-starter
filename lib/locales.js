const fs = require("fs")
const path = require("path")
// import fs from "fs"
// import path from "path"

// TODO: figure out how to load TS in gatsby-node.js
// interface I18nFields {
//   view_in: string
//   lang_picker: string
//   title: string
//   description: string
//   hero_title: string
//   hero_body: string
//   hero_cta: string
// }

// export interface Locale {
//   id: string
//   i18n: I18nFields
// }

// for use with `sort`
// function alphabeticOrder({ id: a }: Locale, { id: b }: Locale): -1 | 0 | 1 {
function alphabeticOrder({ id: a }, { id: b }) {
  if (a < b) {
    return -1
  } else if (a > b) {
    return 1
  } else {
    return 0
  }
}

const localesDirectory = path.join(process.cwd(), "i18n")

// function checkI18nFields(fileName: string, data: { [key: string]: any }) {
function checkI18nFields(fileName, data) {
  ;[
    "view_in",
    "lang_picker",
    "title",
    "description",
    "hero_title",
    "hero_body",
    "hero_cta",
  ].forEach(attr => {
    if (!data.hasOwnProperty(attr)) {
      throw new Error(`Expected ${fileName} to have field "${attr}"`)
    }
  })

  // return data as I18nFields
  return data
}

// export function getLocales(): Locale[] {
module.exports.getLocales = function getLocales() {
  // Get file names under /i18n
  let fileNames
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
    const i18n = checkI18nFields(fileName, JSON.parse(fileContents))

    // Combine the data with the id
    return {
      id,
      i18n,
    }
  })

  return allLocalesData.sort(alphabeticOrder)
}

// export async function getLocale(id: string): Promise<Locale> {
module.exports.getLocale = async function getLocale(id) {
  const fileName = `${id}.json`
  const fullPath = path.join(localesDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, "utf8")
  const i18n = checkI18nFields(fileName, JSON.parse(fileContents))

  return {
    id,
    i18n,
  }
}
