import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { metas } from 'articles/metas';
import { useColor, Token } from 'styles/colors';
import { ArticleItem } from 'components/ArticleItem';


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
    background-color: ${useColor(Token.orange)}10;
    border-color: ${useColor(Token.orange)};
  }
`;

//   transition: border-left 0.1s;

const ArticleList = () => {
  const history = useHistory();
  const toArticle = (file) => () => { history.push(`/a/${file.split('.')[0]}`); };
  return (
    <Wrapper>
      {metas.map((meta) => (
        <ItemWrapper key={meta.file} onClick={toArticle(meta.file)}>
          <ArticleItem meta={meta} />
        </ItemWrapper>
      ))}
    </Wrapper>
  );
};

export { ArticleList };
