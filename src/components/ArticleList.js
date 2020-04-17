import React from 'react';
import styled from 'styled-components';
// import PropTypes from 'prop-types';
// import { useHistory } from 'react-router-dom';

import { metas } from 'articles/metas';
import { useColor, colorTrans, Token } from 'styles/colors';
import { ArticleItem } from 'components/ArticleItem';


const Wrapper = styled.div`
  padding: 2rem 0 1rem;
`;

const ItemWrapper = styled.div`
  ${colorTrans(['background-color'])}
  :hover {
    cursor: pointer;
    background: ${useColor(Token.bg1)};
  }
`;

const ArticleList = () => (
  <Wrapper>
    {metas.map((meta) => (
      <ItemWrapper key={meta.file}>
        <ArticleItem meta={meta} />
      </ItemWrapper>
    ))}
  </Wrapper>
);

export { ArticleList };
