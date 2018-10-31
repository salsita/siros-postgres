import React from 'react';
import { render } from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { RouteProvider } from 'react-router5';
import { router5Middleware } from 'redux-router5';

import { router } from './router';
import { reducer } from './reducers';
import { saga } from './sagas';
import { App } from './components';
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

router.start();
sagaMiddleware.run(saga);

render(
  <Provider store={store}>
    <RouteProvider router={router}>
      <App />
    </RouteProvider>
  </Provider>,
  document.getElementById('root'),
);

// registerServiceWorker();
