import React from 'react';

import './Dice.css';

const Dice = ({ color, value }) => {
  return (
    <div className="dice" style={{ backgroundColor: color }}>
      {value}
    </div>
  );
}

Dice.defaultProps = {
  color: 'red'
}

export default Dice;
