import React from 'react';
import Typography from '@material-ui/core/Typography';

export const HwListItemBlock = (props) => {
  const { children, side, textColor } = props;
  const className = `hw-list-item-block-${side}`;
  return (
    <div className={className}>
      {children.map((item, idx) => (
        <Typography key={idx} component="div" color={textColor}>{item}</Typography>
      ))}
    </div>
  );
};
