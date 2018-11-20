import { takeLatest } from 'redux-saga/effects';

import { types, actions as hwBudgetActions } from '../reducers/hw-budget';
import { actions as userActions } from '../reducers/user';
import { fetchJSON } from './utils';

const { hwBudgetUpdateData, hwBudgetUpdateError } = hwBudgetActions;
const { userLogoutRequest } = userActions;

function* fetchHwBudget() {
  return yield* fetchJSON(
    '/api/v1/hw-budget',
    hwBudgetUpdateData,
    hwBudgetUpdateError,
    userLogoutRequest,
  );
}

export function* saga() {
  yield takeLatest(types.HW_BUDGET_REQUEST, fetchHwBudget);
}
