import * as React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Helmet } from 'react-helmet';

import { colorTrans, getColor, Token } from '../styles/colors';
import { loadTheme, loadThemeScript } from '../styles/load';
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
  max-width: 40rem;
  margin: 0 auto;
`;

const Layout = ({ children }) => {
  loadTheme();
  // because the Helmet run after page load, the script will only run in ssr index.html.
  return (
    <>
      <Helmet>
        <script type="text/javascript">{loadThemeScript}</script>
      </Helmet>
      <PageWrapper>
        <OutterWrapper>
          <Nav />
          {children}
        </OutterWrapper>
      </PageWrapper>
    </>
  );
};
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
