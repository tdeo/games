import React from 'react';

import { Row, Col } from 'react-bootstrap';

import Dice from './Components/Dice';

import { Chat, WsContext } from './Shared';

const COLORS = [
  'red', 'blue', 'purple', 'green', 'black', 'orange', 'aqua',
  'fuchsia', 'gold', 'greenyellow', 'white',
];

const Debug = () => {
  const players = COLORS.map(color => ({
    color,
    name: color,
    uuid: color,
  }));
  const messages = players.map(p => ({
    message: p.color,
    uuid: p.color,
  }));
  return <>
    <Row>
      <Col xs={12} md={8}>
        {COLORS.map(c =>
          <Row key={c}>
            <Col xs={12} sm={5}>
              {[1, 2, 3, 4, 5, 6].map(i =>
                <Dice color={c} value={i} key={i} />
              )}
            </Col>
            <Col xs={12} sm={7}>
              {[1, 2, 3, 4, 5, 6].map(i =>
                <Dice size="lg" color={c} value={i} key={i} />
              )}
            </Col>
          </Row>
        )}
      </Col>
      <Col xs={12} sm={6} md={4}>
        <WsContext.Provider value={{}}>
          <Chat me={{ uuid: 'me' }} players={players} messages={messages} />
        </WsContext.Provider>
      </Col>
    </Row>
  </>;
};

export default Debug;
