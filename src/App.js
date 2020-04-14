import React from 'react';
import styled from 'styled-components';

import {
  fgColor, bgColor, Token, setMode,
} from 'styles/colors';

const AppWrapper = styled.div`
  body {
    ${fgColor(Token.fg)}
    ${bgColor(Token.bg)}
  }
`;

const HeaderWrapper = styled.div`
  ${fgColor(Token.fg)}
  ${bgColor(Token.bg)}
`;

const Header = () => (
  <HeaderWrapper>
    <p>Title</p>
    <button onClick={() => setMode('dark')} type="button">dark mode!</button>
  </HeaderWrapper>
);

function App() {
  return (
    <AppWrapper>
      <Header />
      <p>@Nanozuki personal website</p>
    </AppWrapper>
  );
}

export { App };
