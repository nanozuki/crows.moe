import React from 'react';
import { styled } from 'linaria/react';

const Title = styled.h1`
  font-size: 24px;
  text-align: center;
`;

const App = () => (
  <div>
    <Title>Nanozuki Web App</Title>
    <p>text...</p>
  </div>
);

export default App;
