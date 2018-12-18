const apiMe = require('./api-me');
const apiHwList = require('./api-hw-list');
const apiHwBudget = require('./api-hw-budget');
const apiMarketplace = require('./api-marketplace');
const apiStats = require('./api-stats');

const PREFIX = '/api/v1';
const dependencyRouter = {};

const install = (router, logger, array) => {
  array.forEach((def) => {
    const path = `${PREFIX}${def.path}`;
    logger.debug(`router config: registering handler HTTP method ${def.method.toUpperCase()} and endpoint ${path}`);
    router[def.method](path, def.handler);
    if (def.name && def.setDependencies) { dependencyRouter[def.name] = def.setDependencies; }
  });
};

const addRoutes = (router, logger) => {
  const inst = install.bind(null, router, logger);
  inst(apiMe);
  inst(apiHwList);
  inst(apiHwBudget);
  inst(apiMarketplace);
  inst(apiStats);
};

const setDependencies = (dependencyObj) => {
  Object.keys(dependencyObj).forEach((moduleName) => {
    const fn = dependencyRouter[moduleName];
    if (fn) { fn(dependencyObj[moduleName]); }
  });
};

module.exports = {
  API: {
    addRoutes,
    setDependencies,
    PREFIX,
  },
};
