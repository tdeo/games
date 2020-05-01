import React from 'react';

import {
  Row,
  Col,
} from 'react-bootstrap';

import { GameLayout } from '../Shared/Game';

import LastTurn from './LastTurn';
import Me from './Me';

const Perudo = ({ formatter, players, events, messages, previousTurn, me }) => {
  return <GameLayout
    messages={messages} events={events} me={me}
    players={players}>
    <Me {...me} />
    <Row className="mb-3">
      <Col xs={12} className="mb-3">
        <b>{players.reduce((acc, p) => acc + p.diceCount, 0)} dés restans</b>
      </Col>

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
  </GameLayout>;
};

export const Component = Perudo;
export const wsNamespace = 'perudo';
export const title = 'Perudo';
