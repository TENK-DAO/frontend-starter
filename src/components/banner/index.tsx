import React from "react"
import { Link } from "gatsby"
import useHeroStatuses from '../../hooks/useHeroStatuses'
import * as css from './banner.module.css'

export default function () {
  const { saleStatus, userStatus, heroParam, overrides } = useHeroStatuses()
  if (heroParam === undefined) return null

  const prevOverride = overrides[heroParam - 1]
  const nextOverride = overrides[heroParam + 1]

  return (
    <aside className={css.banner}>
      {prevOverride && (
        <Link
          to={`./?hero=${heroParam - 1}`}
          title={`saleStatus=${prevOverride.saleStatus} & userStatus=${prevOverride.userStatus}`}
        >
          <span className="visuallyHidden">Previous Hero State</span>
        </Link>
      )}
      <div>
        Hero override:{' '}
        <code>saleStatus=<strong>{saleStatus}</strong></code> &amp;{' '}
        <code>userStatus=<strong>{userStatus}</strong></code>
      </div>
      {nextOverride && (
        <Link
          to={`./?hero=${heroParam + 1}`}
          title={`saleStatus=${overrides[heroParam + 1].saleStatus} & userStatus=${overrides[heroParam + 1].userStatus}`}
        >
          <span className="visuallyHidden">Next Hero State</span>
        </Link>
      )}
    </aside>
  )
}