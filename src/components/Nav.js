import React/* , { useState } */ from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

import { fgColor, Token } from 'styles/colors';

const Navbar = styled.nav`
  padding: 1rem 0 1rem 0;
  width: 100%;
  display: flex;
  align-items: first baseline;
  justify-content: space-between;
  ${fgColor(Token.orangeHard)};

  :hover {
    cursor: pointer;
  }
`;

const Left = styled.div`
  line-height: 1;
`;

const Title = styled.p`
  font-size: 2.5rem;
  font-family: serif;
  font-weight: 700;
  margin: 0;
`;

const About = styled.p`
  font-size: 1rem;
  ${fgColor(Token.fg2)};
  margin: 0;
`;

const ColorToggler = styled.div`
  font-size: 1.5rem;
`;

const TwitterLink = styled.a`
  ${fgColor(Token.blueHard)}
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`;

const Twitter = () => (
  <TwitterLink href="https://twitter.com/NanozukiCrows">@Nanozuki</TwitterLink>
);

const Nav = ({ isDarkMode, toggleDarkMode }) => {
  const history = useHistory();
  const returnHome = () => { history.push('/'); };
  const icon = isDarkMode ? faMoon : faSun;
  return (
    <Navbar>
      <Left>
        <Title onClick={returnHome}>crows.moe</Title>
        <About>
          <Twitter />
          {' '}
          personal website
        </About>
      </Left>
      <ColorToggler>
        <FontAwesomeIcon icon={icon} onClick={toggleDarkMode} />
      </ColorToggler>
    </Navbar>
  );
};

Nav.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

export { Nav };
