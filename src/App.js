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
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import * as Perudo from './Perudo';
import Game from './Shared/Game';

function App() {
  return <>
    <ToastContainer />
    <Router>
      <Navbar expand="sm" bg="dark" variant="dark">
        <LinkContainer to="/">
          <Navbar.Brand>
            <img src="/favicon.svg" height="30" className="mr-2"
            style={{ marginTop: -4 }} />
            Les jeux de Titi
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="responsive-navbar" />
        <Navbar.Collapse id="responsive-navbar">
          <Nav className="mr-auto">
            <LinkContainer to="/perudo">
              <Nav.Link>Perudo</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Container fluid className="mt-3">
        <Switch>
          <Route path="/perudo">
            <Game game={Perudo} />
          </Route>
        </Switch>
      </Container>
    </Router>
  </>;
}

export default App;
