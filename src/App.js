import React, { useState } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import { Article } from 'components/Article';
import { ArticleList } from 'components/ArticleList';
import { Nav } from 'components/Nav';

import {
  useColor, colorTrans, Token, lightMode, darkMode,
} from 'styles/colors';

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
  }
`;

function useColorMode() {
  const [isDark, setIsDark] = useState(localStorage.getItem('color-scheme') === 'dark');
  const toggleColor = () => { setIsDark(!isDark); localStorage.setItem('color-scheme', (isDark ? 'light' : 'dark')); };
  return [isDark, toggleColor];
}

function App() {
  const [isDark, toggleColor] = useColorMode();
  return (
    <ThemeProvider theme={isDark ? darkMode : lightMode}>
      <GlobalStyle />
      <Router>
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
      </Router>
    </ThemeProvider>
  );
}

export { App };
