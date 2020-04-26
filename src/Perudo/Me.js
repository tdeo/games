import React from 'react';

import {
  Row,
  Col,
} from 'react-bootstrap';

import Dice from '../Components/Dice';

import Actions from './Actions';

const Me = ({ diceCount, roll, actions, color }) => {
  if (diceCount <= 0) {
    return <Row>
      <Col>
        La partie est finie, tu n'as plus de dés.
      </Col>
    </Row>
  }
  return <>
    {roll && <Row>
      <Col xs={12}>
        Mon tirage :
        {roll.map((v, i) => <Dice roll key={i} value={v} color={color} />)}
      </Col>
    </Row>}
    <Row>
      <Col xs={12}>
        <Actions actions={actions} />
      </Col>
    </Row>
  </>
}

export default Me;
