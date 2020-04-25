import React from 'react';

import {
  Row,
  Col,
  Button,
  ButtonToolbar,
} from 'react-bootstrap';

import Dice from '../Components/Dice';

import WsContext from '../Shared/WsContext';

const CurrentTurn = ({ me, currentPlayer }) => {
  const { gameAction } = React.useContext(WsContext);

  return <Row>
    <Col>
      {currentPlayer.roll && <>
        {currentPlayer.id === me.id
          ? 'Mon lancer :'
          : `Lancer de ${currentPlayer.name} :`}
        <br />
        {currentPlayer.roll.map((v, i) => <Dice roll
          key={i} value={v} color={currentPlayer.color} />)}
        <br />
      </>}

      {me.actions.includes('startGame') &&
        <Button onClick={() => gameAction('startGame')}>
          Démarrer la partie
        </Button>
      }

      {me.actions.includes('roll') &&
        <Button onClick={() => gameAction('roll')}>
          Lancer mes dés
        </Button>
      }

      {me.actions.includes('bet') && <>
        Miser sur :
        <ButtonToolbar>
          {[1, 2, 3, 4, 5, 6].filter(i =>
            currentPlayer.roll.includes(i)
          ).map(i => <Dice key={String(i)}
            value={i} size="lg"
            color={currentPlayer.color} className="mr-2"
            onClick={() => gameAction('bet', { value: i })} />
          )}
        </ButtonToolbar>
      </>}

      {me.actions.includes('distribute') &&
        <Button onClick={() => gameAction('distribute')}>
          Distribuer les gains
        </Button>
      }
    </Col>
  </Row>;
}

export default CurrentTurn;
