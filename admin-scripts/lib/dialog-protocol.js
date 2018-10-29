const printf = require('printf');
const { generatePdf } = require('./generatePdf');

const dialogStates = {
  init: 1,
  end: 2,

  protocolDate: 3,
  protocolType: 4,
  protocolOfficeKey: 5,
  protocol: 6,
};

const actionMap = {
  hw_buy: 'handover protocol / receive',
  hw_sell: 'handover protocol / return ',
  hw_repurchase: 'invoice',
};

const questionMap = {
  hw_buy: '(h)andover / receive',
  hw_sell: 'handover / (r)eturn',
  hw_repurchase: '(i)nvoice',
};

const shortcutMap = {
  hw_buy: 'h',
  hw_sell: 'r',
  hw_repurchase: 'i',
};

const shortcutReverseMap = {
  h: 'hw_buy',
  H: 'hw_buy',
  r: 'hw_sell',
  R: 'hw_sell',
  i: 'hw_repurchase',
  I: 'hw_repurchase',
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
  let str = printf(` %-${idWidth}s | S | A | name:\n`, 'id:');
  process.stdout.write(str);
  str = '-';
  for (i = 0; i < idWidth; i += 1) { str += '-'; }
  str += '-+---+---+-';
  for (i = 0; i < nameWidth; i += 1) { str += '-'; }
  str += '-\n';
  process.stdout.write(str);
  users.forEach((user) => {
    str = printf(` %${idWidth}s | ${user.system === true ? 'x' : ' '} | ${user.active === true ? 'x' : ' '} | %s\n`, user.id, user.name);
    process.stdout.write(str);
  });
  process.stdout.write(`(${users.length} rows)\n\n`);
};

const questions = {
  [dialogStates.init]: {
    text: '[main] enter user id, (l)ist existing users, or go (q)uit (<number>/L/q)',
    handlers: [
      {
        match: /^\d+$/,
        code: async (context, answer) => {
          const userId = parseInt(answer, 10);
          const user = await context.dbQuery.getUser(userId);
          if (user === null) { return dialogStates.init; }
          if (user === 0) {
            process.stdout.write(`\nthere is no user with id ${userId}!\n\n`);
            return dialogStates.init;
          }
          const hwDates = await context.dbQuery.getHwProtocolDates(userId);
          if (!hwDates) { return dialogStates.init; }
          if (!hwDates.length) {
            process.stdout.write(`\nno hw transfers found for user (id: ${userId}), cannot create any protocols!\n\n`);
            return dialogStates.init;
          }
          const dates = {};
          hwDates.forEach((item) => {
            const el = dates[item.date] || {};
            el[item.action] = (el[item.action] ? el[item.action] + 1 : 1);
            dates[item.date] = el;
          });
          process.stdout.write(`\nthe following protocols can be generated for user (id: ${userId}):\n`);
          let defaultDate;
          let protocolCount = 0;
          const datesKeys = Object.keys(dates);
          datesKeys.forEach((datesKey) => {
            const datesObj = dates[datesKey];
            process.stdout.write(`+ ${datesKey}:\n`);
            const actions = Object.keys(datesObj);
            actions.forEach((action) => {
              process.stdout.write(`  - ${actionMap[action]} [${datesObj[action]} item(s)]\n`);
              protocolCount += 1;
            });
            defaultDate = datesKey; // last one = the most recent
          });
          process.stdout.write(`\n${protocolCount} protocol(s) available\n\n`);
          context.protocol = {
            userId,
            user,
            dates,
            defaultDate,
          };
          questions[dialogStates.protocolDate].text = `[protocol] enter date (in YYYY-MM-DD format, press enter for "${context.protocol.defaultDate}")`;
          return dialogStates.protocolDate;
        },
      },
      {
        match: /^[l]{0,1}$/i,
        code: async (context) => {
          const users = await context.dbQuery.getUsers();
          if (!users) { return dialogStates.init; }
          printUsers(users);
          return dialogStates.init;
        },
      },
      {
        match: /^[q]$/i,
        code: () => dialogStates.end,
      },
    ],
  },

  [dialogStates.protocolDate]: {
    text: '<replaced from [dialogStates.init], handler (number)>',
    handlers: [
      {
        match: /^$/,
        code: async (context) => {
          context.protocol.date = context.protocol.defaultDate;
          const item = context.protocol.dates[context.protocol.date];
          const itemKeys = Object.keys(item);
          if (itemKeys.length === 1) {
            [context.protocol.type] = itemKeys;
            context.protocol.hwList = await context.dbQuery.getHwProtocolItems(
              context.protocol.userId,
              context.protocol.date,
              context.protocol.type,
            );
            if (context.protocol.type !== 'hw_repurchase') { return dialogStates.protocolOfficeKey; }
            process.stdout.write(`\nabout to generate (${actionMap[context.protocol.type].trim()}) protocol`
            + `with the following items:\n${JSON.stringify(context.protocol.hwList, null, 2)}\n\n`);
            return dialogStates.protocol;
          }
          questions[dialogStates.protocolType].text = '[protocol] what protocol to generate? ';
          let shortcuts = '';
          itemKeys.forEach((key, idx) => {
            questions[dialogStates.protocolType].text += `${idx ? ', ' : ''}${questionMap[key]}`;
            shortcuts += shortcutMap[key];
          });
          questions[dialogStates.protocolType].text += ' (';
          shortcuts.split('').forEach((sc, idx) => {
            questions[dialogStates.protocolType].text += `${idx ? '/' : ''}${sc}`;
          });
          questions[dialogStates.protocolType].text += ')';
          questions[dialogStates.protocolType].handlers[0].match = new RegExp(`^[${shortcuts}]$`, 'i');
          return dialogStates.protocolType;
        },
      },
      {
        match: /^20\d{2}-\d{2}-\d{2}$/,
        code: async (context, answer) => {
          context.protocol.date = answer;
          const item = context.protocol.dates[context.protocol.date];
          if (!item) {
            process.stdout.write(`\nthere is no protocol available for date ${answer}!\n\n`);
            return dialogStates.protocolDate;
          }
          const itemKeys = Object.keys(item);
          if (itemKeys.length === 1) {
            [context.protocol.type] = itemKeys;
            context.protocol.hwList = await context.dbQuery.getHwProtocolItems(
              context.protocol.userId,
              context.protocol.date,
              context.protocol.type,
            );
            if (context.protocol.type !== 'hw_repurchase') { return dialogStates.protocolOfficeKey; }
            process.stdout.write(`\nabout to generate (${actionMap[context.protocol.type].trim()}) protocol`
            + `with the following items:\n${JSON.stringify(context.protocol.hwList, null, 2)}\n\n`);
            return dialogStates.protocol;
          }
          questions[dialogStates.protocolType].text = '[protocol] what protocol to generate? ';
          let shortcuts = '';
          itemKeys.forEach((key, idx) => {
            questions[dialogStates.protocolType].text += `${idx ? ', ' : ''}${questionMap[key]}`;
            shortcuts += shortcutMap[key];
          });
          questions[dialogStates.protocolType].text += ' (';
          shortcuts.split('').forEach((sc, idx) => {
            questions[dialogStates.protocolType].text += `${idx ? '/' : ''}${sc}`;
          });
          questions[dialogStates.protocolType].text += ')';
          questions[dialogStates.protocolType].handlers[0].match = new RegExp(`^[${shortcuts}]$`, 'i');
          return dialogStates.protocolType;
        },
      },
    ],
  },

  [dialogStates.protocolType]: {
    text: '<replaced from [dialogStates.protocolDate], all handlers>',
    handlers: [
      {
        match: /^[hri]$/i, // replaced from [dialogStates.protocolDate, all handlers
        code: async (context, answer) => {
          context.protocol.type = shortcutReverseMap[answer];
          context.protocol.hwList = await context.dbQuery.getHwProtocolItems(
            context.protocol.userId,
            context.protocol.date,
            context.protocol.type,
          );
          if (context.protocol.type !== 'hw_repurchase') { return dialogStates.protocolOfficeKey; }
          process.stdout.write(`\nabout to generate (${actionMap[context.protocol.type].trim()}) protocol`
          + `with the following items:\n${JSON.stringify(context.protocol.hwList, null, 2)}\n\n`);
          return dialogStates.protocol;
        },
      },
    ],
  },

  [dialogStates.protocolOfficeKey]: {
    text: '[protocol] include office key? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: (context) => {
          context.protocol.includeKey = true;
          process.stdout.write(`\nabout to generate (${actionMap[context.protocol.type].trim()}) protocol`
          + `with the following items:\n${JSON.stringify(context.protocol.hwList, null, 2)}\nwith office key included\n\n`);
          return dialogStates.protocol;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: (context) => {
          context.protocol.includeKey = false;
          process.stdout.write(`\nabout to generate (${actionMap[context.protocol.type].trim()}) protocol`
          + `with the following items:\n${JSON.stringify(context.protocol.hwList, null, 2)}\nwith no office key on it\n\n`);
          return dialogStates.protocol;
        },
      },
    ],
  },

  [dialogStates.protocol]: {
    text: 'do you want to proceed? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          await generatePdf(context.protocol);
          context.protocol = undefined;
          return dialogStates.init;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: async (context) => {
          context.protocol = undefined;
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
