import React from 'react';

import {
  Col,
} from 'react-bootstrap'

import Dice from '../Components/Dice';

const LastTurn = ({ players, previousTurn }) => {
  console.log(previousTurn)
  return <>
    <Col xs={12}>
      Dernier tour :<br />
      {previousTurn.accuser} a accusé {previousTurn.previousPlayer} de mentir sur {previousTurn.betCount} <Dice value={previousTurn.betValue} />, il y en avait {previousTurn.realValue}.
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
