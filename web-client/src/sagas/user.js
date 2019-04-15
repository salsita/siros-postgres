import {
  take,
  takeLatest,
  call,
  put,
  select,
  fork,
} from 'redux-saga/effects';
import { actions as routerActions, actionTypes } from 'redux-router5';

import { names } from '../router/routes';
import { types, actions } from '../reducers/user';
import { config } from '../config';

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
      yield put(actions.userVerifySuccess(data.name, data.email));
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

function* navigateToLogin() {
  yield put(routerActions.navigateTo(names.LOGIN));
}

function* logout() {
  try {
    yield fork(navigateToLogin);
    yield call(logoutApi);
  } catch (e) {
    // pass
  }
}

// ---

const login = () => {
  const { protocol, host } = window.location;
  const redirectUrl = `${protocol}//${process.env.NODE_ENV === 'development' ? config.devRedirect : host}/auth/google`;
  window.location.href = redirectUrl;
};

// ---

const goToSalsita = () => {
  window.location.href = 'https://salsitasoft.com/';
};

// ---

const getRouteName = (state) => (state.router.route.name);

export function* saga() {
  yield takeLatest(types.USER_VERIFY_REQUEST, fetchUser);
  yield takeLatest(types.USER_LOGOUT_REQUEST, logout);
  yield takeLatest(types.USER_LOGIN_REQUEST, login);
  yield takeLatest(types.USER_GO_TO_SALSITA, goToSalsita);

  // wait for initial routing to finish, then make sure the user is logged in (if NOT on /login)
  yield take(actionTypes.TRANSITION_SUCCESS);
  const routeName = yield select(getRouteName);
  if (routeName !== names.LOGIN) { yield put(actions.userVerifyRequest()); }
}
