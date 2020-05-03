import React from 'react';

import { Row, Col } from 'react-bootstrap';

import Dice from './Components/Dice';

const Debug = () => {
  return <Row>
    {['red', 'blue', 'purple', 'green', 'black', 'orange', 'aqua',
      'fuchsia', 'gold', 'greenyellow', 'white',
    ].map(c =>
      <React.Fragment key={c}>
        <Col xs={12} sm={6}>
          {[1, 2, 3, 4, 5, 6].map(i =>
            <Dice color={c} value={i} key={i} />
          )}
        </Col>
        <Col xs={12} sm={6}>
          {[1, 2, 3, 4, 5, 6].map(i =>
            <Dice size="lg" color={c} value={i} key={i} />
          )}
        </Col>
      </React.Fragment>
    )}
  </Row>;
};

export default Debug;
