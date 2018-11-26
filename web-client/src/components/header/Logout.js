import React from 'react';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export const Logout = (props) => {
  const { name, email, onClick } = props;
  return (
    <Grid container alignItems="center">
      <Hidden xsDown>
        <Grid item className="right-box right-margin">
          <Typography variant="h5" className="right-box-content">{name || 'not provided'}</Typography>
          <Typography variant="caption" className="right-box-content">{email}</Typography>
        </Grid>
      </Hidden>
      <Grid item>
        <Button onClick={onClick} variant="outlined" color="secondary">Logout</Button>
      </Grid>
    </Grid>
  );
};
