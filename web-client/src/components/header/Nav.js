import React from 'react';
import { connect } from 'react-redux';
import { actions as routerActions } from 'redux-router5';
import Button from '@material-ui/core/Button';

import { names, routes } from '../../router/routes';
import './Nav.css';

const NavView = (props) => {
  const { routeName, user, navigateTo } = props;
  if (routeName === names.LOGIN) { return null; }
  if (!user.name && !user.email) { return null; }
  return (
    <nav>
      {
        routes.filter((item) => (item.inMenu)).map((item) => (
          <Button
            key={item.name}
            size="small"
            variant="outlined"
            color={(item.name === routeName) ? 'primary' : 'default'}
            onClick={() => { navigateTo(item.name); }}
          >{item.menuText}</Button>
        ))
      }
    </nav>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  routeName: state.router.route.name,
});

const mapDispatchToProps = {
  navigateTo: routerActions.navigateTo,
};

export const Nav = connect(mapStateToProps, mapDispatchToProps)(NavView);
