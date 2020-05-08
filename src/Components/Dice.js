import React from 'react';

import './Dice.css';
import '../Shared/Colors.css';

const Dots = ({ value }) => <svg
  xmlns="http://www.w3.org/2000/svg"
  width="100%" height="100%" viewBox="0 0 100 100"
  className="dice-dots">
  {(value % 2 === 1) && <circle cx="50" cy="50" r="10" fill="currentColor" />}
  {(value >= 2) && <>
    <circle cx="27" cy="27" r="10" fill="currentColor" />
    <circle cx="73" cy="73" r="10" fill="currentColor" />
  </>}
  {(value >= 4) && <>
    <circle cx="73" cy="27" r="10" fill="currentColor" />
    <circle cx="27" cy="73" r="10" fill="currentColor" />
  </>}
  {(value === 6) && <>
    <circle cx="73" cy="50" r="10" fill="currentColor" />
    <circle cx="27" cy="50" r="10" fill="currentColor" />
  </>}
</svg>;

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
