import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer } from 'react-toastify';

import {
  Container,
  Nav,
  Navbar,
} from 'react-bootstrap';

import { LinkContainer } from 'react-router-bootstrap'

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Perudo from './Perudo';

function App() {
  return <>
    <ToastContainer />
    <Router>
      <Navbar expand="sm" bg="dark" variant="dark">
        <Navbar.Brand>Les jeux de Titi</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar" />
        <Navbar.Collapse id="responsive-navbar">
          <Nav className="mr-auto">
            <LinkContainer to="/perudo">
              <Nav.Link>Perudo</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Container className="mt-3">
        <Switch>
          <Route path="/perudo">
            <Perudo />
          </Route>
        </Switch>
      </Container>
    </Router>
  </>;
}

export default App;
