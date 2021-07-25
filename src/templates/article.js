import React from 'react';
import styled from '@emotion/styled';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet';

import { ArticleItem } from '../components/ArticleItem';
import { Layout } from '../components/Layout';
import { serif } from '../styles/type';

const Wrapper = styled.div`
  padding: 1rem 0;
`;

const ArticleStyle = styled.article`
  margin: 3rem 0 2rem 0;
  img {
    display: block;
    width: 100%;
    margin: 1rem 0;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: bold;
    ${serif};
  }

  h1, h2, h3, h4, h5, h6, p {
    margin: 1rem 0;
    line-height: 1.5;
    &:first-of-type {
      margin-top: 0;
    }
    &:last-of-type {
      margin-bottom: 0;
    }
    hyphens: auto;
  }

  h1 {
    font-size: 1.75rem;
  }
  h2 {
    font-size: 1.5rem;
  }
  h3 {
    font-size: 1.25rem;
  }
  h4, h5 {
    font-size: 1rem;
  }

  li {
    line-height: 1.5;
  }

  pre {
    max-width: 100%;
    overflow-x: auto;
  }
`;

const Article = ({ pageContext }) => {
  console.log("article.js", pageContext);
  const article = pageContext;
  const tags = article.tags.map((tag) =>
    <meta key={tag.name} property="og:article:tag" content={tag.name} />);
  return (
    <Layout>
      <Wrapper>
        <Helmet>
          <title>{`crows.moe - ${article.title}`}</title>
          <meta property="og:title" content={`crows.moe - ${article.title}`} />
          <meta property="og:type" content="article" />
          {article.description && <meta property="og:description" content={article.description} />}
          <meta property="og:article:published_time" content={article.publish_date} />
          <meta property="og:article:author" content="Nanozuki" />
          {tags}
        </Helmet>
        <ArticleItem article={article} />
        <ArticleStyle>
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </ArticleStyle>
      </Wrapper>
    </Layout>
  );
};

export default Article;
