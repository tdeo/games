import React from 'react';

import {
  Row,
  Col,
} from 'react-bootstrap';

import Events from '../Shared/Events';
import Chat from '../Shared/Chat';

import Roll from './Roll';
import ScoreTable from './ScoreTable';

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

const Yahtzee = ({ players, events, messages, me, currentPlayer, currentRoll }) => {
  return <Row>
    <Col xs={12} md={4} lg={3} className="mb-3">
      <Row className="mb-3">
        <Col>
          <Chat messages={messages} name={me.name} />
        </Col>
      </Row>
      <Events events={events} formatter={eventFormatter} />
    </Col>

    <Col xs={12} md={4} lg={4} className="mb-3">
      <Roll me={me} currentRoll={currentRoll} currentPlayer={currentPlayer} />
    </Col>

    <Col xs={12} md={4} lg={5}>
      <ScoreTable players={players} me={me} />
    </Col>
  </Row>;
}

export const Component = Yahtzee;
export const wsNamespace = 'yahtzee';
export const title = 'Yahtzee';
