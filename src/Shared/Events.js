import React from 'react';

import {
  Card,
  ListGroup,
} from 'react-bootstrap'

import './Events.css';

const Events = ({ formatter, events }) => {
  const bodyRef = React.createRef();

  React.useEffect(() => {
    bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [events.length]);

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
          {formatter(e)}
        </ListGroup.Item>)}
      </ListGroup>
    </Card.Body>
  </Card>;
}

export default Events;
