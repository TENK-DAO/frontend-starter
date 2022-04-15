import fs from "fs"
import path from "path"
import { GatsbyNode } from "gatsby"
import { locales } from "./lib/locales"
import { rpcData } from "./src/hooks/useTenk"

export const onPreInit: GatsbyNode["onPreInit"] = async () => {
  const data = await rpcData()
  fs.writeFileSync(
    path.resolve('stale-data-from-build-time.json'),
    JSON.stringify(data)
  )
}

export const createPages: GatsbyNode["createPages"] = async ({ actions }) => {
  locales.forEach(locale => {
    actions.createPage({
      path: locale.id,
      component: path.resolve("src/templates/[locale].tsx"),
      context: { locale },
    })
  })
}
