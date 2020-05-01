import React from 'react';

import {
  Row,
  Col,
  Button,
  FormControl,
} from 'react-bootstrap';

import WsContext from '../Shared/WsContext';

const Actions = ({ actions, totalDices }) => {
  const { gameAction } = React.useContext(WsContext);

  const [betValue, setBetValue] = React.useState('');
  const [betCount, setBetCount] = React.useState('');

  return <>
    {actions.includes('startGame') && <Row>
      <Col xs={12}>
        <Button onClick={() => gameAction('startGame')}>
          Démarrer la partie
        </Button>
      </Col>
    </Row>}
    {actions.includes('shake') && <Row>
      <Col xs={12}>
        <Button onClick={() => gameAction('shake')}>
          Lancer mes dés
        </Button>
      </Col>
    </Row>}
    {actions.includes('accuse') && <Row>
      <Col xs={12}>
        <Button onClick={() => gameAction('accuse')}>
          Menteur !
        </Button>
      </Col>
    </Row>}
    {actions.includes('bet') && <Row>
      <Col xs={12} md={4} className="my-2">
        <FormControl
          value={betCount}
          onChange={e => setBetCount(+e.target.value)}
          type="number"
          placeholder="Nombre de dés"
          min={1}
        />
      </Col>
      <Col xs={12} md={4} className="my-2">
        <FormControl
          value={betValue}
          onChange={e => setBetValue(+e.target.value)}
          type="number"
          placeholder="Valeur des dés"
          min={1} max={6}
        />
      </Col>
      <Col xs={12} md={4} className="my-2">
        <Button onClick={() => {
          gameAction('bet', {
            value: betValue, count: betCount,
          });
          setBetValue('');
          setBetCount('');
        }}>
          Annoncer
        </Button>
      </Col>
    </Row>}
  </>;
};

export default Actions;
