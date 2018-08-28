const printf = require('printf');
const config = require('./config');

const dialogStates = {
  init: 1,
  end: 2,

  showHw: 3,
  showHwUserId: 4,
  showHwCategoryId: 5,
  showHwStoreId: 6,

  discardHwDate: 7,
  discardHwDescription: 8,
  discardHw: 9,
};

const printCategories = (categories) => {
  let idWidth = 3;
  let categoryWidth = 9;
  let len;
  let i;
  categories.forEach((category) => {
    len = category.id.toString().length;
    if (len > idWidth) { idWidth = len; }
    len = category.category.length;
    if (len > categoryWidth) { categoryWidth = len; }
  });
  let str = printf(` %${idWidth}s | category:\n`, 'id:');
  process.stdout.write(str);
  str = '-';
  for (i = 0; i < idWidth; i += 1) { str += '-'; }
  str += '-+-';
  for (i = 0; i < categoryWidth; i += 1) { str += '-'; }
  str += '-\n';
  process.stdout.write(str);
  categories.forEach((category) => {
    str = printf(` %${idWidth}s | %s\n`, category.id, category.category);
    process.stdout.write(str);
  });
  process.stdout.write(`(${categories.length} rows)\n\n`);
};

const printStores = (stores) => {
  let idWidth = 3;
  let storeWidth = 6;
  let len;
  let i;
  stores.forEach((store) => {
    len = store.id.toString().length;
    if (len > idWidth) { idWidth = len; }
    len = store.store.length;
    if (len > storeWidth) { storeWidth = len; }
  });
  let str = printf(` %${idWidth}s | store:\n`, 'id:');
  process.stdout.write(str);
  str = '-';
  for (i = 0; i < idWidth; i += 1) { str += '-'; }
  str += '-+-';
  for (i = 0; i < storeWidth; i += 1) { str += '-'; }
  str += '-\n';
  process.stdout.write(str);
  stores.forEach((store) => {
    str = printf(` %${idWidth}s | %s\n`, store.id, store.store);
    process.stdout.write(str);
  });
  process.stdout.write(`(${stores.length} rows)\n\n`);
};

const printHw = (hw) => {
  const descrWidthMax = config.hwDisplay.descriptionWidth;
  const commentWidthMax = config.hwDisplay.commentWidth;
  let idWidth = 3;
  let categoryWidth = 9;
  let descrWidth = 6;
  let storeWidth = 6;
  let priceWidth = 6;
  let condWidth = 5;
  let userWidth = 5;
  let maxWidth = 4;
  let commentWidth = 8;

  let len;
  let i;
  hw.forEach((item) => {
    len = item.id.toString().length;
    if (len > idWidth) { idWidth = len; }
    len = item.category.length;
    if (len > categoryWidth) { categoryWidth = len; }
    len = item.description ? Math.min(descrWidthMax, item.description.length) : 0;
    if (len > descrWidth) { descrWidth = len; }
    len = item.store.length;
    if (len > storeWidth) { storeWidth = len; }
    len = item.purchase_price.toString().length;
    if (len > priceWidth) { priceWidth = len; }
    len = item.condition.length;
    if (len > condWidth) { condWidth = len; }
    len = item.user.length;
    if (len > userWidth) { userWidth = len; }
    len = item.max_price !== null ? item.max_price.toString().length : 0;
    if (len > maxWidth) { maxWidth = len; }
    len = item.comment ? Math.min(commentWidthMax, item.comment.length) : 0;
    if (len > commentWidth) { commentWidth = len; }
  });
  let str = printf(
    ` %-${idWidth}s | M | %-${condWidth}s | %-${categoryWidth}s | %-${descrWidth}s | %-${storeWidth}s | `
    + `pur. date: | %-${priceWidth}s | %-${userWidth}s | %-${maxWidth}s | comment:\n`,
    'id:', 'cond:', 'category:', 'descr:', 'store:', 'price:', 'user:', 'max:',
  );
  process.stdout.write(str);
  str = '-';
  for (i = 0; i < idWidth; i += 1) { str += '-'; }
  str += '-+---+-';
  for (i = 0; i < condWidth; i += 1) { str += '-'; }
  str += '-+-';
  for (i = 0; i < categoryWidth; i += 1) { str += '-'; }
  str += '-+-';
  for (i = 0; i < descrWidth; i += 1) { str += '-'; }
  str += '-+-';
  for (i = 0; i < storeWidth; i += 1) { str += '-'; }
  str += '-+------------+-';
  for (i = 0; i < priceWidth; i += 1) { str += '-'; }
  str += '-+-';
  for (i = 0; i < userWidth; i += 1) { str += '-'; }
  str += '-+-';
  for (i = 0; i < maxWidth; i += 1) { str += '-'; }
  str += '-+-';
  for (i = 0; i < commentWidth; i += 1) { str += '-'; }
  str += '-\n';
  process.stdout.write(str);
  /* eslint-disable no-nested-ternary */
  hw.forEach((item) => {
    const descr = item.description
      ? (item.description.length <= descrWidthMax ? item.description : `${item.description.substr(0, descrWidthMax - 3)}...`)
      : '';
    const comment = item.comment
      ? (item.comment.length <= commentWidthMax ? item.comment : `${item.comment.substr(0, commentWidthMax - 3)}...`)
      : '';
    str = printf(
      ` %${idWidth}s | %s | %-${condWidth}s | %-${categoryWidth}s | %-${descrWidth}s | %-${storeWidth}s | `
      + `%s | %${priceWidth}s | %-${userWidth}s | %${maxWidth}s | %s\n`,
      item.id.toString(), item.available ? 'x' : ' ', item.condition, item.category, descr, item.store,
      item.purchase_date, item.purchase_price.toString(), item.user, item.max_price !== null ? item.max_price.toString() : '', comment,
    );
    process.stdout.write(str);
  });
  process.stdout.write(`(${hw.length} rows)\n\n`);
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
    text: '[main] enter hw id to discard, (s)how hw, or (q)uit (<number>/S/q)',
    handlers: [
      {
        match: /^\d+$/,
        code: async (context, answer) => {
          const hwId = parseInt(answer, 10);
          const hw = await context.dbQuery.getHwDetails(hwId);
          if (!hw) { return dialogStates.init; }
          if (!hw.length || !hw[0].active) {
            process.stdout.write(`\nhw item with id (${hwId}) not found or inactive!\n\n`);
            return dialogStates.init;
          }
          const hwItem = hw[0];
          hwItem.id = undefined;
          hwItem.category_id = undefined;
          hwItem.store_id = undefined;
          hwItem.active = undefined;
          const today = (new Date()).toISOString().substr(0, 10);
          context.discardHw = {
            id: hwId,
            hw: hwItem,
            date: today,
          };
          process.stdout.write(`\ndiscarding hw item:\n${JSON.stringify(hwItem, null, 2)}\n\n`);
          questions[dialogStates.discardHwDate].text = `[discard hw] enter discard date (in YYYY-MM-DD format, press enter for "${context.discardHw.date}")`;
          return dialogStates.discardHwDate;
        },
      },
      {
        match: /^[s]{0,1}$/i,
        code: () => dialogStates.showHw,
      },
      {
        match: /^[q]$/i,
        code: () => dialogStates.end,
      },
    ],
  },

  [dialogStates.showHw]: {
    text: '[show hw] list (a)ll items, only for selected (u)ser / (c)ategory / (s)tore, or go (b)ack? (A/u/c/s/b)',
    handlers: [
      {
        match: /^[a]{0,1}$/i,
        code: async (context) => {
          const hw = await context.dbQuery.getHw({ 'h.active': true });
          if (!hw) { return dialogStates.init; }
          printHw(hw);
          return dialogStates.init;
        },
      },
      {
        match: /^[b]$/i,
        code: () => dialogStates.init,
      },
      {
        match: /^[u]$/i,
        code: () => dialogStates.showHwUserId,
      },
      {
        match: /^[c]$/i,
        code: () => dialogStates.showHwCategoryId,
      },
      {
        match: /^[s]$/i,
        code: () => dialogStates.showHwStoreId,
      },
    ],
  },

  [dialogStates.showHwUserId]: {
    text: '[show hw] enter user id, (l)ist existing users, or go (b)ack (<number>/L/b)',
    handlers: [
      {
        match: /^\d+$/,
        code: async (context, answer) => {
          const hw = await context.dbQuery.getHw({
            'h.user_id': parseInt(answer, 10),
            'h.active': true,
          });
          if (!hw) { return dialogStates.init; }
          printHw(hw);
          return dialogStates.init;
        },
      },
      {
        match: /^[l]{0,1}$/i,
        code: async (context) => {
          const users = await context.dbQuery.getUsers();
          if (!users) { return dialogStates.init; }
          printUsers(users);
          return dialogStates.showHwUserId;
        },
      },
      {
        match: /^[b]$/i,
        code: () => dialogStates.init,
      },
    ],
  },

  [dialogStates.showHwCategoryId]: {
    text: '[show hw] enter category id, (l)ist existing categories, or go (b)ack (<number>/L/b)',
    handlers: [
      {
        match: /^\d+$/,
        code: async (context, answer) => {
          const hw = await context.dbQuery.getHw({
            'h.category': parseInt(answer, 10),
            'h.active': true,
          });
          if (!hw) { return dialogStates.init; }
          printHw(hw);
          return dialogStates.init;
        },
      },
      {
        match: /^[l]{0,1}$/i,
        code: async (context) => {
          const categories = await context.dbQuery.getHwCategories();
          if (!categories) { return dialogStates.init; }
          printCategories(categories);
          return dialogStates.showHwCategoryId;
        },
      },
      {
        match: /^[b]$/i,
        code: () => dialogStates.init,
      },
    ],
  },

  [dialogStates.showHwStoreId]: {
    text: '[show hw] enter store id, (l)ist existing stores, or go (b)ack (<number>/L/b)',
    handlers: [
      {
        match: /^\d+$/,
        code: async (context, answer) => {
          const hw = await context.dbQuery.getHw({
            'h.store': parseInt(answer, 10),
            'h.active': true,
          });
          if (!hw) { return dialogStates.init; }
          printHw(hw);
          return dialogStates.init;
        },
      },
      {
        match: /^[l]{0,1}$/i,
        code: async (context) => {
          const stores = await context.dbQuery.getStores();
          if (!stores) { return dialogStates.init; }
          printStores(stores);
          return dialogStates.showHwStoreId;
        },
      },
      {
        match: /^[b]$/i,
        code: () => dialogStates.init,
      },
    ],
  },

  [dialogStates.discardHwDate]: {
    text: '<replaced from [dialogStates.init], handler (number)>',
    handlers: [
      {
        match: /^$/,
        code: (context) => {
          questions[dialogStates.discardHwDescription].text = `[discard hw] enter description explaining discarding this hw (will be prepended with "Discarded on ${context.discardHw.date}:")`;
          return dialogStates.discardHwDescription;
        },
      },
      {
        match: /^20\d{2}-\d{2}-\d{2}$/,
        code: (context, answer) => {
          context.discardHw.date = answer;
          questions[dialogStates.discardHwDescription].text = `[discard hw] enter description explaining discarding this hw (will be prepended with "Discarded on ${context.discardHw.date}:")`;
          return dialogStates.discardHwDescription;
        },
      },
    ],
  },

  [dialogStates.discardHwDescription]: {
    text: '<replaced from [dialogStates.discardHwDate], all handlers>',
    handlers: [
      {
        match: /^\S.*\S$/,
        code: (context, answer) => {
          context.discardHw.description = `Discarded on ${context.discardHw.date}: ${answer}`;
          const str = `\nabout to discard hw item (id: ${context.discardHw.id}) with description "${context.discardHw.description}"\n\n`;
          process.stdout.write(str);
          return dialogStates.discardHw;
        },
      },
    ],
  },

  [dialogStates.discardHw]: {
    text: '[discard hw] do you want to proceed? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          const id = await context.dbQuery.discardHw({
            id: context.discardHw.id,
            description: context.discardHw.description,
          });
          context.discardHw = undefined;
          if (!id) { return dialogStates.init; }
          process.stdout.write('\nhw successfully discarded\n\n');
          return dialogStates.init;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: (context) => {
          context.discardHw = undefined;
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
