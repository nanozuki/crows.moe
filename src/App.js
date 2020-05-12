import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { Article } from 'components/Article';
import { ArticleList } from 'components/ArticleList';
import { Nav } from 'components/Nav';

import {
  useColor, colorTrans, Token,
} from 'styles/colors';
import 'styles/colors.css';
import 'App.css';

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100%;
  color: ${useColor(Token.fg2)};
  background-color: ${useColor(Token.bg)};
  ${colorTrans(['color', 'background-color'])}
`;

const OutterWrapper = styled.div`
  max-width: 42rem;
  margin: 0 auto;
`;

const AppWrapper = styled.div`
  margin-left: 1rem;
  margin-right: 1rem;
`;

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    width: 100%;
    height: 100%;
  }
  body {
    overflow-y: scroll;
    margin: 0;
  }
`;

function useColorMode() {
  let init;
  if (typeof window !== 'undefined') {
    init = document.querySelector('html').dataset.theme === 'dark';
  }
  const [isDark, setIsDark] = useState(init);
  const toggleColor = () => {
    const next = !isDark;
    if (typeof window !== 'undefined') {
      localStorage.setItem('color-scheme', (next ? 'dark' : 'light'));
    }
    const html = document.querySelector('html');
    html.dataset.theme = next ? 'dark' : 'light';
    setIsDark(next);
  };
  return [isDark, toggleColor];
}

function App() {
  const [isDark, toggleColor] = useColorMode();
  return (
    <>
      <GlobalStyle />
      <PageWrapper>
        <OutterWrapper>
          <AppWrapper>
            <Nav isDarkMode={isDark} toggleDarkMode={toggleColor} />
            <Switch>
              <Route path="/" exact><ArticleList /></Route>
              <Route path="/a/:file" exact><Article /></Route>
            </Switch>
          </AppWrapper>
        </OutterWrapper>
      </PageWrapper>
    </>
  );
}

export { App };
