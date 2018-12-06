import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export const Login = (props) => {
  const { onClick } = props;
  const { reason } = props;
  const reasonMsg = (reason === 'domain') ? 'Wrong-domain account' : reason;
  return (
    <div className="right-box">
      {reason && <Typography variant="caption" color="error" className="right-box-content">{reasonMsg}!</Typography>}
      <Button onClick={onClick} variant="contained" color="primary" className="right-box-content">
        Login with Google
      </Button>
    </div>
  );
};
