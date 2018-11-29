import React from 'react';
import Typography from '@material-ui/core/Typography';

export const TitledParagraph = (props) => {
  const { header, text } = props;
  return (
    <div>
      <Typography color="textSecondary">{header}</Typography>
      <Typography className="titled-paragraph-text" color="textPrimary">{text}</Typography>
    </div>
  );
};
