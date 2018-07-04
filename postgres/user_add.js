const dotenv = require('dotenv');
const winston = require('winston');

const DbQuery = require('./db-query');

dotenv.config();

const config = {
  dbUrl: process.env.DATABASE_URL,
  logLevel: process.env.LOG_LEVEL || 'info',
};

const logger = winston.createLogger({
  level: config.logLevel,
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.printf((info) => `${info.timestamp} (${info.level}): ${info.message}`),
  ),
});

const dbQuery = new DbQuery({ url: config.dbUrl, logger });

async function main() {
  await dbQuery.connect();

  logger.info('script finished successfully');
  process.exit(0);
}

main();
