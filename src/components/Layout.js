import * as React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { getColor, colorTrans, Token } from '../styles/colors';
import Nav from './Nav';

import 'normalize.css/normalize.css';
import '../styles/colors.css';
import '../styles/index.css';

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100%;
  padding: 1rem;
  color: ${getColor(Token.fg2)};
  background-color: ${getColor(Token.bg)};
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

function loadTheme() {
  if (typeof window === 'undefined') {
    return;
  }
  function setDataThemeAttribute(theme) {
    document.querySelector('html').setAttribute('data-theme', theme);
  }

  const preferDarkQuery = '(prefers-color-scheme: dark)';
  const mql = window.matchMedia(preferDarkQuery);
  const supportsColorSchemeQuery = mql.media === preferDarkQuery;
  let localStorageTheme = null;
  localStorageTheme = localStorage.getItem('color-scheme');
  const localStorageExists = localStorageTheme !== null;

  if (localStorageExists) {
    setDataThemeAttribute(localStorageTheme);
  } else if (supportsColorSchemeQuery && mql.matches) {
    setDataThemeAttribute('dark');
  }
}

const Layout = ({ children }) => {
  loadTheme();
  return (
    <>
      <PageWrapper>
        <OutterWrapper>
          <AppWrapper>
            <Nav />
            {children}
          </AppWrapper>
        </OutterWrapper>
      </PageWrapper>
    </>
  );
};
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
