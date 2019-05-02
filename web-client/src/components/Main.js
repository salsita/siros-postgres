import React from 'react';
import { connect } from 'react-redux';

import { names } from '../router/routes';
import { Budget } from './budget/Budget';
import { HwList } from './hw-list/HwList';
import { Marketplace } from './marketplace/Marketplace';
import { Powered } from './Powered';
import './shared/Shared.css';

const MainView = (props) => {
  const { user, route } = props;
  if (route.name === names.LOGIN) { return <Powered />; }
  if (route.name === names.LOGIN) { return null; }
  if (!user.name && !user.email) { return null; }
  return (
    <>
      {(route.name === names.BUDGET) && <Budget />}
      {(route.name === names.LIST) && <HwList />}
      {(route.name === names.MARKET) && <Marketplace />}
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  route: state.router.route,
});

export const Main = connect(mapStateToProps)(MainView);
