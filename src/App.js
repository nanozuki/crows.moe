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
  fgColor, bgColor, Token, lightMode, darkMode,
} from 'styles/colors';

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100%;
  ${bgColor(Token.bg)}
`;

const OutterWrapper = styled.div`
  max-width: 42rem;
  margin: 0 auto;
`;

const AppWrapper = styled.div`
  ${fgColor(Token.fg)}
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

const Home = () => (
  <ArticleList />
);

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  return (
    <ThemeProvider theme={isDarkMode ? darkMode : lightMode}>
      <GlobalStyle />
      <Router>
        <PageWrapper>
          <OutterWrapper>
            <AppWrapper>
              <Nav isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              <Switch>
                <Route path="/" exact><Home /></Route>
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
