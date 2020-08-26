import React from 'react';

import Navbar from 'react-bootstrap/Navbar';

import logoGitHub from '../../assets/logo-github.svg';

const ComponenteFooter: React.FC = () => (
  <>
    <Navbar className="footer-custom">
    <Navbar.Brand href="https://github.com/antoniocarlos/invest-calc/tree/data-mix">
      <img
        src={logoGitHub}
        width="70"
        height="70"
        className="d-inline-block align-top "
        alt="React Bootstrap logo"
      />
    </Navbar.Brand>
    </Navbar>
  </>
);

export default ComponenteFooter;
