import { takeLatest, put } from 'redux-saga/effects';

import { types, actions as marketplaceActions, marketplaceNoFilterText } from '../reducers/marketplace';
import { actions as userActions } from '../reducers/user';
import { fetchJSON, getCurrentPrice } from './utils';

const { marketplaceUpdateData, marketplaceUpdateError } = marketplaceActions;
const { userLogoutRequest } = userActions;

function* fetchMarketplace() {
  return yield* fetchJSON(
    '/api/v1/market',
    marketplaceUpdateData,
    marketplaceUpdateError,
    userLogoutRequest,
    (response) => {
      const today = (new Date()).toISOString().substr(0, 10);
      const items = response.items.map((item) => ({
        ...item,
        current_price: getCurrentPrice(today, item.purchase_date, item.purchase_price, item.max_price),
      }));
      return {
        ...response,
        items,
      };
    },
  );
}

const localStorageFilterName = 'sirosActiveFilter';
const storedFilter = localStorage.getItem(localStorageFilterName) || marketplaceNoFilterText;
const storeFilter = (action) => { localStorage.setItem(localStorageFilterName, action.category); };

export function* saga() {
  yield takeLatest(types.MARKETPLACE_REQUEST, fetchMarketplace);
  yield takeLatest(types.MARKETPLACE_FILTER, storeFilter);
  // load stored marketplace filter
  yield put(marketplaceActions.marketplaceFilter(storedFilter));
}
