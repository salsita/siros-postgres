const apiMe = require('./api-me');
const apiHwList = require('./api-hw-list');
const apiHwBudget = require('./api-hw-budget');
const apiMarketplace = require('./api-marketplace');

const PREFIX = '/api/v1';

const install = (router, logger, array) => {
  array.forEach((def) => {
    const path = `${PREFIX}${def.path}`;
    logger.debug(`router config: registering handler HTTP method ${def.method.toUpperCase()} and endpoint ${path}`);
    router[def.method](path, def.handler);
  });
};

module.exports = {
  addRoutes: (router, logger) => {
    const inst = install.bind(null, router, logger);
    inst(apiMe);
    inst(apiHwList);
    inst(apiHwBudget);
    inst(apiMarketplace);
  },
  PREFIX,
};
