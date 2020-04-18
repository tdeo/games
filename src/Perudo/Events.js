import React from 'react';

import {
  Card,
  ListGroup,
} from 'react-bootstrap'

const Events = ({ events }) => {
  return <Card>
    <Card.Header>
      Dernières actions
    </Card.Header>

    <ListGroup variant="flush">
      {events.slice(-10).reverse().map(e => <ListGroup.Item
        key={e.ts} className="py-1">
        {e.message}
      </ListGroup.Item>)}
    </ListGroup>
  </Card>;
}

export default Events;
