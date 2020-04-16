import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import { metas } from 'articles/metas';
import { bgColor, fgColor, Token } from 'styles/colors';
import { serif } from 'styles/type';

const filterFrontMatter = (text) => {
  const lines = text.split('\n');
  if ((lines.length < 2 || lines[0] !== '---')) {
    return text;
  }
  let endIndex = lines.slice(1).findIndex(line => line === '---') + 1;
  return lines.slice((endIndex + 1)).join('\n');
}

const useArticleFilename = (filename) => {
  const start = new Date();
  const [article, setArticle] = useState('');
  useEffect(() => {
    (async function fetchArticle() {
      if (article === '') {
        const { default: path } = await import(`articles/${filename}.md`);
        const response = await fetch(path);
        const text = await response.text();
        setArticle(filterFrontMatter(text));
      } else {
        const stop = new Date();
        console.log(`render article cost time: ${stop-start}ms`);
      }
    })()
  }, [article, filename, start]);
  return article;
}

const ArticleStyle = styled.article`
  margin-top: 1rem;
  padding: 1px;
`;

// TODO: same as ArticleItem/Title
const Title = styled.h1`
  font-size: 2rem;
  ${fgColor(Token.fg0Hard)}
  ${serif}
  margin: 0.5rem 0;
`;

// TODO: same as ArticleItem/TagBar
const TagBar = styled.div`
  display: flex;
  div:first-child {
    ${bgColor(Token.orange)}
    ${fgColor(Token.bg)}
  }
`;

// TODO: same as ArticleItem/TagBadge
const TagBadge = styled.div`
  ${bgColor(Token.bg2)};
  margin-right: 0.5em;
  padding: 0.25rem 0.5rem;
`;


const Article = () => {
  const { file } = useParams('file');
  const meta = metas.find(m => m.file === `${file}.md`);
  const article = useArticleFilename(file);
  return (
    <ArticleStyle>
      <TagBar>{meta.tags.map((tag) => <TagBadge key={tag}>{tag}</TagBadge>)}</TagBar>
      <Title>{meta.title}</Title>
      <ReactMarkdown source={article} />
    </ArticleStyle>
  );
};

export { Article };
