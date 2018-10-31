import {
  takeLatest,
  call,
  put,
  all,
} from 'redux-saga/effects';
import { actions as routerActions } from 'redux-router5';
import { names } from '../router';
import { types, actions as userActions } from '../reducers/user';
import { actions as hwListActions } from '../reducers/hw-list';
import { actions as hwBudgetActions } from '../reducers/hw-budget';
import { actions as marketplaceActions } from '../reducers/marketplace';

// ---

const userApi = async () => {
  const response = await fetch('/api/v1/me');
  let body;
  if (response.ok) {
    body = await response.json();
  }
  body = body || {};
  return {
    ok: response.ok,
    status: response.status,
    error: response.statusText,
    name: body.name,
    email: body.email,
  };
};

function* fetchUser() {
  try {
    const data = yield call(userApi);
    if (data.ok) {
      yield put(userActions.userVerifySuccess(data.name, data.email));
    } else {
      yield put(routerActions.navigateTo(names.LOGIN, (data.status !== 401) ? { reason: data.error } : {}));
    }
  } catch (e) {
    yield put(routerActions.navigateTo(names.LOGIN, { reason: e.message }));
  }
}

// ---

const logoutApi = async () => {
  await fetch('/logout');
};

function* logout() {
  try {
    yield call(logoutApi);
  } catch (e) {
    // pass
  } finally {
    yield all([
      put(userActions.userReset()),
      put(hwListActions.hwListReset()),
      put(hwBudgetActions.hwBudgetReset()),
      put(marketplaceActions.marketplaceReset()),
      put(routerActions.navigateTo(names.LOGIN)),
    ]);
  }
}

// ---

export function* saga() {
  yield takeLatest(types.USER_VERIFY_REQUEST, fetchUser);
  yield takeLatest(types.USER_LOGOUT_REQUEST, logout);
}
