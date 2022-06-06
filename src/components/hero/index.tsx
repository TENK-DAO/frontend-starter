import React from 'react'
import type { ExpandedHeroTree } from '../../../lib/locales'
import { act, can, fill } from '../../../lib/locales/runtimeUtils'
import { wallet } from "../../near"
import Slider from '../slider'
import Section from '../section'
import Markdown from "../markdown"
import useHeroStatuses from '../../hooks/useHeroStatuses'
import useTenk from '../../hooks/useTenk'
import useLocales from '../../hooks/useLocales'
import * as css from './hero.module.css'

const currentUser = wallet.getAccountId()

const Hero: React.FC<{ heroTree: ExpandedHeroTree }> = ({ heroTree }) => {
  const { locale } = useLocales()
  const tenkData = useTenk()
  const { saleStatus, userStatus } = useHeroStatuses()
  const [numberToMint, setNumberToMint] = React.useState(1)
  const hero = heroTree[saleStatus][userStatus]
 // console.log(heroTree + "\n" + saleStatus)

  if (!locale) return null

  const data = {
    ...tenkData,
    currentUser,
    locale,
    saleStatus,
    userStatus,
  }
  
  const mintForNear = function () {
    act("MintForNear", { ...data, numberToMint})
  }

  const mintForCheddar = function() {
      act("MintForChed", { ...data, numberToMint}) 
  }

  return (
    <Section
      backgroundColor={hero.backgroundColor}
      backgroundImage={hero.backgroundImage}
      image={!hero.image ? undefined : {
        src: hero.image,
        loading: "eager",
        alt: "",
      }}
      video={!hero.video ? undefined : {
        src: hero.video,
        loop: true,
        autoPlay: true,
      }}
    >
      <div className={css.content}>
        {can("MintForNear", data) && (
          <form onSubmit={e => {
            e.preventDefault()
           // act(hero.action, { ...data, numberToMint })
          }}>
            {hero.setNumber && (
              <>
                <div className={css.labelWrap}>
                  <label className={css.label} htmlFor="numberToMint">
                    {hero.setNumber}
                  </label>
                  <div className={css.remaining}>
                    {fill(hero.remaining, data)}
                  </div>
                </div>
                <Slider
                  max={1}
                  min={1}
                  name="numberToMint"
                  onValueChange={([v]) => setNumberToMint(v)}
                  value={[numberToMint]}
                />
              </>
            )}
            <button onClick={mintForNear} className={css.cta}>
              {fill(hero.cta, { ...data, numberToMint })}
            </button>

            <button onClick={mintForCheddar} className={css.cta}>
              {fill(hero.ctaCheddar, { ...data, numberToMint })}
            </button>
            <p style={{textAlign:"center"}}>* Storage Deposit of 0.15 NEAR  Required<br/>Swap <a href="https://app.ref.finance/#token.cheddar.near%7Cwrap.near" target="_blank">🧀</a> on <a href="https://app.ref.finance/#token.cheddar.near%7Cwrap.near" target="_blank">↔️  Ref Finance</a></p>
            <p style={{textAlign:"center"}}></p>

          </form>
        )}
        <div>
          <h1>{locale.title}</h1>
          <Markdown children={fill(hero.title, data)} components={{ p: 'h2' }} />
          <div className={css.lead}>
            <Markdown children={fill(hero.body, data)} />
          </div>
          {hero.ps && <Markdown children={fill(hero.ps, data)} />}
        </div>
      </div>
    </Section>
  )
}

export default Hero