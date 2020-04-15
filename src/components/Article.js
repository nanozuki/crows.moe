import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

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
  }, [article, filename]);
  return article;
}

const ArticleStyle = styled.article`
  padding: 1px;
`;


const Article = () => {
  const { file } = useParams('file');
  const article = useArticleFilename(file);
  return (
    <ArticleStyle>
      <ReactMarkdown source={article} />
    </ArticleStyle>
  );
};

export { Article };
