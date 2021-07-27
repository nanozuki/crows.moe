import React, { useState } from 'react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { navigate } from 'gatsby';

import { colorTrans, getColor, Token } from '../styles/colors';
import { serif } from '../styles/type';
import { setThemeMeta } from '../styles/load';

const Navbar = styled.nav`
  padding: 2rem 0;
  width: 100%;
  display: flex;
  align-items: first baseline;
  justify-content: space-between;
  color: ${getColor(Token.orangeHard)};
  ${colorTrans(['color'])};
`;

const Left = styled.div`
  line-height: 1;
`;

const Title = styled.p`
  font-size: 2.5rem;
  ${serif}
  font-weight: 900;
  margin: 0;
  margin-bottom: 0.25rem;
  :hover {
    cursor: pointer;
  }
`;

const About = styled.p`
  font-size: 1rem;
  color: ${getColor(Token.fg2)};
  ${colorTrans(['color'])};
  margin: 0;
`;

const ColorToggler = styled.div`
  font-size: 1.5rem;
`;

const TwitterLink = styled.a`
  color: ${getColor(Token.blueHard)};
  ${colorTrans(['color'])};
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`;

const Twitter = () => (
  <TwitterLink href="https://twitter.com/NanozukiCrows">@Nanozuki</TwitterLink>
);

function useColorMode() {
  let init;
  if (typeof window !== 'undefined') {
    init = document.querySelector('html').dataset.theme === 'dark';
  }
  const [isDark, setIsDark] = useState(init);
  const toggleColor = () => {
    const next = !isDark;
    if (typeof window !== 'undefined') {
      localStorage.setItem('color-scheme', next ? 'dark' : 'light');
    }
    const html = document.querySelector('html');
    html.dataset.theme = next ? 'dark' : 'light';
    setIsDark(next);
    setThemeMeta(next);
  };
  return [isDark, toggleColor];
}

const Nav = () => {
  const returnHome = () => navigate('/');
  const [isDark, toggleColor] = useColorMode();
  let icon = <div />;
  if (typeof isDark !== 'undefined') {
    icon = <FontAwesomeIcon icon={isDark ? faMoon : faSun} onClick={toggleColor} />;
  }
  return (
    <Navbar>
      <Left>
        <Title onClick={returnHome}>crows.moe</Title>
        <About>
          <Twitter />
          {'\'s personal website'}
        </About>
      </Left>
      <ColorToggler>{icon}</ColorToggler>
    </Navbar>
  );
};

export default Nav;
