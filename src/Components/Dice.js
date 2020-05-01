import React from 'react';

import './Dice.css';

const Dots = ({ value }) => <img
  src={`/images/dots/${value}.svg`}
  alt={`Dice side ${value}`}
  className="dice-dots"
/>;

const Dice = ({ color, value, roll, size, locked, disabled, dotted, className, ...props }) => {
  const classes = ['dice'];
  if (className) { classes.push(className); }
  if (size) { classes.push(`dice-${size}`); }
  if (color) { classes.push(`dice-${color}`); }
  if (roll) { classes.push('dice-roll'); }
  if (locked) { classes.push('dice-locked'); }
  if (disabled) { classes.push('dice-disabled'); }
  if (props.onClick) { classes.push('dice-click'); }

  return (
    <div className={classes.join(' ')} {...props}>
      {dotted
        ? <Dots value={value} />
        : value}
    </div>
  );
};

Dice.defaultProps = {
  color: 'red',
  roll: false,
  dotted: true,
};

export default Dice;
