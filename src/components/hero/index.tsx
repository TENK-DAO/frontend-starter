import React from 'react'
import type { ExpandedHeroTree } from '../../../lib/locales'
import { fill, act } from '../../../lib/locales/runtimeUtils'
import { wallet } from "../../near"
import Section from '../section'
import Markdown from "../markdown"
import useLocales from '../../hooks/useLocales'
import useHeroStatuses from '../../hooks/useHeroStatuses'
import useTenk from '../../hooks/useTenk'

const Hero: React.FC<{ heroTree: ExpandedHeroTree }> = ({ heroTree }) => {
  const { locale } = useLocales()
  const currentUser = wallet.getAccountId()
  const { saleInfo, mintLimit } = useTenk()
  const { saleStatus, userStatus } = useHeroStatuses()
  const hero = heroTree[saleStatus][userStatus]

  const data = {
    ...saleInfo,
    mintLimit,
    locale: locale?.id,
    currentUser,
  }

  return (
    <Section {...hero}>
      <Markdown children={fill(hero.title, data)} components={{ p: 'h1' }} />
      <Markdown children={fill(hero.body, data)} />
      {hero.ps && <Markdown children={fill(hero.ps, data)} />}
      <button
        className="cta"
        onClick={() => {
          act(hero.action, data)
        }}
      >
        {fill(hero.cta, data)}
      </button>
    </Section>
  )
}

export default Hero