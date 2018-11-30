import { takeLatest, put } from 'redux-saga/effects';

import { types, actions as marketplaceActions, marketplaceNullFilterValue } from '../reducers/marketplace';
import { actions as userActions } from '../reducers/user';
import { fetchJSON, getCurrentPrice, formatCurrency } from './utils';

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
      const items = response.items.map((item, idx) => ({
        ...item,
        idx,
        collapsed: true,
        purchase_price: formatCurrency(item.purchase_price),
        current_price: formatCurrency(getCurrentPrice(today, item.purchase_date, item.purchase_price, item.max_price)),
      }));
      return {
        ...response,
        items,
      };
    },
  );
}

const localStorageFilterName = 'sirosActiveFilter';
const storedFilter = (() => {
  const filterStr = localStorage.getItem(localStorageFilterName) || marketplaceNullFilterValue;
  return (filterStr === marketplaceNullFilterValue) ? null : filterStr;
})();
const storeFilter = (action) => {
  localStorage.setItem(localStorageFilterName, action.category ? action.category : marketplaceNullFilterValue);
};

export function* saga() {
  yield takeLatest(types.MARKETPLACE_REQUEST, fetchMarketplace);
  yield takeLatest(types.MARKETPLACE_FILTER, storeFilter);
  // load stored marketplace filter
  yield put(marketplaceActions.marketplaceFilter(storedFilter));
}
