import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import { metas } from 'articles/metas';
import { bgColor, Token } from 'styles/colors';

const ArticleItemWrapper = styled.div`
    ${bgColor(Token.bg)};
  :hover {
    cursor: pointer;
    ${bgColor(Token.bg1)};
  }
`;


const ArticleItem = ({
  title, file, publish, tags,
}) => {
  const endpoint = `/a/${file.split('.')[0]}`;
  const history = useHistory();
  const toArticle = () => { history.push(endpoint); };
  return (
    <ArticleItemWrapper onClick={toArticle}>
      <p>{tags.join(' ')}</p>
      <h1>{title}</h1>
      <p>
        发表于
        {publish}
      </p>
    </ArticleItemWrapper>
  );
};
ArticleItem.propTypes = {
  title: PropTypes.string.isRequired,
  file: PropTypes.string.isRequired,
  publish: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const ArticleList = () => metas.map(({
  title, publish, tags, file,
}) => (
  <ArticleItem title={title} publish={publish} tags={tags} file={file} />
));

export { ArticleList };
