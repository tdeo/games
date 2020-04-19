import React from 'react';

import {
  Row,
  Col,
} from 'react-bootstrap';

import Events from '../Shared/Events';
import LastTurn from './LastTurn';
import Me from './Me';

const eventFormatter = ({ ts, event, ...data }) => {
  if (event === 'playerJoined') {
    return `${data.name} s'est reconnecté`;
  } else if (event === 'playerDisconnect') {
    return `${data.name} s'est déconnecté`;
  } else if (event === 'newPlayer') {
    return `${data.name} a rejoint la partie`;
  } else if ('message' in data) {
    return data.message;
  } else {
    return JSON.stringify(data);
  }
}

const Perudo = ({ players, events, previousBet, me }) => {
  return <Row>
    <Col xs={12} sm={6} md={4} className="mb-3">
      <Events events={events} formatter={eventFormatter} />
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

export const Component = Perudo;
export const wsNamespace = 'perudo';
export const title = 'Perudo';
