import { takeLatest } from 'redux-saga/effects';

import { types, actions as budgetActions } from '../reducers/budget';
import { actions as userActions } from '../reducers/user';
import { fetchJSON, formatCurrency, formatDate } from './utils';

const { budgetUpdateData, budgetUpdateError } = budgetActions;
const { userLogoutRequest } = userActions;

function* fetchBudget() {
  return yield* fetchJSON(
    '/api/v1/budget',
    budgetUpdateData,
    budgetUpdateError,
    userLogoutRequest,
    (response) => {
      const items = response.items.map((item) => {
        let hw;
        if (item.hw) {
          hw = {
            ...item.hw,
            purchase_price: formatCurrency(item.hw.purchase_price),
            purchase_date: formatDate(item.hw.purchase_date),
          };
        }
        return {
          ...item,
          amountStr: formatCurrency(item.amount),
          date: formatDate(item.date),
          hw,
        };
      });
      return {
        ...response,
        total: formatCurrency(response.total),
        items,
      };
    },
  );
}

export function* saga() {
  yield takeLatest(types.BUDGET_REQUEST, fetchBudget);
}
