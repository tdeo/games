import React from 'react';

import {
  Row,
  Col,
} from 'react-bootstrap';

import Events from '../Shared/Events';
import Chat from '../Shared/Chat';

import CurrentTurn from './CurrentTurn';
import Board from './Board';

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

const LasVegas = ({ players, results, events, messages, casinos, currentPlayer, me }) => {

  return <Row>
    <Col xs={12} md={6} lg={3} className="mb-3">
      <Chat messages={messages} name={me.name} />
    </Col>

    <Col xs={12} md={6} lg={3} className="mb-3">
      <Events events={events} formatter={eventFormatter} />
    </Col>

    <Col xs={12} lg={6}>
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
    </Col>
  </Row>;
}

export const Component = LasVegas;
export const wsNamespace = 'lasvegas';
export const title = 'Las Vegas';
