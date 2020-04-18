import React from 'react';

import { Button } from 'react-bootstrap';

import './Dice.css';

const Dice = ({ color, value }) => {
  return (
    <Button className="dice" style={{ backgroundColor: color }}>
      {value}
    </Button>
  );
}

export default Dice;
