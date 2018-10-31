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
    inMenu: true,
    menuText: 'HW List',
  },
  {
    name: names.BUDGET,
    path: `/${names.BUDGET}`,
    inMenu: true,
    menuText: 'HW Budget',
  },
  {
    name: names.MARKET,
    path: `/${names.MARKET}`,
    inMenu: true,
    menuText: 'Marketplace',
  },
];
