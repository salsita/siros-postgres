import { takeLatest } from 'redux-saga/effects';

import { types, actions as hwListActions } from '../reducers/hw-list';
import { actions as userActions } from '../reducers/user';
import { fetchJSON, getCurrentPrice } from './utils';

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
        current_price: getCurrentPrice(today, item.purchase_date, item.purchase_price, item.max_price),
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
