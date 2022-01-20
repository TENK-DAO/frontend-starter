exports.createPages = async ({ actions, graphql }) => {
  const query = await graphql(`
    query {
      allFile {
        edges {
          node {
            name
            childI18NJson {
              hero_body
              hero_cta
              hero_title
              title
            }
          }
        }
      }
    }
  `)
  query.data && query.data.allFile.edges.forEach(
    ({ node: { name: lang, childI18NJson: i18n } }) => {
      actions.createPage({
        path: lang,
        component: require.resolve('./src/templates/landing.tsx'),
        context: { i18n, lang }
      })
    }
  )
}
