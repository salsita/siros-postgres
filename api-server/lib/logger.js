const winston = require('winston');

// create logger instance
const create = (config) => {
  const logger = winston.createLogger({
    level: config.logLevel,
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      winston.format.printf((info) => `${info.timestamp} (${info.level}): ${info.message}`),
    ),
  });
  return logger;
};

// koa middleware to log request / response exchange at top level
const logReqResp = async (logger, ctx, next) => {
  const start = Date.now();
  logger.info(`--> ${ctx.method} ${ctx.url}`);
  logger.debug(`*** request headers: ${JSON.stringify(ctx.request.header, null, 2)}`);
  await next();
  if (ctx.body) {
    const data = ctx.response.header['content-encoding'] === 'gzip'
      ? '< ... gzip ... >'
      : JSON.stringify(ctx.body, null, 2);
    logger.debug(`*** response body: ${data}`);
  }
  logger.debug(`*** response headers: ${JSON.stringify(ctx.response.header, null, 2)}`);
  logger.info(`<-- ${ctx.status} in ${Date.now() - start}ms`);
};

module.exports = {
  create,
  logReqResp,
};
