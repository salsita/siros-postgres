import { takeLatest, call, put } from 'redux-saga/effects';
import { types, actions as hwBudgetActions } from '../reducers/hw-budget';
import { actions as userActions } from '../reducers/user';

// ---

const hwBudgetApi = async () => {
  const response = await fetch('/api/v1/hw-budget');
  let body;
  if (response.ok) {
    body = await response.json();
  }
  body = body || {};
  return {
    ok: response.ok,
    status: response.status,
    error: response.statusText,
    response: body.items,
  };
};

function* fetchHwBudget() {
  try {
    const data = yield call(hwBudgetApi);
    if (data.ok) {
      yield put(hwBudgetActions.hwBudgetUpdate(data.response, null));
    } else if (data.status === 401) {
      yield put(userActions.userLogoutRequest());
    } else {
      yield put(hwBudgetActions.hwBudgetUpdate(null, data.error));
    }
  } catch (e) {
    yield put(hwBudgetActions.hwBudgetUpdate(null, e.message));
  }
}

// ---

export function* saga() {
  yield takeLatest(types.HW_BUDGET_REQUEST, fetchHwBudget);
}
