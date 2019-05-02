import { fork } from 'redux-saga/effects';

import { saga as userSaga } from './user';
import { saga as budgetSaga } from './budget';
import { saga as hwListSaga } from './hw-list';
import { saga as marketplaceSaga } from './marketplace';

export function* saga() {
  yield fork(userSaga);
  yield fork(budgetSaga);
  yield fork(hwListSaga);
  yield fork(marketplaceSaga);
}
