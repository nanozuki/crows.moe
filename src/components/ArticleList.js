import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { metas } from 'articles/metas';
import { useColor, colorTrans, Token } from 'styles/colors';
import { ArticleItem } from 'components/ArticleItem';


const Wrapper = styled.div`
  padding: 1rem 0;
`;

const ItemWrapper = styled.div`
  ${colorTrans(['background-color'])}
  :hover {
    cursor: pointer;
    background-color: ${useColor(Token.bg1)};
  }
`;

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
