import React from 'react';

import {
  Button,
  InputGroup,
  FormControl,
  Col,
  Row,
} from 'react-bootstrap'

import GameConnection from './GameConnection';

import WsContext from './WsContext';

const GameIndex = ({ games }) => {
  const { mainAction } = React.useContext(WsContext);
  const [gameName, setGameName] = React.useState('');

  return <Row>
    <Col xs={12} md={6} lg={4}>
      {games.length > 0 && <>
        <h4>Parties en cours :</h4>
        {games.map(g => <GameConnection key={g.uuid}
          {...g}
        />)}
      </>}

      <h4>Créer une nouvelle partie</h4>

      <InputGroup>
        <FormControl placeholder="Nom de la partie" value={gameName}
          onChange={e => setGameName(e.target.value)} />
        <InputGroup.Append>
          <Button variant="outline-secondary"
            onClick={() => mainAction('newGame', { name: gameName })}>
            Créer la partie
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Col>
  </Row>;
};

export default GameIndex;
