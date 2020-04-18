import React from 'react';

import {
  ButtonToolbar,
  Button,
  InputGroup,
  FormControl,
  Row,
  Col,
} from 'react-bootstrap'

const Connection = ({ action, players }) => {
  const [name, setName] = React.useState('');

  return <Row>
    <Col xs={12} md={6} lg={4}>
      Cliquez sur votre nom si vous étiez déja connecté :
      <ButtonToolbar>
        {players.map(p => <Button key={p.idx} className="mr-2" variant="outline-secondary"
          disabled={p.connected}
          onClick={() => action('selectPlayer', p)}
          >
          {p.name}
        </Button>)}
      </ButtonToolbar>

      Ou saisissez votre nom ci-dessous :
      <InputGroup>
        <FormControl placeholder="Votre nom" value={name}
          onChange={e => setName(e.target.value)} />
        <InputGroup.Append>
          <Button variant="outline-secondary"
            onClick={() => action('newPlayer', { name })}>
            C'est parti !
          </Button>
        </InputGroup.Append>
      </InputGroup>
      <br />
      <Button variant="outline-secondary"
        onClick={() => action('resetGame')}>
        Recommencer une partie
      </Button>
    </Col>
  </Row>
}

export default Connection;
