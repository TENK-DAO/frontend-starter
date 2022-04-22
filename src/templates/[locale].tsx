import React, { useEffect, useState } from "react"
import { PageProps, navigate } from "gatsby"
import * as naj from "near-api-js"
import { near, wallet } from "../near"

import Hero from "../components/hero"
import MyNFTs from "../components/my-nfts"
import Section from "../components/section"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Markdown from "../components/markdown"
import type { DecoratedLocale } from "../../lib/locales"
import useTenk from "../hooks/useTenk"
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

const Landing: React.FC<PageProps<{}, PageContext>> = ({ location, pageContext: { locale } }) => {
  const { contractMetadata } = useTenk()

  const params = new URLSearchParams(location.search)
  const transactionHashes = params.get('transactionHashes') ?? undefined
  const [tokensMinted, setTokensMinted] = useState<string[]>()
  
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
          favicon={contractMetadata?.icon}
        />
        <Hero heroTree={locale.hero} />
        {locale.extraSections?.map((section, i) => (
          <Section key={i} {...section}>
            <Markdown children={section.text} />
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
