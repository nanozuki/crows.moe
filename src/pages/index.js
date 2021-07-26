import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';

import Layout from '../components/Layout';
import ArticleList from '../components/ArticleList';

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query {
      allStrapiArticle(sort: { fields: publish_date, order: DESC }) {
        nodes {
          strapiId
          title
          publish_date
          tags {
            name
          }
        }
      }
    }
  `);
  return (
    <Layout>
      <Helmet>
        <title>crows.moe</title>
        <meta property="og:title" content="crows.moe" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content="Nanozuki's personal website" />
      </Helmet>
      <ArticleList articles={data.allStrapiArticle.nodes} />
    </Layout>
  );
};

export default IndexPage;
