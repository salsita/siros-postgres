import { takeLatest } from 'redux-saga/effects';

import { types, actions as hwListActions } from '../reducers/hw-list';
import { actions as userActions } from '../reducers/user';
import {
  fetchJSON,
  getCurrentPrice,
  formatCurrency,
  formatDate,
} from './utils';

const { hwListUpdateData, hwListUpdateError } = hwListActions;
const { userLogoutRequest } = userActions;

function* fetchHwList() {
  return yield* fetchJSON(
    'api/v1/hw-list',
    hwListUpdateData,
    hwListUpdateError,
    userLogoutRequest,
    (response) => {
      const today = (new Date()).toISOString().substr(0, 10);
      const items = response.items.map((item) => ({
        ...item,
        purchase_price: formatCurrency(item.purchase_price),
        purchase_date: formatDate(item.purchase_date),
        current_price: formatCurrency(getCurrentPrice(today, item.purchase_date, item.purchase_price, item.max_price)),
      }));
      return {
        ...response,
        items,
      };
    },
  );
}

export function* saga() {
  yield takeLatest(types.HW_LIST_REQUEST, fetchHwList);
}
