import React from 'react';

import {
  Row,
  Col,
  Button,
} from 'react-bootstrap'

import Dice from '../Components/Dice';

import WsContext from '../Shared/WsContext';

const Roll = ({ currentRoll, currentPlayer, me }) => {
  const { actions } = me;
  const { gameAction } = React.useContext(WsContext);

  return <>
    {(actions.length > 0)
      ? "A toi de jouer :"
      : `C'est le tour de ${currentPlayer.name} :`}

    {(currentRoll || []).map((roll, i) =>
      <Row key={i}>
        <Col xs={12}>
          {roll.map(({ value, locked }, j) =>
            <Dice key={j} value={value} locked={locked} size="lg"
              disabled={i < currentRoll.length - 1}
              roll={!(i > 0 && currentRoll[i - 1][j].locked)}
              onClick={((i === currentRoll.length - 1) &&
                actions.includes('toggleLock'))
                  ? () => gameAction('toggleLock', { diceIdx: j })
                  : null }/>
          )}
        </Col>
      </Row>
    )}

    {actions.includes('rollDices') && <Row className="mt-2">
      <Col xs={12}>
        <Button onClick={() => gameAction('rollDices')}>
          Lancer
        </Button>
      </Col>
    </Row>}
  </>;
}

export default Roll;
