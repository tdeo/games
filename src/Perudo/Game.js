import React from 'react';

import {
  Row,
  Col,
} from 'react-bootstrap';

import Events from './Events';
import Me from './Me';

const Game = ({ players, events, previousBet, me }) => {
  return <Row>
    <Col xs={12} sm={6} md={4}>
      <Events events={events} />
    </Col>

    <Col xs={12} sm={6} md={8}>
      <Me {...me} />
    </Col>
  </Row>;
}

export default Game;
