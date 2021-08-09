export async function createPages({ actions, graphql }) {
  const { createPage } = actions;
  const data = await graphql(`
    query {
      allStrapiArticle {
        nodes {
          strapiId
          title
          description
          publish_date
          tags {
            name
          }
          content
        }
      }
    }
  `);
  data.data.allStrapiArticle.nodes.forEach(node => {
    createPage({
      path: `/a/${node.title}`,
      component: require.resolve(`./src/templates/article.js`),
      context: node,
    })
  })
}
