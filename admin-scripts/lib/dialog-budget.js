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

const printReport = (users) => {
  let nameWidth = 5;
  let amountWidth = 7;
  let len;
  let i;
  let totalPlus = 0;
  let totalMinus = 0;
  let total = 0;
  users.forEach((user) => {
    len = user.name.length;
    if (len > nameWidth) { nameWidth = len; }
    len = user.amount.toString().length;
    if (len > amountWidth) { amountWidth = len; }
    if (user.amount > 0) {
      totalPlus += user.amount;
    } else {
      totalMinus += user.amount;
    }
    total += user.amount;
  });
  let str = printf(` %-${nameWidth}s | %${amountWidth}s\n`, 'name:', 'budget:');
  process.stdout.write(str);
  str = '-';
  for (i = 0; i < nameWidth; i += 1) { str += '-'; }
  str += '-+-';
  for (i = 0; i < amountWidth; i += 1) { str += '-'; }
  str += '-\n';
  process.stdout.write(str);
  users.forEach((user) => {
    str = printf(` %-${nameWidth}s | %${amountWidth}s\n`, user.name, user.amount.toString());
    process.stdout.write(str);
  });
  process.stdout.write(`(${users.length} rows)\n\n`);
  const totalsWidth = Math.max(
    totalPlus.toString().length,
    totalMinus.toString().length,
    total.toString().length,
  );
  str = printf(` result:   | %${totalsWidth}s\n`, 'amount:');
  process.stdout.write(str);
  str = '-----------+-';
  for (i = 0; i < totalsWidth; i += 1) { str += '-'; }
  str += '-\n';
  process.stdout.write(str);
  str = printf(` plus  (+) | %${totalsWidth}s\n`, totalPlus.toString());
  process.stdout.write(str);
  str = printf(` minus (-) | %${totalsWidth}s\n`, totalMinus.toString());
  process.stdout.write(str);
  str = printf(` total (=) | %${totalsWidth}s\n`, total.toString());
  process.stdout.write(str);
  process.stdout.write('(3 rows)\n\n');
};

const questions = {
  [dialogStates.init]: {
    text: '[main] enter user id, (l)ist existing active users, show overall (r)eport, or (q)uit (<number>/L/r/q)',
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
        match: /^[r]$/i,
        code: async (context) => {
          const users = await context.dbQuery.getBudgetUsers();
          if (!users) { return dialogStates.init; }
          process.stdout.write('\nstay tuned, this will take a while ...\n');
          for (let i = 0; i < users.length; i += 1) {
            const user = users[i];
            // eslint-disable-next-line no-await-in-loop
            const history = await context.dbQuery.getBudgetItems(user.id);
            if (!history) { return dialogStates.init; }
            let amount = 0;
            history.forEach((item) => { amount += item.amount; });
            user.amount = amount;
          }
          process.stdout.write('... and done!\n\n');
          printReport(users);
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
          const history = await context.dbQuery.getBudgetItems(context.userId);
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
              item.hw = await context.dbQuery.getHwRepairDetails(item.hw_repairs_id);
              if (!item.hw) { return dialogStates.init; }
            }
            item.hw_repairs_id = undefined;
            if (item.education_id) {
              item.education = await context.dbQuery.getEduDetails(item.education_id);
              item.education.category_id = undefined;
              item.education.category = item.education.category_name;
              item.education.category_name = undefined;
              if (!item.education) { return dialogStates.init; }
            }
            item.education_id = undefined;
            process.stdout.write(`\n${JSON.stringify(item, null, 2)}`);
          }
          process.stdout.write(`\n\ncurrent budget of user with id (${context.userId}) is ${amount}\n\n`);
          return dialogStates.init;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: async (context) => {
          const history = await context.dbQuery.getBudgetItems(context.userId);
          if (!history) { return dialogStates.init; }
          let amount = 0;
          history.forEach((item) => { amount += item.amount; });
          process.stdout.write(`\ncurrent budget of user with id (${context.userId}) is ${amount}\n\n`);
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
