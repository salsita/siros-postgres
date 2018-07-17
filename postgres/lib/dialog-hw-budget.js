const printf = require('printf');

const dialogStates = {
  init: 1,
  end: 2,
  show: 3,
};

const printUsers = (users) => {
  let idWidth = 3;
  let nameWidth = 5;
  let len;
  let i;
  users.forEach((user) => {
    len = user.id.toString().length;
    if (len > idWidth) { idWidth = len; }
    len = user.name.length;
    if (len > nameWidth) { nameWidth = len; }
  });
  let str = printf(` %-${idWidth}s | name:\n`, 'id:');
  process.stdout.write(str);
  str = '-';
  for (i = 0; i < idWidth; i += 1) { str += '-'; }
  str += '-+-';
  for (i = 0; i < nameWidth; i += 1) { str += '-'; }
  str += '-\n';
  process.stdout.write(str);
  users.forEach((user) => {
    str = printf(` %${idWidth}s | %s\n`, user.id, user.name);
    process.stdout.write(str);
  });
  process.stdout.write(`(${users.length} rows)\n\n`);
};

const questions = {
  [dialogStates.init]: {
    text: '[main] enter user id, (l)ist existing active users, or (q)uit (<number>/L/q)',
    handlers: [
      {
        match: /^[q]$/i,
        code: () => dialogStates.end,
      },
      {
        match: /^[l]{0,1}$/i,
        code: async (context) => {
          const users = await context.dbQuery.getBudgetUsers();
          if (users) { printUsers(users); }
          return dialogStates.init;
        },
      },
      {
        match: /^\d+$/,
        code: async (context, answer) => {
          const id = parseInt(answer, 10);
          context.userId = id;
          return dialogStates.show;
        },
      },
    ],
  },

  [dialogStates.show]: {
    text: '[budget] show full history? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          const history = await context.dbQuery.getHwBudgetItems(context.userId);
          if (!history) { return dialogStates.init; }
          let amount = 0;
          /* eslint-disable no-await-in-loop */
          for (let i = 0; i < history.length; i += 1) {
            const item = history[i];
            amount += item.amount;
            if (item.hw_owner_history_id) {
              item.hw = await context.dbQuery.getHwChangeDetails(item.hw_owner_history_id);
              if (!item.hw) { return dialogStates.init; }
            }
            item.hw_owner_history_id = undefined;
            if (item.hw_repairs_id) {
              // TODO
            }
            item.hw_repairs_id = undefined;
            process.stdout.write(`\n${JSON.stringify(item, null, 2)}`);
          }
          process.stdout.write(`\n\ncurrent hw budget of user with id (${context.userId}) is ${amount}\n\n`);
          return dialogStates.init;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: async (context) => {
          const history = await context.dbQuery.getHwBudgetItems(context.userId);
          if (!history) { return dialogStates.init; }
          let amount = 0;
          history.forEach((item) => { amount += item.amount; });
          process.stdout.write(`\ncurrent hw budget of user with id (${context.userId}) is ${amount}\n\n`);
          return dialogStates.init;
        },
      },
    ],
  },
};

module.exports = {
  dialogStates,
  questions,
};
