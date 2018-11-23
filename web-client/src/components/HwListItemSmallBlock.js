import React from 'react';
import Typography from '@material-ui/core/Typography';

export const HwListItemSmallBlock = (props) => {
  const { children, align, textColor } = props;
  const className = `hw-list-item-small-block-align-${align}`;
  return (
    <div className={className}>
      {children.map((item, idx) => (
        <Typography key={idx} component="div" color={textColor}>{item}</Typography>
      ))}
    </div>
  );
};
