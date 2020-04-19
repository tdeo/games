import React from 'react';

import './Dice.css';

const Dice = ({ color, value, roll }) => {
  return (
    <div className={`dice ${roll ? 'dice-roll' : ''}`}
      style={{ backgroundColor: color }}>
      {value}
    </div>
  );
}

Dice.defaultProps = {
  color: 'red',
  roll: false,
}

export default Dice;
