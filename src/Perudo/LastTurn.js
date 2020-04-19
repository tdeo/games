import React from 'react';

import {
  Col,
} from 'react-bootstrap'

import Dice from '../Components/Dice';

const LastTurn = ({ players }) => {
  return <>
    <Col xs={12}>
      Dernier tour :
    </Col>
    {players.map(p => <Col key={p.idx} style={{ minWidth: 180 }}>
      {p.name}
      <br />
      {p.history[p.history.length - 1].map((d,i) =>
        <Dice key={i} value={d} roll={false} />
      )}
    </Col>)}
  </>
}

export default LastTurn;
