import { fork } from 'redux-saga/effects';

import { saga as userSaga } from './user';
import { saga as hwListSaga } from './hw-list';
import { saga as hwBudgetSaga } from './hw-budget';
import { saga as marketplaceSaga } from './marketplace';

export function* saga() {
  yield fork(userSaga);
  yield fork(hwListSaga);
  yield fork(hwBudgetSaga);
  yield fork(marketplaceSaga);
}
