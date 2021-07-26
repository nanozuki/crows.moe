import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { navigate } from 'gatsby';

import { getColor, Token } from '../styles/colors';
import ArticleItem from './ArticleItem';

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

const ArticleList = ({ articles }) => {
  const toArticle = (title) => () => navigate(`/a/${title}`);
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
ArticleList.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ArticleList;
