import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { actions } from '../reducers/user';

import './Powered.css';

const Link = ({ onClick, children }) => (
  <span className="powered-link" onClick={onClick}>
    {children}
  </span>
);

const PoweredView = ({ goToSalsita }) => (
  <article>
    <div className="powered-box">
      <Typography>
        <span className="powered-bigger">
          Developed by <Link onClick={goToSalsita}>Salsita</Link>.
        </span>
      </Typography>
    </div>
  </article>
);

const mapDispatchToProps = ({
  goToSalsita: actions.userGoToSalsita,
});

export const Powered = connect(null, mapDispatchToProps)(PoweredView);
