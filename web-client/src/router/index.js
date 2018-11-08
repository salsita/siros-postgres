import createRouter from 'router5';
import browserPlugin from 'router5/plugins/browser';
import transitionPath from 'router5-transition-path';

import { routes } from './routes';

const onRouteActivateMiddleware = (routeList) => (router, dependencies) => (toState, fromState, done) => {
  const { toActivate } = transitionPath(toState, fromState);
  toActivate.forEach((segment) => {
    const routeSegment = routeList.find((r) => (r.name === segment));
    if (routeSegment && routeSegment.onActivate) {
      dependencies.store.dispatch(routeSegment.onActivate(toState.params));
    }
  });
  done();
};

export const router = createRouter(routes, { defaultRoute: 'list' }).usePlugin(browserPlugin({ useHash: false }));
router.useMiddleware(onRouteActivateMiddleware(routes));

export { names, routes } from './routes';
