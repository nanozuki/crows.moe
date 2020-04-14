import React from 'react';
// import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';


const Article = () => {
  const { file } = useParams('file');
  const content = `file: ${file}`;
  const article = require(`articles/${file}.md`);
  return (
    <div>
      <p>{content}</p>
      <ReactMarkdown source={article} />
    </div>
  );
};

export { Article };
