const dotenv = require('dotenv');
const winston = require('winston');

const config = require('../lib/config');
const DbQuery = require('../lib/db-query');

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
    const updates = [];
    if (!history.length && (user.start_date >= config.budget.startDate)) {
      updates.push({
        action: 'initial',
        amount: config.budget.initial[user.part_time ? 'partTime' : 'fullTime'],
        date: user.start_date,
      });
    }
    let year = parseInt((history.length ? history[history.length - 1].date : user.start_date).split('-')[0], 10) + 1;
    const startDate = user.start_date.split('-');
    let anniversary = `${year}-${startDate[1]}-${startDate[2]}`;
    while (anniversary <= today) {
      if (anniversary >= config.budget.startDate) {
        updates.push({
          action: 'yearly',
          amount: config.budget.yearly[user.part_time ? 'partTime' : 'fullTime'],
          date: anniversary,
        });
      }
      year += 1;
      anniversary = `${year}-${startDate[1]}-${startDate[2]}`;
    }
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
