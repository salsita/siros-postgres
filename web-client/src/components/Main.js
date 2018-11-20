import React from 'react';
import { connect } from 'react-redux';

import { names } from '../router/routes';
import { Nav } from './Nav';
import { HwList } from './HwList';
import { HwBudget } from './HwBudget';
import { Marketplace } from './Marketplace';

const MainView = (props) => {
  const { user, route } = props;
  if (route.name === names.LOGIN) { return null; }
  if (!user.name && !user.email) { return null; }
  return (
    <React.Fragment>
      <Nav />
      <main>
        {(route.name === names.LIST) && <HwList />}
        {(route.name === names.BUDGET) && <HwBudget />}
        {(route.name === names.MARKET) && <Marketplace />}
      </main>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  route: state.router.route,
});

export const Main = connect(mapStateToProps)(MainView);
