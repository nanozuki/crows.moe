import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import {
  Switch,
  Route,
} from 'react-router-dom';
import { Helmet } from 'react-helmet';

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

function App() {
  return (
    <>
      <GlobalStyle />
      <Helmet>
        <title>crows.moe</title>
        <meta property="og:title" content="crows.mow" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content="Nanozuki's personal website" />
      </Helmet>
      <PageWrapper>
        <OutterWrapper>
          <AppWrapper>
            <Nav />
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
