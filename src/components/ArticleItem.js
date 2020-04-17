import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import { useColor, colorTrans, Token } from 'styles/colors';
import { serif } from 'styles/type';

const Wrapper = styled.div`
  ${colorTrans(['background-color'])};
  background-color: ${useColor(Token.bg)};
  width: 100%;
  margin: 1rem 0;
  :hover {
    cursor: pointer;
    background-color: ${useColor(Token.bg1)};
  }
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
  margin: 0;
  margin-top: 0.75rem;
`;

const SubInfo = styled.p`
  color: ${useColor(Token.fg2)};
  ${colorTrans(['color'])};
  font-size: 0.75rem;
  margin: 0;
`;

const ArticleItem = ({ meta }) => {
  const {
    title, file, publish, tags,
  } = meta;
  const endpoint = `/a/${file.split('.')[0]}`;
  const history = useHistory();
  const toArticle = () => { history.push(endpoint); };
  return (
    <Wrapper onClick={toArticle}>
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
