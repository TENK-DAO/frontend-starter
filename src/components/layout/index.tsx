import * as React from "react"
import { navigate } from "gatsby"

import "./layout.scss"
import useLocales from "../../hooks/useLocales"

const Layout: React.FC<{ title?: string }> = ({ title, children }) => {
  const locales = useLocales()
  const currentLocale = locales.find(l => l.current)
  return (
    <>
      {children}
      {currentLocale && (
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
                  {locales.map(l => l.i18n.viewIn).join(" | ")}
                </span>
              </div>
              <select
                defaultValue={currentLocale.id}
                onChange={e => navigate("../" + e.target.value)}
                style={{ paddingLeft: "var(--spacing-l)" }}
              >
                {locales.map(locale => (
                  <option key={locale.id} value={locale.id}>
                    {locale.id} - {locale.i18n.langPicker}
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
