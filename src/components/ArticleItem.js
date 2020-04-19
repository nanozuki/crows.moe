import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { useColor, colorTrans, Token } from 'styles/colors';
import { serif } from 'styles/type';

const Wrapper = styled.div`
  width: 100%;
  margin: 1rem 0;
`;

const TagBar = styled.div`
  display: flex;
`;

const TagBadge = styled.div`
  ${colorTrans(['background-color', 'color'])};
  color: ${useColor(Token.fg)};
  background-color: ${useColor(Token.bg2)};
  :first-child {
    background-color: ${useColor(Token.orange)};
    color: ${useColor(Token.bg)};
  }
  margin-right: 0.5em;
  padding: 0.25rem 0.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${useColor(Token.fg0Hard)};
  ${serif}
  margin: 0.5rem 0 0.25rem 0;
`;

const SubInfo = styled.p`
  color: ${useColor(Token.fg2)};
  ${colorTrans(['color'])};
  font-size: 0.75rem;
  margin: 0;
`;

const ArticleItem = ({ meta }) => {
  const { title, publish, tags } = meta;
  return (
    <Wrapper>
      <TagBar>{tags.map((tag) => <TagBadge key={tag}>{tag}</TagBadge>)}</TagBar>
      <Title>{title}</Title>
      <SubInfo>{`发表于${publish}`}</SubInfo>
    </Wrapper>
  );
};
ArticleItem.propTypes = {
  meta: PropTypes.shape({
    title: PropTypes.string.isRequired,
    file: PropTypes.string.isRequired,
    publish: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export { ArticleItem };
