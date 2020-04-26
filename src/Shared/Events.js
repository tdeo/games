import React from 'react';

import {
  Card,
  ListGroup,
} from 'react-bootstrap'

import './Events.css';

const defaultFormatter = ({ ts, event, ...data }) => {
  if (event === 'playerJoined') {
    return `${data.name} s'est reconnecté`;
  } else if (event === 'playerDisconnect') {
    return `${data.name} s'est déconnecté`;
  } else if (event === 'newPlayer') {
    return `${data.name} a rejoint la partie`;
  }
}

const Events = ({ formatter, events }) => {
  const bodyRef = React.createRef();

  const formatWrapper = (e) => {
    const { ts, event, ...data } = e;
    if (defaultFormatter(e)) {
      return defaultFormatter(e);
    } else if (typeof formatter === 'function') {
      if (formatter(e)) {
        return formatter(e);
      }
    } else if ('message' in e) {
      return e.message;
    } else {
      return JSON.stringify(data);
    }
  }

  React.useEffect(() => {
    bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [events.length, bodyRef]);

  return <Card>
    <Card.Header>
      Dernières actions
    </Card.Header>

    <Card.Body className="p-0" style={{
      maxHeight: 'min(60vh, 500px)',
      overflowY: 'scroll'
    }} ref={bodyRef}>
      <ListGroup variant="flush">
        {events.map((e, i) => <ListGroup.Item key={e.ts}
          className={`py-1 ${i === events.length - 1 ? 'flash' : ''}`}>
          {formatWrapper(e)}
        </ListGroup.Item>)}
      </ListGroup>
    </Card.Body>
  </Card>;
}

export default Events;
