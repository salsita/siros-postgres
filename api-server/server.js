const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const noCache = require('koa-no-cache');
const helmet = require('koa-helmet');
const compress = require('koa-compress');
const Router = require('koa-router');

const config = require('./lib/config');
const { create: createLogger, logReqResp } = require('./lib/logger');
const { formatError } = require('./lib/errors');
const auth = require('./lib/auth');
const api = require('./lib/api');
const DbQuery = require('./lib/db-query');

const logger = createLogger(config);
logger.info('server starting now ...');

const app = new Koa();
// traffic logger
app.use(logReqResp.bind(null, logger));
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
auth.install(app, config, logger);
// routes
const router = new Router();
auth.addRoutes(router, config); // /login, /logout, /auth/google, /auth/google/callback
api.addRoutes(router, logger); // /api/v1/*
app.use(router.routes());

// global error handling
app.on('error', (err) => {
  logger.error(formatError(err));
});

// main async wrapper
const main = async () => {
  app.context.logger = logger;
  app.context.db = new DbQuery({ url: config.dbUrl, logger });
  app.listen(config.port, () => {
    logger.info(`server app and running on port ${config.port}`);
  });
};

main();
