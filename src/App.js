import React, { useState } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import { Article } from 'components/Article';
import { ArticleList } from 'components/ArticleList';

import {
  fgColor, bgColor, Token, lightMode, darkMode,
} from 'styles/colors';

const AppWrapper = styled.div`
  ${fgColor(Token.fg)}
  max-width: 45rem;
  margin-left: auto;
  margin-right: auto;
`;

const GlobalStyle = createGlobalStyle`
  body {
    ${bgColor(Token.bg)}
  }
`;

const HeaderWrapper = styled.div`
  font-size: 2.5rem;
  font-family: serif;
  margin: 0.5rem 0;
`;

const Header = () => (
  <HeaderWrapper>
    <p>crows.moe</p>
  </HeaderWrapper>
);

const Home = () => (
  <div>
    <p>@Nanozuki personal website</p>
    <ArticleList />
  </div>
);

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <ThemeProvider theme={isDarkMode ? darkMode : lightMode}>
      <GlobalStyle />
      <AppWrapper>
        <Header />
        <Router>
          <Switch>
            <Route path="/" exact><Home /></Route>
            <Route path="/a/:file" exact><Article /></Route>
          </Switch>
        </Router>
        <div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} type="button">dark mode!</button>
        </div>
      </AppWrapper>
    </ThemeProvider>
  );
}

export { App };
