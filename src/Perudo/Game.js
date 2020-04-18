import React from 'react';

import {
  Row,
  Col,
} from 'react-bootstrap';

import Events from './Events';
import LastTurn from './LastTurn';
import Me from './Me';

const Game = ({ players, events, previousBet, me }) => {
  return <Row>
    <Col xs={12} sm={6} md={4} className="mb-3">
      <Events events={events} />
    </Col>

    <Col xs={12} sm={6} md={8}>
      <Row className="mb-3">
        <Col xs={12} className="mb-3">
          Joueurs en lice :{' '}
          {players.map(p => `${p.name} (${p.diceCount} dés)`).join(', ')}
        </Col>

        {!previousBet && me.history.length > 0 && <Col xs={12} className="mb-3">
          <Row>
            <LastTurn players={players} />
          </Row>
        </Col>}
      </Row>
      <Me {...me} />
    </Col>
  </Row>;
}

export default Game;
