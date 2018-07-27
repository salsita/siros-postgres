const dotenv = require('dotenv');
const fs = require('fs');
const winston = require('winston');

const DbQuery = require('../lib/db-query');
const { readAnswer, findHandler } = require('../lib/dialog');
const { dialogStates, questions } = require('../lib/migrate-one');

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

const main = async () => {
  await dbQuery.connect();
  const hwItems = JSON.parse(fs.readFileSync('../working.json'));

  let currentState = dialogStates.init;
  const context = {
    dbQuery,
    hwItem: hwItems.shift(),
  };

  process.stdout.write(`about to migrate hw item:\n${JSON.stringify(context.hwItem, null, 2)}\n\n`);

  /* eslint-disable no-await-in-loop */
  while (currentState !== dialogStates.end) {
    const question = questions[currentState];
    const answer = await readAnswer(question.text);
    const code = findHandler(answer, question.handlers);
    if (!code) {
      process.stdout.write('\n! that is unfortunately invalid answer, please try again\n\n');
    } else {
      currentState = await code(context, answer);
    }
  }

  logger.debug('writing updated working file');
  fs.writeFileSync('../working.json', JSON.stringify(hwItems, null, 2));
  process.stdout.write(`\nawesome, now only ${hwItems.length} more items to migrate!\n\n`);
  logger.debug('script finished successfully');
  process.exit(0);
};

main();
