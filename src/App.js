import React from 'react';
import { hot } from 'react-hot-loader/root';
import { styled } from 'linaria/react';

const Title = styled.h1`
  font-size: 24px;
  text-align: center;
`;

const App = () => (
  <div>
    <h1>Nanozuki Web App</h1>
    <p>text...</p>
  </div>
);

export default hot(App);
