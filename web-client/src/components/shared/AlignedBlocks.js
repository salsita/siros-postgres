import React from 'react';
import Typography from '@material-ui/core/Typography';

const ItemsBlock = (props) => {
  const { children, side, textColor } = props;
  const className = `items-block-${side}`;
  return (
    <div className={className}>
      {children.map((item, idx) => (
        <Typography key={idx} component="div" color={textColor}>{item}</Typography>
      ))}
    </div>
  );
};

export const AlignedBlocks = (props) => {
  const { left, leftColor } = props;
  const { right, rightColor } = props;
  return (
    <div className="aligned-blocks">
      <ItemsBlock side="left" textColor={leftColor || 'textSecondary'}>{left}</ItemsBlock>
      <ItemsBlock side="right" textColor={rightColor || 'textPrimary'}>{right}</ItemsBlock>
    </div>
  );
};
