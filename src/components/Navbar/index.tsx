import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import './styles.css';

const ComponenteNavbar: React.FC = () => (
  <>
    <Navbar>
      <Navbar.Brand>Invest Calc</Navbar.Brand>
      <Nav className="mr-auto">
      </Nav>
    </Navbar>
  </>
);

export default ComponenteNavbar;
