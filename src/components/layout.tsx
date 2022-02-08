/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { navigate } from "gatsby"

import Header from "./header"
import "./layout.css"
import useLocales from "../hooks/useLocales"

const Layout: React.FC<{ title?: string }> = ({ title, children }) => {
  const locales = useLocales()
  const currentLocale = locales.find(l => l.current)
  return (
    <>
      <Header siteTitle={title} />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0 1.0875rem 1.45rem`,
        }}
      >
        <main>{children}</main>
        {currentLocale && (
          <footer
            style={{
              marginTop: `2rem`,
            }}
          >
            <select
              defaultValue={currentLocale.id}
              onChange={e => navigate("../" + e.target.value)}
            >
              {locales.map(locale => (
                <option key={locale.id} value={locale.id}>
                  {locale.id} - {locale.i18n.langPicker}
                </option>
              ))}
            </select>
          </footer>
        )}
      </div>
    </>
  )
}

export default Layout
