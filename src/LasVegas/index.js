import React from 'react';

import {
  Row,
  Col,
} from 'react-bootstrap';

import CurrentTurn from './CurrentTurn';
import Board from './Board';

import { GameLayout } from '../Shared/Game';

const LasVegas = ({ formatter, players, results, events, messages, casinos, currentPlayer, me }) => {
  return <GameLayout
    messages={messages} events={events} me={me}
    players={players}>
    {results
      ? <>
        La partie est finie, classement final :
        <ul>
          {results.map((r, i) => <li key={i}>
            {r.name} avec <b>{r.total}&nbsp;000&nbsp;$</b>
          </li>)}
        </ul>
      </>
      : <>
        <Row className="mb-3">
          <Col xs={12}>
            <CurrentTurn me={me} currentPlayer={currentPlayer} />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12}>
            <Board players={players} me={me} casinos={casinos} />
          </Col>
        </Row>
      </>}
  </GameLayout>;
};

export const Component = LasVegas;
export const wsNamespace = 'lasvegas';
export const title = 'Las Vegas';
