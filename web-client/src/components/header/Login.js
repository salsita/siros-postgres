import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export const Login = (props) => {
  const { onClick } = props;
  let { reason } = props;
  if (reason === 'domain') { reason = 'Wrong-domain account'; }
  return (
    <div className="right-box">
      {reason && <Typography variant="caption" color="error" className="right-box-content">{reason}!</Typography>}
      <Button onClick={onClick} variant="contained" color="primary" className="right-box-content">
        Login with Google
      </Button>
    </div>
  );
};
