import React from 'react';

import {
  ButtonToolbar,
  Button,
  InputGroup,
  FormControl,
  Card,
} from 'react-bootstrap'

import WsContext from './WsContext';

const Connection = ({ players, name, started, uuid }) => {
  const { mainAction } = React.useContext(WsContext);
  const [playerName, setPlayerName] = React.useState('');

  return <Card className="mb-3">
    <Card.Header>
      <h3>{name}</h3>
    </Card.Header>
    <Card.Body>
      Cliquez sur votre nom si vous étiez déja connecté :
      <ButtonToolbar>
        {players.map(p => <Button key={p.idx} className="mr-2" variant="outline-secondary"
          disabled={p.connected}
          onClick={() => mainAction('selectPlayer', { ...p, gameUuid: uuid })}
          >
          {p.name}
        </Button>)}
      </ButtonToolbar>
      {!started && <>
        Ou saisissez votre nom ci-dessous :
        <InputGroup>
          <FormControl placeholder="Votre nom" value={playerName}
            onChange={e => setPlayerName(e.target.value)} />
          <InputGroup.Append>
            <Button variant="outline-secondary"
              onClick={() => mainAction('newPlayer', { name: playerName, gameUuid: uuid })}>
              C'est parti !
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </>}
    </Card.Body>
  </Card>
}

export default Connection;
