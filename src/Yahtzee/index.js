import React from 'react';

import {
  Row,
  Col,
} from 'react-bootstrap';

import Events from '../Shared/Events';
import Chat from '../Shared/Chat';

import Roll from './Roll';
import ScoreTable from './ScoreTable';

const Yahtzee = ({ results, players, events, messages, me, currentPlayer, currentRoll }) => {
  return <Row>
    <Col xs={12} md={4} lg={3} className="mb-3">
      <Row className="mb-3">
        <Col>
          <Chat messages={messages} me={me} players={players} />
        </Col>
      </Row>
      <Events events={events} />
    </Col>

    <Col xs={12} md={4} lg={4} className="mb-3">
      {results
        ? <>
          La partie est finie, classement final :
          <ul>
            {results.map((r, i) => <li key={i}>
              {r.name} avec <b>{r.total}</b> points.
            </li>)}
          </ul>
        </>
        : <Roll me={me} currentRoll={currentRoll} currentPlayer={currentPlayer} />}
    </Col>

    <Col xs={12} md={4} lg={5}>
      <ScoreTable players={players} me={me} />
    </Col>
  </Row>;
};

export const Component = Yahtzee;
export const wsNamespace = 'yahtzee';
export const title = 'Yahtzee';
