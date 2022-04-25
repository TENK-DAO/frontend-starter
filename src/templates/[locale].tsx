import settings from "../../config/settings.json"
import React, { useEffect, useState } from "react"
import { PageProps, navigate } from "gatsby"
import * as naj from "near-api-js"
import { near, wallet } from "../near"

import { fill } from '../../lib/locales/runtimeUtils'
import Hero from "../components/hero"
import MyNFTs from "../components/my-nfts"
import Section from "../components/section"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Markdown from "../components/markdown"
import Image from "../components/image"
import type { DecoratedLocale } from "../../lib/locales"
import useTenk from "../hooks/useTenk"
import useImageData from "../hooks/useImageData"
import useHeroStatuses from '../hooks/useHeroStatuses'
import { Token } from "../near/contracts/tenk"

type PageContext = {
  locale: DecoratedLocale
}

function hasSuccessValue(obj: {}): obj is { SuccessValue: string } {
  return 'SuccessValue' in obj
}

async function getTokenIDsForTxHash(txHash: string): Promise<string[] | undefined> {
  const rpc = new naj.providers.JsonRpcProvider(near.config.nodeUrl)
  const tx = await rpc.txStatus(txHash, wallet.getAccountId())
  if (!hasSuccessValue(tx.status)) return undefined
  const base64Result = tx.status.SuccessValue
  const result = atob(base64Result)
  const tokens = JSON.parse(result) as Token[]
  return tokens.map(token => token.token_id)
}

const currentUser = wallet.getAccountId()

const Landing: React.FC<PageProps<{}, PageContext>> = ({ location, pageContext: { locale } }) => {

  const tenkData = useTenk()
  const { image } = useImageData(settings.image)

  const params = new URLSearchParams(location.search)
  const transactionHashes = params.get('transactionHashes') ?? undefined
  const [tokensMinted, setTokensMinted] = useState<string[]>()
  const { saleStatus, userStatus } = useHeroStatuses()

  const data = {
    ...tenkData,
    currentUser,
    locale,
    saleStatus,
    userStatus,
  }
  
  useEffect(() => {
    if (!transactionHashes) return
    getTokenIDsForTxHash(transactionHashes).then(setTokensMinted)
  }, [transactionHashes])

  return (
    <>
      <Layout style={{ filter: transactionHashes && 'blur(4px)' }}>
        <Seo
          lang={locale.id}
          title={locale.title}
          description={locale.description}
          favicon={tenkData.contractMetadata?.icon}
          image={image?.publicURL ?? undefined}
        />
        <Hero heroTree={locale.hero} />
        {locale.extraSections?.map((section, i) => (
          <Section key={i} {...section}>
            <Markdown children={fill(section.text, data)} />
            {section.blocks && (
              <div className="grid">
                {section.blocks.map(({ linkTo, text, image }, j) => {
                  const El = linkTo ? 'a' : 'div'
                  const props = linkTo && { href: linkTo, target: '_blank' }
                  return (
                    <El key={j} {...props}>
                      {image && (
                        <div className="image">
                          <Image src={image} alt="" />
                        </div>
                      )}
                      {text && (
                        <div className="text">
                          <Markdown children={fill(text, data)} />
                        </div>
                      )}
                    </El>
                  )
                })}
              </div>
            )}
          </Section>
        ))}
      </Layout>
      {transactionHashes && (
        <MyNFTs
          onClose={() => navigate(`/${locale.id}`)}
          highlight={tokensMinted}
        />
      )}
    </>
  )
}

export default Landing
