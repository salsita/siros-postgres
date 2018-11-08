import { actions as hwBudgetActions } from '../reducers/hw-budget';
import { actions as hwListActions } from '../reducers/hw-list';
import { actions as marketplaceActions } from '../reducers/marketplace';

export const names = {
  LOGIN: 'login',
  LIST: 'list',
  BUDGET: 'budget',
  MARKET: 'market',
};

export const routes = [
  {
    name: names.LOGIN,
    path: `/${names.LOGIN}`,
    inMenu: false,
  },
  {
    name: names.LIST,
    path: `/${names.LIST}`,
    onActivate: (/* params */) => (hwListActions.hwListRequest()),
    inMenu: true,
    menuText: 'HW List',
  },
  {
    name: names.BUDGET,
    path: `/${names.BUDGET}`,
    onActivate: (/* params */) => (hwBudgetActions.hwBudgetRequest()),
    inMenu: true,
    menuText: 'HW Budget',
  },
  {
    name: names.MARKET,
    path: `/${names.MARKET}`,
    onActivate: (/* params */) => (marketplaceActions.marketplaceRequest()),
    inMenu: true,
    menuText: 'Marketplace',
  },
];
