import * as React from "react"
import { navigate } from "gatsby"

import Nav from "../nav"
import "./layout.scss"
import useLocales from "../../hooks/useLocales"

const Layout: React.FC<{ title?: string }> = ({ title, children }) => {
  const { locales, locale } = useLocales()
  return (
    <>
      <Nav />
      {children}
      {locale && (
        <footer
          style={{
            padding: `var(--spacing-xl) 0`,
          }}
        >
          <div className="container">
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "var(--spacing-s)",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                🌐
                <span className="visuallyHidden">
                  {locales.map(l => l.viewIn).join(" | ")}
                </span>
              </div>
              <select
                defaultValue={locale.id}
                onChange={e => navigate("../" + e.target.value)}
                style={{ paddingLeft: "var(--spacing-l)" }}
              >
                {locales.map(locale => (
                  <option key={locale.id} value={locale.id}>
                    {locale.id} - {locale.langPicker}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </footer>
      )}
    </>
  )
}

export default Layout
