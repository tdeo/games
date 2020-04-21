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

  const onKeyUp = (e) => {
    if (e.keyCode === 'Enter') {
      submit();
    }
  }

  const submit = () => {
    mainAction('newGame', { name: gameName });
    setGameName('');
  }

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
          onChange={e => setGameName(e.target.value)}
          onKeyUp={onKeyUp} />
        <InputGroup.Append>
          <Button variant="outline-secondary"
            onClick={submit}>
            Créer la partie
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Col>
  </Row>;
};

export default GameIndex;
