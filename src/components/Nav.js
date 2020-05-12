import React/* , { useState } */ from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

import { useColor, colorTrans, Token } from 'styles/colors';
import { serif } from 'styles/type';

const Navbar = styled.nav`
  padding: 2rem 0;
  width: 100%;
  display: flex;
  align-items: first baseline;
  justify-content: space-between;
  color: ${useColor(Token.orangeHard)};
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
  color: ${useColor(Token.fg2)};
  ${colorTrans(['color'])};
  margin: 0;
`;

const ColorToggler = styled.div`
  font-size: 1.5rem;
`;

const TwitterLink = styled.a`
  color: ${useColor(Token.blueHard)};
  ${colorTrans(['color'])};
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
  let icon = <div />;
  if (typeof isDarkMode !== 'undefined') {
    icon = <FontAwesomeIcon icon={isDarkMode ? faMoon : faSun} onClick={toggleDarkMode} />;
  }
  return (
    <Navbar>
      <Left>
        <Title onClick={returnHome}>crows.moe</Title>
        <About>
          <Twitter />
          {"'s "}
          website
        </About>
      </Left>
      <ColorToggler>
        {icon}
      </ColorToggler>
    </Navbar>
  );
};

Nav.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

export { Nav };
