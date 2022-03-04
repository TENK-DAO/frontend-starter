import React from 'react'
import type { ExpandedHeroTree } from '../../../lib/locales'
import { act, can, fill } from '../../../lib/locales/runtimeUtils'
import { wallet } from "../../near"
import Section from '../section'
import Markdown from "../markdown"
import useHeroStatuses from '../../hooks/useHeroStatuses'
import useTenk from '../../hooks/useTenk'
import useLocales from '../../hooks/useLocales'
import * as css from './hero.module.css'

const currentUser = wallet.getAccountId()

const Hero: React.FC<{ heroTree: ExpandedHeroTree }> = ({ heroTree }) => {
  const { locale } = useLocales()
  const { saleInfo, mintLimit, mintRateLimit } = useTenk()
  const { saleStatus, userStatus } = useHeroStatuses()
  const [numberToMint, setNumberToMint] = React.useState(1)
  const hero = heroTree[saleStatus][userStatus]

  if (!locale) return null

  const data = {
    ...saleInfo,
    locale,
    saleStatus,
    userStatus,
    mintLimit,
    mintRateLimit,
    currentUser,
  }

  return (
    <Section {...hero}>
      <Markdown children={fill(hero.title, data)} components={{ p: 'h1' }} />
      <Markdown children={fill(hero.body, data)} />
      {hero.ps && <Markdown children={fill(hero.ps, data)} />}
      {can(hero.action, data) && (
        <form onSubmit={e => {
          e.preventDefault()
          act(hero.action, { ...data, numberToMint })
        }}>
          {hero.setNumber && (
            <p className={css.setNumber}>
              <label htmlFor="numberToMint">{hero.setNumber}</label>
              <input
                max={fill('MINT_RATE_LIMIT', data)}
                min={1}
                onChange={e => setNumberToMint(parseInt(e.target.value))}
                value={numberToMint}
                type="number"
              />
            </p>
          )}
          <button className={css.cta}>
            {fill(hero.cta, data)}
          </button>
        </form>
      )}
    </Section>
  )
}

export default Hero