import React from "react"
import type { ExpandedHeroTree } from "../../../lib/locales"
import { act, can, fill } from "../../../lib/locales/runtimeUtils"
import { wallet } from "../../near"
import Slider from "../slider"
import Section from "../section"
import Markdown from "../markdown"
import useHeroStatuses from "../../hooks/useHeroStatuses"
import useTenk from "../../hooks/useTenk"
import useLocales from "../../hooks/useLocales"
import * as css from "./hero.module.css"
import ConnectModal from "../connectModal"

const currentUser = wallet.getAccountId()

const Hero: React.FC<{
  heroTree: ExpandedHeroTree
  showConnectModal: boolean
  setShowConnectModal: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ heroTree, showConnectModal, setShowConnectModal }) => {
  const { locale } = useLocales()
  const tenkData = useTenk()
  const { saleStatus, userStatus } = useHeroStatuses()
  const [numberToMint, setNumberToMint] = React.useState(1)
  const [nearMint, setNearMint] = React.useState(1)
  const [chedMint, setChedMint] = React.useState(3)
  const hero = heroTree[saleStatus][userStatus]

  if (!locale) return null

  const data = {
    ...tenkData,
    currentUser,
    locale,
    saleStatus,
    userStatus,
  }

  const mintForNear = function () {
    if (userStatus === "signedOut") {
      setShowConnectModal(true)
    } else {
      console.log("NEAR")
      act("MintForNear", { ...data, numberToMint })
    }
  }

  const mintForCheddar = function () {
    if (userStatus === "signedOut") {
      setShowConnectModal(true)
    } else {
      console.log("Cheddar")
      act("MintForChed", { ...data, numberToMint })
    }
  }

  return (
    <Section
      backgroundColor={hero.backgroundColor}
      backgroundImage={hero.backgroundImage}
      image={
        !hero.image
          ? undefined
          : {
              src: hero.image,
              loading: "eager",
              alt: "",
            }
      }
      video={
        !hero.video
          ? undefined
          : {
              src: hero.video,
              loop: true,
              autoPlay: true,
            }
      }
    >
      <div className={css.content}>
        {can(hero.action, data) && (
          <form
            onSubmit={e => {
              e.preventDefault()
              //act(hero.action, { ...data, numberToMint })
            }}
          >
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
              </>
            )}
            <button onClick={mintForNear} className={css.cta}>
              {fill(hero.cta, { ...data, numberToMint, nearMint })}
            </button>
            <button onClick={mintForCheddar} className={css.cta}>
              {fill(hero.cta, { ...data, numberToMint, chedMint })}
            </button>
          </form>
        )}
        <div>
          <h1>{locale.title}</h1>
          <Markdown
            children={fill(hero.title, data)}
            components={{ p: "h2" }}
          />
          <div className={css.lead}>
            <Markdown children={fill(hero.body, data)} />
          </div>
          {hero.ps && <Markdown children={fill(hero.ps, data)} />}
        </div>
      </div>
      <ConnectModal
        showConnectModal={showConnectModal}
        setShowConnectModal={setShowConnectModal}
      />
    </Section>
  )
}

export default Hero
