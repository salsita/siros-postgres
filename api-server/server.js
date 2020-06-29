const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const noCache = require('koa-no-cache');
const helmet = require('koa-helmet');
const compress = require('koa-compress');
const Router = require('@koa/router');

const { config } = require('./lib/config');
const { create: createLogger } = require('./lib/logger');
const { formatError } = require('./lib/errors');
const { Stats } = require('./lib/stats');
const { Auth } = require('./lib/auth');
const { API } = require('./lib/api');
const { DbQuery } = require('./lib/db-query');

const logger = createLogger(config);
logger.info('server starting now ...');

const app = new Koa();
// traffic stats and logger
const stats = new Stats({
  ...(config.stats || {}),
  beforeCb: (ctx) => {
    logger.info(`--> ${ctx.method} ${ctx.url}`);
    logger.debug(`*** request headers: ${JSON.stringify(ctx.request.header, null, 2)}`);
  },
  afterCb: (ctx, durationMs) => {
    if (ctx.body) {
      const data = ctx.response.header['content-encoding'] === 'gzip'
        ? '< ... gzip ... >'
        : JSON.stringify(ctx.body, null, 2);
      logger.debug(`*** response body: ${data}`);
    }
    logger.debug(`*** response headers: ${JSON.stringify(ctx.response.header, null, 2)}`);
    logger.info(`<-- ${ctx.status} in ${durationMs}ms`);
  },
});
app.use(stats.update);
// error handler
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    logger.error(formatError(e));
    ctx.status = e.status || 500;
    ctx.body = {
      error: `${e.name ? `[${e.name}] ` : ''}${e.message}`,
    };
  }
});
// helmet / security
app.use(helmet());
// no-cache
app.use(noCache({ global: true }));
// gzip compression
app.use(compress());
// body parser
app.use(bodyParser());
// session
app.keys = [config.sessionKey];
app.use(session(app));
// authentication middleware; protecting /api/v1/*
Auth.install(app, config, logger);
// routes
const router = new Router();
Auth.addRoutes(router, config); // /login, /logout, /auth/google, /auth/google/callback
API.addRoutes(router, logger); // /api/v1/*
API.setDependencies({ 'get/api-stats': { stats } });
app.use(router.routes());

// global error handling
app.on('error', (err) => {
  logger.error(formatError(err));
});

// main async wrapper
const main = async () => {
  app.context.db = new DbQuery({ url: config.dbUrl, logger });
  app.listen(config.port, () => {
    logger.info(`server app and running on port ${config.port}`);
  });
};

main();
