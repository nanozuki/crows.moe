import React from 'react';
import styled from 'styled-components';
// import PropTypes from 'prop-types';
// import { useHistory } from 'react-router-dom';

import { metas } from 'articles/metas';
import { bgColor, Token } from 'styles/colors';
import { ArticleItem } from 'components/ArticleItem';


const Wrapper = styled.div`
  padding: 2rem 0 1rem;
`;

const ItemWrapper = styled.div`
  :hover {
    cursor: pointer;
    ${bgColor(Token.bg1)}
  }
`;

const ArticleList = () => (
  <Wrapper>
    {metas.map(({
      title, publish, tags, file,
    }) => (
      <ItemWrapper>
        <ArticleItem key={file} title={title} publish={publish} tags={tags} file={file} />
      </ItemWrapper>
    ))}
  </Wrapper>
);

export { ArticleList };
