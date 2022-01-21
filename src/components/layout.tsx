/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { Link } from "gatsby"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { GlobeIcon, TriangleDownIcon } from "@radix-ui/react-icons"

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
        <footer
          style={{
            marginTop: `2rem`,
          }}
        >
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <GlobeIcon />
              {currentLocale
                ? `${currentLocale.id} - ${currentLocale.i18n.lang_picker}`
                : "..."}
              <TriangleDownIcon />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {locales.map(
                locale =>
                  !locale.current && (
                    <DropdownMenu.Item>
                      <Link to={`/${locale.id}`}>
                        {locale.id} - {locale.i18n.lang_picker}
                      </Link>
                    </DropdownMenu.Item>
                  )
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </footer>
      </div>
    </>
  )
}

export default Layout
