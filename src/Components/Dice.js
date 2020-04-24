import React from 'react';

import './Dice.css';

const Dice = ({ color, value, roll, size, locked, disabled, className, ...props }) => {
  const classes = ['dice'];
  if (className) { classes.push(className) }
  if (size) { classes.push(`dice-${size}`) }
  if (color) { classes.push(`dice-${color}`) }
  if (roll) { classes.push('dice-roll') }
  if (locked) { classes.push('dice-locked') }
  if (disabled) { classes.push('dice-disabled') }
  if (props.onClick) { classes.push('dice-click') }

  return (
    <div className={classes.join(' ')} {...props}>
      {value}
    </div>
  );
}

Dice.defaultProps = {
  color: 'red',
  roll: false,
}

export default Dice;
