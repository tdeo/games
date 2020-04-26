import React from 'react';

import {
  Card,
  Row,
  Col
} from 'react-bootstrap'

import Dice from '../Components/Dice';

export const Board = ({ me, players, casinos }) => {
  if (!casinos) {
    return null;
  }

  const earnings = me.earnings.reduce((acc, e) => acc + e, 0);

  return <>
    <Row className="mb-3">
      <Col xs={12}>
        Mes gains: <b>{earnings}&nbsp;000&nbsp;$</b>
      </Col>

      <Col xs={12}>
        Jouers restants :
        {players.filter(p => p.diceCount > 0).map(p => <>
          {p.name}{' '}
          ({p.diceCount} dés{' '}
          <Dice value="" color={p.color} dotted={false}
            style={{ top: 8 }}/>
          )
          {' '}
        </>)}
      </Col>
    </Row>
    <Row className="row-cols-2 row-cols-md-3">
      {casinos.map(({ i, bills, dices }) => <Col className="mb-3" key={i}>
        <Card className="h-100">
          <Card.Header className="text-center">
            <h4>Casino <strong>{i}</strong></h4>
          </Card.Header>

          <Card.Body>
            {Object.keys(dices).map(playerIdx =>
              <React.Fragment key={playerIdx}>
                {Array(dices[playerIdx]).fill().map((_, j) =>
                  <Dice key={j} value={i} color={players[playerIdx].color} />)}
              </React.Fragment>
            )}
          </Card.Body>

          <Card.Footer>
            Gains possibles:
            <ul className="mb-0q">
              {bills.map((b, j) => <li key={j}>{b}&nbsp;000&nbsp;$</li>)}
            </ul>
          </Card.Footer>
        </Card>
      </Col>)}
    </Row>
  </>;
}

export default Board;
