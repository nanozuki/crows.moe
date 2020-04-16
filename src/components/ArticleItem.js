import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import { bgColor, fgColor, Token } from 'styles/colors';
import { serif } from 'styles/type';

const Wrapper = styled.div`
  ${bgColor(Token.bg)};
  width: 100%;
  margin: 1rem 0;
  :hover {
    cursor: pointer;
    ${bgColor(Token.bg1)};
  }
`;

const TagBar = styled.div`
  display: flex;
  div:first-child {
    ${bgColor(Token.orange)}
    ${fgColor(Token.bg)}
  }
`;

const TagBadge = styled.div`
  ${bgColor(Token.bg2)};
  margin-right: 0.5em;
  padding: 0.25rem 0.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  ${fgColor(Token.fg0Hard)}
  ${serif}
  margin: 0;
  margin-top: 0.75rem;
`;

const SubInfo = styled.p`
  font-size: 0.75rem;
  ${fgColor(Token.fg2)}
  margin: 0;
`;

const ArticleItem = ({
  title, file, publish, tags,
}) => {
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
  title: PropTypes.string.isRequired,
  file: PropTypes.string.isRequired,
  publish: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export { ArticleItem };
