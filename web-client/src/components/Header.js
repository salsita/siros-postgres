import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { User } from './User';
import { version } from '../version';
import { Nav } from './Nav';
import './Header.css';

export const Header = () => (
  <header>
    <Grid container justify="space-between" alignItems="center">
      <Grid item className="right-box">
        <Typography variant="h3" className="right-box-content">Siros</Typography>
        <Typography variant="caption" className="right-box-content">version {version}</Typography>
      </Grid>
      <Grid item>
        <User />
      </Grid>
    </Grid>
    <Nav />
  </header>
);
