import React from 'react';

import {
  Card,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
} from 'react-bootstrap';

import WsContext from './WsContext';

import './Chat.css';

const Icon = ({ player }) => {
  return <div
    className="icon"
    style={{ backgroundColor: player.color, color: 'white' }}>
    {player.name[0]}
  </div>;
};

const Message = ({ message, players, me }) => {
  const player = players.find(p => p.uuid === message.uuid);

  const mine = player.uuid === me.uuid;

  return <Row className="py-1 flash">
    <Col className="flex-grow-0 px-1">
      {!mine && <Icon player={player} />}
    </Col>
    <Col className={`px-1 ${mine ? 'text-right' : ''}`}>
      <div className={`message ${mine ? 'mine' : ''}`}>
        {message.message}
      </div>
    </Col>
    <Col className="flex-grow-0 px-1">
      {mine && <Icon player={player} />}
    </Col>
  </Row>;
};

const Chat = ({ messages, players, me }) => {
  const bodyRef = React.createRef();
  const { gameAction } = React.useContext(WsContext);
  const [message, setMessage] = React.useState('');

  const sendMessage = () => {
    if (message === '') {
      return;
    }
    setMessage('');
    gameAction('sendMessage', { message });
  };

  const onKeyUp = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  React.useEffect(() => {
    bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages.length, bodyRef]);

  return <Card>
    <Card.Header>
      Chat
    </Card.Header>

    <Card.Body
      className="py-0" style={{
        maxHeight: 'min(60vh, 500px)',
        overflowY: 'scroll',
      }} ref={bodyRef}>
      {messages.map((m, i) => <Message
        key={i} message={m}
        players={players} me={me}
      />)}
    </Card.Body>
    <Card.Footer>
      <InputGroup>
        <FormControl
          type="text" value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyUp={onKeyUp}
        />
        <InputGroup.Append>
          <Button onClick={sendMessage}>Envoyer</Button>
        </InputGroup.Append>
      </InputGroup>
    </Card.Footer>
  </Card>;
};
Chat.defaultProps = {
  messages: [],
};

export default Chat;
