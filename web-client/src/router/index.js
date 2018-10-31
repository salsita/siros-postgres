import createRouter from 'router5';
import browserPlugin from 'router5/plugins/browser';

import { routes } from './routes';

export const router = createRouter(routes, { defaultRoute: 'list' }).usePlugin(browserPlugin({ useHash: false }));
export { names, routes } from './routes';
