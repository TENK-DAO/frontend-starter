import React from 'react'
import type { ExpandedHeroTree } from '../../../lib/locales'
import { fill, act } from '../../../lib/locales/runtimeUtils'
import { wallet } from "../../near"
import { TenK } from "../../near/contracts"
import Section from '../section'
import Markdown from "react-markdown"
import type { SaleInfo } from "../../near/contracts"
import useLocales from '../../hooks/useLocales'

const saleStatuses = {
  'CLOSED': () => 'saleClosed' as const,
  'PRESALE': () => 'presale' as const,
  'OPEN': (remaining: number) => remaining === 0 ? 'allSold' : 'saleOpen' as const
}

const Hero: React.FC<{ heroTree: ExpandedHeroTree }> = ({ heroTree }) => {
  const { locale } = useLocales()
  const currentUser = wallet.getAccountId()

  // TODO: get at least some data in a static query so some version of hero is available at build time
  const [saleInfo, setSaleInfo] = React.useState<SaleInfo>({
    status: 'CLOSED',
    presale_start: 1645239600000000000, // 2022-02-19T03:00:00Z
    sale_start: 1645243200000000000, // 2022-02-19T04:00:00Z
    tokens: {
      remaining: 0,
      initial: 0,
    }
  })
  const [vip, setVip] = React.useState<boolean>(false)
  const [mintLimit, setMintLimit] = React.useState<number>(0)
  // get sale state once after initial page load
  React.useEffect(() => {
    Promise.all([
      TenK.get_sale_info(),
      currentUser ?? TenK.whitelisted({ account_id: currentUser }),
      currentUser ?? TenK.remaining_allowance({ account_id: currentUser }),
    ]).then(([sale, isVip, remainingLimit]) => {
      setSaleInfo(sale)
      setVip(isVip)
      setMintLimit(remainingLimit)
    })
  }, [])

  const hero = heroTree[
    saleStatuses[saleInfo.status](saleInfo.tokens.remaining)
  ][
    vip ? 'vip' : currentUser ? 'signedIn' : 'signedOut'
  ]

  const data = {
    ...saleInfo,
    mintLimit,
    locale: locale?.id,
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