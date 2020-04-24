import React from 'react';

import {
  Row,
  Col,
} from 'react-bootstrap';

import Events from '../Shared/Events';
import Chat from '../Shared/Chat';

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

const Perudo = ({ players, events, messages, previousTurn, me }) => {
  return <Row>
    <Col xs={12} md={6} lg={3} className="mb-3">
      <Chat messages={messages} name={me.name} />
    </Col>

    <Col xs={12} md={6} lg={3} className="mb-3">
      <Events events={events} formatter={eventFormatter} />
    </Col>

    <Col xs={12} lg={6}>
      <Me {...me} />
      <Row className="mb-3">
        <Col xs={12} className="mb-3">
          Joueurs en lice :{' '}
          {players.map(p => `${p.name} (${p.diceCount} dés)`).join(', ')}
        </Col>

        {previousTurn && <Col xs={12} className="mb-3">
          <Row>
            <LastTurn previousTurn={previousTurn} players={players} />
          </Row>
        </Col>}
      </Row>
    </Col>
  </Row>;
}

export const Component = Perudo;
export const wsNamespace = 'perudo';
export const title = 'Perudo';
