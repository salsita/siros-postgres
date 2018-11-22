import React from 'react';
import { connect } from 'react-redux';
import { actions as routerActions } from 'redux-router5';
import Button from '@material-ui/core/Button';

import { routes } from '../router/routes';
import './Nav.css';

const NavView = (props) => {
  const { routeName, onClick } = props;
  return (
    <nav>
      {
        routes.filter((item) => (item.inMenu)).map((item) => (
          <Button
            key={item.name}
            size="small"
            variant="outlined"
            color={(item.name === routeName) ? 'primary' : 'default'}
            onClick={() => { onClick(item.name); }}
          >{item.menuText}</Button>
        ))
      }
    </nav>
  );
};

const mapStateToProps = (state) => ({
  routeName: state.router.route.name,
});

const mapDispatchToProps = (dispatch) => ({
  onClick: (routeName) => { dispatch(routerActions.navigateTo(routeName)); },
});

export const Nav = connect(mapStateToProps, mapDispatchToProps)(NavView);
