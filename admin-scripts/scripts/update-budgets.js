const dotenv = require('dotenv');
const winston = require('winston');

const DbQuery = require('../lib/db-query');
const { getBudgetUpdates } = require('../lib/budget-updates');

dotenv.config();

const appConfig = {
  dbUrl: process.env.DATABASE_URL,
  logLevel: process.env.LOG_LEVEL || 'info',
};

const logger = winston.createLogger({
  level: appConfig.logLevel,
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.printf((info) => `${info.timestamp} (${info.level}): ${info.message}`),
  ),
});

const dbQuery = new DbQuery({ url: appConfig.dbUrl, logger });

const main = async () => {
  await dbQuery.connect();
  const today = (new Date()).toISOString().substr(0, 10);

  const users = await dbQuery.getBudgetUsers();
  if (!users) { process.exit(1); }
  /* eslint-disable no-await-in-loop */
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    logger.info(`processing user "${user.name}" with id (${user.id})`);
    const history = await dbQuery.getBudgetItems(user.id, 'initial-yearly');
    if (!history) { process.exit(1); }
    const updates = getBudgetUpdates(user, history, today);
    if (updates.length) {
      logger.info(`updates for the user:\n${JSON.stringify(updates, null, 2)}\n`);
      const result = await dbQuery.addHwBudget(user.id, updates);
      if (!result) { process.exit(1); }
    } else {
      logger.info('everything is up-to-date\n');
    }
  }

  logger.debug('script finished successfully');
  process.exit(0);
};

main();
