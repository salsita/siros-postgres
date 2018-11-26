import React from 'react';
import Typography from '@material-ui/core/Typography';

export const HwListItemPara = (props) => {
  const { header, text } = props;
  return (
    <div>
      <Typography color="textSecondary">{header}</Typography>
      <Typography className="hw-list-item-para" color="textPrimary">{text}</Typography>
    </div>
  );
};
