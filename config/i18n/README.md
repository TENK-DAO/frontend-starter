# Internationalize your site

This folder contains a JSON file for each locale you want to include. Add a new one and it will automatically be incorporated into your site next time you build/deploy or restart your development server.

At build time (when you run `yarn build` as during a deploy, or when you restart your `yarn start` development server) the data in these files will be validated. This means you can be confident that you included all necessary fields, didn't misspell optional fields, and that every possible `hero` variant is well-formed. (The data validation does not and cannot validate that you included reasonable translations in each file, though!)

# About that hero

The most important part of your site is the hero section. This is the above-the-fold, right-at-the-top part that people see first.

This site is designed so that everything important happens here. Before your NFT launch, it tells people when the launch will happen and encourages them to add it to their calendars. During the launch, it's where they buy NFTs. Afterwards, the hero section links to the secondary market on [Paras](https://paras.id/).

In the example files contained here, you'll see that the `hero` i18n data is designed to be as compact as possible, minimizing duplication and thus your chance to make mistakes. Let's look at an example:

```js
"hero": {
  "backgroundImage": "hero-bg.svg",
  "image": "hero.png",
  "title": "The first fleet of the  \n*Metaverse*",
  "body": "Join an Exclusive Community of NEAR early adopters and BUIDLers.",
  "ps": "Misfits drop at SALE_START!",
  "cta": "Add to Calendar",
  "action": "ADD_TO_CALENDAR(SALE_START)",
  "saleClosed": {
    "signedIn": {
      "ps": "* Minting starts at: SALE_START\n\n* Pre-mint starts at: PRESALE_START\n\nGet in on the pre-mint! [Join our Discord](https://discord.com/invite/UY9Xf2k) and request an invite."
    },
    "vip": {
      "ps": "Welcome, CURRENT_USER! Pre-mint starts at PRESALE_START",
      "action": "ADD_TO_CALENDAR(PRESALE_START)"
    }
  },
  "presale": {
    "vip": {
      "ps": "Welcome, CURRENT_USER! Pre-mint started. Public minting starts at SALE_START.\n\nYour remaining pre-mint allowance: MINT_LIMIT",
      "cta": "Mint One!",
      "action": "MINT_ONE"
    }
  },
  "saleOpen": {
    "ps": "Misfit Minting Has Begun!",
    "cta": "Mint One!",
    "action": "MINT_ONE",
    "signedOut": {
      "action": "SIGN_IN"
    }
  },
  "allSold": {
    "title": "All INITIAL_COUNT minted!",
    "body": "The Misfits have all been created",
    "ps": "",
    "cta": "Buy Pre-Owned",
    "action": "GO_TO_PARAS"
  }
}
```

As you may have guessed, a more specific setting will override a more general one. So here, before the sale has started (`saleClosed`):

* Someone who is signed out will see the `ps` included in the root: "Misfits drop at SALE_START!"
* While someone who is signed in will see both the sale start time and the presale start time, with a link to the project's Discord to become a VIP
* And someone who is already a VIP will see only the presale start time, and their Call To Action button (CTA) will add the presale time to their calendar, rather than the sale time.

And then, after the public sale has started (`saleOpen`), almost everyone sees the same thing. "Minting has begun! Mint One!" The only exception here is that people who are not yet signed in will get signed in, when they click the Mint One button, rather than immediately minting one.

The `image` and `backgroundImage` values need to have corresponding images in [`config/images`](../images/).

The list of valid `action`s is given by the keys of `const actions` in [`lib/locales/runtimeUtils.ts`](../../lib/locales/runtimeUtils.ts), and the list of valid placeholder strings like `CURRENT_USER` and `SALE_START` is given by the keys of `const replacers` in the same file. If you use an invalid action, the data will not validate and your build will fail, so you're protected from deploying a broken site. If you use an invalid placeholder string, you will only see a warning at build time, but the site will still build! This is because it's impossible to know at build time if you purposely included UPPERCASE_TEXT_WITH_UNDERSCORES_IN_BETWEEN. Maybe this is a stylistic choice that your NFT project made on purpose! So remember to double-check those warnings during `yarn start`. And...

# Test your hero variants

When you're ready to test your hero variants, start your development server, load your site, and then manually add `?hero=0` to the end of the URL in your browser. This will add a banner to the site showing what settings you're testing (`saleClosed` and `signedOut`), and allow you to quickly click through all twelve variants.

Note that this hidden testing feature is included in your deployed site as well. This makes it easier to collaborate with your larger team of copywriters and translators. You can send these non-technical teammates URLs to your deployed site like `example.com/zh?hero=0` and have them click through and check that everything looks good, without them needing to run the site on their own computers.