# TenK NFT Launch Landing Page Template

Welcome to your new TenK NFT Launch Landing Page! This codebase gives you everything you need to make a simple-but-powerful landing page for your NFT project with near-zero custom code. Out-of-the-box, you get:

* Super fast page loads using a Static Site Generator called [Gatsby].
* Internationalization: offer your website in multiple languages for the global NFT market. If you need help translating your page, contact [the TenK team][TenK].
* Good SEO and social media sharing support.
* Simple customization via the handful of files in the [`config`](./config/) folder.

If you need even more customization, you can rest easy knowing that the whole site uses fully-typed TypeScript and a well-considered React architecture with few extensions or add-ons.

  [Gatsby]: https://www.gatsbyjs.com
  [TenK]: https://tenkbay.com/

# Run it

To run this site locally, you will need [NodeJS] and [Yarn] installed. Then, change into the project directory using your command line and:

* `yarn install`
* `yarn start` (New to NodeJS? This runs the "start" script listed in the "scripts" section of the [package.json](./package.json) file.)

Go ahead and do some stretching while that starts; it takes a while.

# Tweak it

Install [Virtual Studio Code][VSCode] (often called VS Code) if you don't have it already. Then open this project folder with it. This project includes a `.vscode` folder which will recommend extensions to improve your experience. Install them!

You only need to edit files in the [`config`](./config/) folder:

* `colors.scss`: This is a [Sass] file used by the site to customize your colors. If you install the recommended Sass extension for VS Code, you will see color squares next to each value.
* `settings.json`: This contains non-internationalized data for your site, including the address of your smart contract.
* `images/`: The images in this folder are referenced later by your internationalization data.
* `i18n/`: Your internationalization data! (There are 18 letters between the "i" and "n" in "internationalization".) There's a JSON file for each language you want to include. These will become routes on your site: `example.com/en`, `example.com/es`, etc. JSON is a finicky specification, throwing errors if you forget quotes or include trailing commas. VS Code will yell at you about these problems, which saves you from needing to restart your Gatsby server to notice them. And yes, when you make changes to these files, you'll need to restart your development Gatsby server to see them. For more info about the shape of these files, see the readme [in the `i18n` folder](./config/i18n/).

Make changes, commit them to git, and push. The included [GitHub Action] will [automatically deploy your pushed changes to GitHub Pages](./.github/workflows/deploy.yml). If you want to deploy somewhere else, you can! Static sites contain nothing but HTML, CSS, and JavaScript, making them the easiest sites to deploy. You could host these files on [IPFS], an AWS S3 bucket, or on many other hosting providers. You could automate deploys to one of these other networks/platforms by customizing the [`deploy.yml`](./.github/workflows/deploy.yml) GitHub Action. There are many GitHub Actions available to help you on [GitHub's marketplace](https://github.com/marketplace?category=deployment&type=actions).

  [NodeJS]: https://nodejs.dev/learn/how-to-install-nodejs
  [Yarn]: https://yarnpkg.com/
  [VSCode]: https://code.visualstudio.com/
  [Sass]: https://sass-lang.com/
  [IPFS]: https://ipfs.io/
  [GitHub Action]: https://github.com/features/actions

# Grok it

Start by understanding the Gatsby files:

* [`gatsby-config.js`](./gatsby-config.js) bootstraps TypeScript for Gatsby
* [`gatsby-config.ts`](./gatsby-config.ts) contains the main configuration for Gatsby, including a hefty stack of [plugins](https://www.gatsbyjs.com/plugins)
* [`gatsby-node.ts`](./gatsby-node.ts) is a NodeJS script run by Gatsby at build time (when you run `yarn build`, which happens automatically during the deploy GitHub Action) or when you first start your development server (with `yarn start`).

This last one is interesting. Reading through it, you'll see that it creates a new page for each JSON file in `config/i18n`. It grabs these files using a `locales` utility located at [`lib/locales`](./lib/locales/index.ts) (you can option-click the import line in VS Code to open the imported file directly) and renders them using a React file at [`src/templates/[locale].tsx`](./src/templates/[locale].tsx). Let's understand each of these next:

* [`lib/locales`](./lib/locales/index.ts): the main export here is down at the bottom: `export const locales`. Everything above that is TypeScript stuff and data validation. This data validation will ensure that each locale is well-formatted with only expected fields. This is great! This means that you can edit your internationalization data confidently, knowing that it will be verified at build time, way before you have a chance to deploy a broken site and have users report bugs.
* [`src/templates/[locale].tsx`](./src/templates/[locale].tsx): The filename here is not special, it's just a naming convention borrowed from NextJS, a competitor to Gatsby. (Square brackets are valid in filenames!) It is a React [JSX](https://reactjs.org/docs/introducing-jsx.html) file that uses TypeScript, hence the `.tsx` extension. As we already saw, this is the file that will be used by `gatsby-node.ts` to create each of the main routes in your page: `/en`, `/es`, etc.

The contents of this last file almost look too simple! The import statements take up about as many lines as the main export. At this point you're about ready to go explore the code directly, option-clicking into various files to figure out what they do. Before you do, it's worth knowing about just a few more interesting bits:

* [`src/near`](./src/near/) contains NEAR bootstrapping logic and a TypeScript wrapper around the TenK smart contract. This is amazing! This means you can use TypeScript-powered type-ahead to see what methods are available on your contract as you write your frontend code. If you want to test certain UI states that rely on certain data being returned from your contract, you can return spoof data in `src/near/contracts/tenk.ts` (just remember to change it back without committing it to git!)
* [`src/hooks/useTenk.ts`](./src/hooks/useTenk.ts) contains a [custom React hook](https://reactjs.org/docs/hooks-custom.html) that makes RPC calls to your TenK smart contract once at page load. All React components that use this hook then make use of this data, without requiring new RPC calls.
* [`src/hooks/useLocales.ts`](./src/hooks/useLocales.ts) is another custom hook that wraps the complex Gatsby logic needed to use your internationalization data in files outside of `[locale].tsx`. Gatsby forces all data, even simple JSON files, through a Rube Goldberg-like GraphQL pipeline ([GraphQL](https://graphql.org/) is great; Gatsby's overuse of it is tiring). Luckily, this project has automatic TypeScript typing on these GraphQL queries, improving the situation slightly. Note that the locales returned by `useLocales` differ slightly from the ones passed to `[locale].tsx`: they **do not contain `hero` or `extraSections` fields**. (This is due to a limitation of the `gatsby-transformer-json` plugin, which expects all JSON files to have exactly matching fields, while the locale format used by this project is more flexible.)
* [`src/pages/index.tsx`](./src/pages/index.tsx) is the index page of the site. You'll see that it just lists all available locales, and then uses the [`useEffect` React hook](https://reactjs.org/docs/hooks-effect.html) to automatically redirect users to their current locale, if found.