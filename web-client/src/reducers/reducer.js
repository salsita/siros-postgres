import { combineReducers } from 'redux';
import { router5Reducer } from 'redux-router5';

import { reducer as userReducer } from './user';
import { reducer as hwListReducer } from './hw-list';
import { reducer as hwBudgetReducer } from './hw-budget';
import { reducer as marketplaceReducer } from './marketplace';

export const reducer = combineReducers({
  router: router5Reducer,
  user: userReducer,
  list: hwListReducer,
  budget: hwBudgetReducer,
  market: marketplaceReducer,
});
