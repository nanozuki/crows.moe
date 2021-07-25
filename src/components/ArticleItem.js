import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

import { getColor, colorTrans, Token } from '../styles/colors';
import { serif } from '../styles/type';

const Wrapper = styled.div`
  width: 100%;
  margin: 1rem 0;
`;

const TagBar = styled.div`
  display: flex;
`;

const TagBadge = styled.div`
  ${colorTrans(['background-color', 'color'])};
  color: ${getColor(Token.fg)};
  background-color: ${getColor(Token.bg2)};
  &:first-of-type {
    background-color: ${getColor(Token.orange)};
    color: ${getColor(Token.bg)};
  }
  margin-right: 0.5em;
  padding: 0.25rem 0.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${getColor(Token.fg0Hard)};
  ${serif}
  margin: 0.5rem 0 0.25rem 0;
`;

const SubInfo = styled.p`
  color: ${getColor(Token.fg2)};
  ${colorTrans(['color'])};
  font-size: 0.75rem;
  margin: 0;
`;

const ArticleItem = ({ article }) => {
  const { title, publish_date: publishDate, tags } = article;
  return (
    <Wrapper>
      <TagBar>{tags.map((tag) => <TagBadge key={tag.name}>{tag.name}</TagBadge>)}</TagBar>
      <Title>{title}</Title>
      <SubInfo>{`发表于${publishDate}`}</SubInfo>
    </Wrapper>
  );
};
ArticleItem.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    publish_date: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
};

export default ArticleItem;
