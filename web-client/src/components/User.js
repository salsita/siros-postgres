import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { names } from '../router';
import { Login, Logout } from './index';
import { actions } from '../reducers/user';

class UserView extends PureComponent {
  render() {
    const { user, route, dispatch } = this.props;
    if (route.name === names.LOGIN) {
      return <Login reason={route.params.reason} onClick={() => { dispatch(actions.userLoginRequest()); }}/>;
    }
    if (user.name || user.email) {
      return <Logout name={user.name} email={user.email} onClick={() => { dispatch(actions.userLogoutRequest()); }}/>;
    }
    return null;
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  route: state.router.route,
});

export const User = connect(mapStateToProps)(UserView);
