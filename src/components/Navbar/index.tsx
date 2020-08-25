import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import './styles.css';

const ComponenteNavbar: React.FC = () => (
  <>
    <Navbar>
      <Navbar.Brand href="#home">Invest Calc</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="#home">Home</Nav.Link>
        <Nav.Link href="#aboultus">About us</Nav.Link>
      </Nav>
    </Navbar>
  </>
);

export default ComponenteNavbar;
