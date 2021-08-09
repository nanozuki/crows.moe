import React from 'react';
import styled from '@emotion/styled';
import { navigate } from 'gatsby';

import { getColor, Token } from '../styles/colors';
import ArticleItem, { Article } from './ArticleItem';

const Wrapper = styled.div`
  padding: 1rem 0;
`;

const ItemWrapper = styled.div`
  border-style: none solid;
  border-width: 0.5rem;
  border-color: transparent;
  margin: 0 -1rem;
  padding: 0 0.5rem;
  :hover {
    cursor: pointer;
    background-color: #d65d0e10;
    border-color: ${getColor(Token.orange)};
  }
`;

interface ArticleListProps {
  articles: Article[]
}

const ArticleList = ({ articles }: ArticleListProps) => {
  const toArticle = (title: string): (()=>void) => () => navigate(`/a/${title}`);
  return (
    <Wrapper>
      {articles.map((article) => (
        <ItemWrapper key={article.strapiId} onClick={toArticle(article.title)}>
          <ArticleItem article={article} />
        </ItemWrapper>
      ))}
    </Wrapper>
  );
};

export default ArticleList;
