import { takeLatest, call, put } from 'redux-saga/effects';
import { types, actions as marketplaceActions } from '../reducers/marketplace';
import { actions as userActions } from '../reducers/user';

// ---

const marketplaceApi = async () => {
  const response = await fetch('/api/v1/market');
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

function* fetchMarketplace() {
  try {
    const data = yield call(marketplaceApi);
    if (data.ok) {
      yield put(marketplaceActions.marketplaceUpdate(data.response, null));
    } else if (data.status === 401) {
      yield put(userActions.userLogoutRequest());
    } else {
      yield put(marketplaceActions.marketplaceUpdate(null, data.error));
    }
  } catch (e) {
    yield put(marketplaceActions.marketplaceUpdate(null, e.message));
  }
}

// ---

export function* saga() {
  yield takeLatest(types.MARKETPLACE_REQUEST, fetchMarketplace);
}
