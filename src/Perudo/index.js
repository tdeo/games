import React from 'react';

import {
  Row,
  Col,
} from 'react-bootstrap';

import { GameLayout } from '../Shared/Game';

import LastTurn from './LastTurn';
import Me from './Me';

const Perudo = ({ results, players, events, messages, previousTurn, me }) => {
  const totalDices = players.reduce((acc, p) => acc + p.diceCount, 0);
  return <GameLayout
    messages={messages} events={events} me={me}
    players={players}>
    {results
      ? <>
        La partie est finie, <b>{results[0].name}</b> a gagné.
      </>
      : <>
        <Me {...me} />
        <Row className="mb-3">
          <Col xs={12} className="mb-3">
            <b>Il reste {totalDices} dés</b>
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
      </>}
  </GameLayout>;
};

export const Component = Perudo;
export const wsNamespace = 'perudo';
export const title = 'Perudo';
