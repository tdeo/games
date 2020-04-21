import React from 'react';

import {
  Col,
  Card,
} from 'react-bootstrap'

import Dice from '../Components/Dice';

const LastTurn = ({ players, previousTurn }) => {
  return <>
    <Col xs={12}>
      Dernier tour :<br />
      {previousTurn.accuser} a accusé {previousTurn.previousPlayer} de mentir sur {previousTurn.betCount} <Dice value={previousTurn.betValue} />, il y en avait {previousTurn.realCount}.
    </Col>
    {players.map(p => <Col key={p.idx} className="p-1"
      style={{ minWidth: 180 }}>
      <Card>
        <Card.Header className="p-1 text-center">
          {p.name}
        </Card.Header>
        <Card.Body className="p-1 text-center">
          {p.history[p.history.length - 1].map((d,i) =>
            <Dice key={i} value={d} roll={false} />
          )}
        </Card.Body>
      </Card>
    </Col>)}
  </>
}

export default LastTurn;
