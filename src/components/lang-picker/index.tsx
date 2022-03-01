import * as React from "react"
import { navigate } from "gatsby"
import useLocales from "../../hooks/useLocales"
import * as css from "./lang-picker.module.css"

export default function LangPicker() {
  const { locales, locale } = useLocales()
  if (!locale) return null
  return (
    <div className={css.wrap}>
      <div className={css.globe}>
        🌐
        <span className="visuallyHidden">
          {locales.map(l => l.viewIn).join(" | ")}
        </span>
      </div>
      <select
        defaultValue={locale.id}
        onChange={e => navigate("../" + e.target.value)}
        className={css.select}
      >
        {locales.map(locale => (
          <option key={locale.id} value={locale.id}>
            {locale.id} - {locale.langPicker}
          </option>
        ))}
      </select>
    </div>
  )
}