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

module.exports = {
  create,
};
