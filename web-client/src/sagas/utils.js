import { call, put } from 'redux-saga/effects';
import { config } from '../config';

const fetchData = async (url, responseCallback) => {
  const response = await fetch(url);
  let body = {};
  if (response.ok) {
    body = await response.json();
    body = responseCallback(body);
  }
  return {
    ok: response.ok,
    status: response.status,
    error: response.statusText,
    response: body,
  };
};

export function* fetchJSON(url, actionResponse, actionError, actionUnauthorized, responseCallback = (data) => (data)) {
  try {
    const data = yield call(fetchData, url, responseCallback);
    if (data.ok) {
      yield put(actionResponse(data.response));
    } else if (data.status === 401) {
      yield put(actionUnauthorized());
    } else {
      yield put(actionError(data.error));
    }
  } catch (e) {
    yield put(actionError(e.message));
  }
}

const { getAgedPrice } = config.hwItems;

export const getCurrentPrice = (currentDate, purchaseDate, purchasePrice, maxPrice) => {
  let price = getAgedPrice(purchasePrice, purchaseDate, currentDate);
  if (maxPrice !== null) { price = Math.min(maxPrice, price); }
  return price;
};

export const formatCurrency = (number) => {
  const str = Math.abs(number)
    .toString()
    .split('')
    .reverse()
    .map((char, idx) => (idx % 3 ? char : `${char} `))
    .reverse()
    .join('')
    .trim();
  return (number < 0 ? `\u2013${str}` : str);
};

export const formatDate = (dateStr) => (
  dateStr.replace(/-/g, '\u2013') // unicode for en-dash
);
