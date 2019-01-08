import React from 'react';
import { render } from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import { Provider as StoreProvider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { RouterProvider } from 'react-router5';
import { router5Middleware } from 'redux-router5';

import { router } from './router/router';
import { reducer } from './reducers/reducer';
import { saga } from './sagas/saga';
import { App } from './components/App';
// import registerServiceWorker from './registerServiceWorker';

const middlewares = [];
if (process.env.NODE_ENV !== 'production') {
  const { logger } = require('redux-logger'); // eslint-disable-line global-require
  middlewares.push(logger);
}
const sagaMiddleware = createSagaMiddleware();
middlewares.push(sagaMiddleware);
middlewares.push(router5Middleware(router));
const store = createStore(reducer, applyMiddleware(...middlewares));
sagaMiddleware.run(saga);

router.start(() => {
  render(
    <StoreProvider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </StoreProvider>,
    document.getElementById('root'),
  );
  // registerServiceWorker();
});
