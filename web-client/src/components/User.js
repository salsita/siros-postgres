import React from 'react';
import { connect } from 'react-redux';

import { names } from '../router/routes';
import { Login } from './Login';
import { Logout } from './Logout';
import { actions } from '../reducers/user';

const UserView = (props) => {
  const { user, route } = props;
  const { onLoginClick, onLogoutClick } = props;
  if (route.name === names.LOGIN) {
    return <Login reason={route.params.reason} onClick={onLoginClick}/>;
  }
  if (user.name || user.email) {
    return <Logout name={user.name} email={user.email} onClick={onLogoutClick}/>;
  }
  return null;
};

const mapStateToProps = (state) => ({
  user: state.user,
  route: state.router.route,
});

const mapDispatchToProps = (dispatch) => ({
  onLoginClick: () => { dispatch(actions.userLoginRequest()); },
  onLogoutClick: () => { dispatch(actions.userLogoutRequest()); },
});

export const User = connect(mapStateToProps, mapDispatchToProps)(UserView);
