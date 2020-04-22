import React from 'react';

import {
  Card,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
} from 'react-bootstrap'

import WsContext from './WsContext';

import './Chat.css';

const Icon = ({ name }) => {
  return <div className="icon">{name[0]}</div>;
}

const Chat = ({ messages, name }) => {
  const bodyRef = React.createRef();
  const { gameAction } = React.useContext(WsContext);
  const [message, setMessage] = React.useState('');

  const sendMessage = () => {
    if (message === '') {
      return;
    }
    setMessage('');
    gameAction('sendMessage', { message });
  }

  const onKeyUp = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  }

  React.useEffect(() => {
    bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages.length, bodyRef]);

  return <Card>
    <Card.Header>
      Chat
    </Card.Header>

    <Card.Body className="py-0" style={{
      maxHeight: 'min(60vh, 500px)',
      overflowY: 'scroll'
    }} ref={bodyRef}>
      {messages.map((m, i) => <Row key={i}
        className="py-1 flash">
        <Col className="flex-grow-0 px-1">
          {name !== m.name && <Icon name={m.name} />}
        </Col>
        <Col className={`px-1 ${name === m.name ? 'text-right' : ''}`}>
          <div className={`message ${(name === m.name ? 'mine' : '')}`}>
            {m.message}
          </div>
        </Col>
        <Col className="flex-grow-0 px-1">
          {name === m.name && <Icon name={m.name} />}
        </Col>
      </Row>)}
    </Card.Body>
    <Card.Footer>
      <InputGroup>
        <FormControl type="text" value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyUp={onKeyUp} />
        <InputGroup.Append>
          <Button onClick={sendMessage}>Envoyer</Button>
        </InputGroup.Append>
      </InputGroup>
    </Card.Footer>
  </Card>;
}
Chat.defaultProps = {
  messages: [],
}

export default Chat;
