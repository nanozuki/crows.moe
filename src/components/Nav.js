import React/* , { useState } */ from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

import { fgColor, Token } from 'styles/colors';

const Navbar = styled.nav`
  padding: 2rem 0 0.5rem 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${fgColor(Token.orangeHard)};

  :hover {
    cursor: pointer;
  }
`;

const Title = styled.div`
  font-size: 2.5rem;
  font-family: serif;
  font-weight: 700;
`;

const ColorToggler = styled.div`
  font-size: 1.5rem;
`;

const Nav = ({ isDarkMode, toggleDarkMode }) => {
  const history = useHistory();
  const returnHome = () => { history.push('/'); };
  const icon = isDarkMode ? faMoon : faSun;
  return (
    <Navbar>
      <Title onClick={returnHome}>crows.moe</Title>
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
