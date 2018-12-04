import React from 'react';
import { connect } from 'react-redux';

import { names } from '../router/routes';
import { HwList } from './hw-list/HwList';
import { HwBudget } from './hw-budget/HwBudget';
import { Marketplace } from './marketplace/Marketplace';
import './shared/Shared.css';

const MainView = (props) => {
  const { user, route } = props;
  if (route.name === names.LOGIN) { return null; }
  if (!user.name && !user.email) { return null; }
  return (
    <React.Fragment>
      {(route.name === names.LIST) && <HwList />}
      {(route.name === names.BUDGET) && <HwBudget />}
      {(route.name === names.MARKET) && <Marketplace />}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  route: state.router.route,
});

export const Main = connect(mapStateToProps)(MainView);
