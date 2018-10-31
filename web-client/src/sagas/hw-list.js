import { takeLatest, call, put } from 'redux-saga/effects';
import { types, actions as hwListActions } from '../reducers/hw-list';
import { actions as userActions } from '../reducers/user';

// ---

const hwListApi = async () => {
  const response = await fetch('/api/v1/hw-list');
  let body;
  if (response.ok) {
    body = await response.json();
  }
  body = body || {};
  return {
    ok: response.ok,
    status: response.status,
    error: response.statusText,
    items: body.items,
  };
};

function* fetchHwList() {
  try {
    const data = yield call(hwListApi);
    if (data.ok) {
      yield put(hwListActions.hwListUpdate(data.items, null));
    } else if (data.status === 401) {
      yield put(userActions.userLogoutRequest());
    } else {
      yield put(hwListActions.hwListUpdate(null, data.error));
    }
  } catch (e) {
    yield put(hwListActions.hwListUpdate(null, e.message));
  }
}

// ---

export function* saga() {
  yield takeLatest(types.HW_LIST_REQUEST, fetchHwList);
}
