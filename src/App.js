import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer } from 'react-toastify';

import {
  Container,
  Nav,
  Navbar,
} from 'react-bootstrap';

import { LinkContainer } from 'react-router-bootstrap';

import {
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import * as LasVegas from './LasVegas';
import * as Perudo from './Perudo';
import * as Yahtzee from './Yahtzee';

import Debug from './Debug';

import Game from './Shared/Game';

function App() {
  return <>
    <ToastContainer />
    <Router>
      <Navbar expand="sm" bg="dark" variant="dark">
        <LinkContainer to="/">
          <Navbar.Brand>
            <img
              src="/favicon.svg" height="30" className="mr-2"
              style={{ marginTop: -4 }}
              alt="Logo: dice with 6 dots"
            />
            Les jeux de Titi
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="responsive-navbar" />
        <Navbar.Collapse id="responsive-navbar">
          <Nav className="mr-auto">
            <LinkContainer to="/perudo">
              <Nav.Link>Perudo</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/lasvegas">
              <Nav.Link>Las Vegas</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/yahtzee">
              <Nav.Link>Yahtzee</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Container fluid className="mt-3">
        <Switch>
          <Route path="/perudo"><Game game={Perudo} /></Route>
          <Route path="/lasvegas"><Game game={LasVegas} /></Route>
          <Route path="/yahtzee"><Game game={Yahtzee} /></Route>
          <Route path="/debug"><Debug /></Route>
        </Switch>
      </Container>
    </Router>
  </>;
}

export default App;
