import React from 'react';
// import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { metas } from 'articles/metas';

const ArticleItem = ({ title, file }) => {
  const endpoint = `/a/${file.split('.')[0]}`;
  return <Link key={file} to={endpoint}>{title}</Link>;
};
ArticleItem.propTypes = {
  title: PropTypes.string.isRequired,
  file: PropTypes.string.isRequired,
};

const ArticleList = () => metas.map(({ title, file }) => (
  <ArticleItem title={title} file={file} />
));

export { ArticleList };
