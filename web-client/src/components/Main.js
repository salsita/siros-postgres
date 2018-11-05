import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { names } from '../router';
import {
  Nav,
  HwList,
  HwBudget,
  Marketplace,
} from './index';

export class MainView extends PureComponent {
  render() {
    const { user, route } = this.props;
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
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  route: state.router.route,
});

export const Main = connect(mapStateToProps)(MainView);
