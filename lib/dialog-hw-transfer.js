const printf = require('printf');
const config = require('./config');

const dialogStates = {
  init: 1,
  end: 2,

  showHw: 3,
  showHwUserId: 4,
  showHwCategoryId: 5,
  showHwStoreId: 6,

  transferUserId: 7,
  transferDate: 8,
  transferPrice: 9,
  transfer: 10,
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
    text: '[main] enter hw id to transfer, (s)how hw, or (q)uit (<number>/S/q)',
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
          context.transfer = {
            id: hwId,
            hw: hwItem,
            date: (hwItem.condition === 'new') ? hwItem.purchase_date : today,
          };
          process.stdout.write(`\ntransferring hw item:\n${JSON.stringify(hwItem, null, 2)}\n\n`);
          return dialogStates.transferUserId;
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

  [dialogStates.transferUserId]: {
    text: '[transfer] enter new user (owner) id, (l)ist existing users, or go (b)ack (<number>/L/b)',
    handlers: [
      {
        match: /^\d+$/,
        code: async (context, answer) => {
          const id = parseInt(answer, 10);
          context.transfer.userId = id;
          if (id === context.transfer.hw.user_id) {
            process.stdout.write(`\nthis user (id: ${id}) is already the owner of the hw item!\n\n`);
            return dialogStates.init;
          }
          const user = await context.dbQuery.getUser(id);
          if (user === null) { return dialogStates.init; }
          if (user === 0) {
            process.stdout.write(`\nuser with id (${id}) not found!\n\n`);
            return dialogStates.init;
          }
          context.transfer.user = user;
          if (context.transfer.date > user.start_date) { context.transfer.date = user.start_date; }
          questions[dialogStates.transferDate].text = `[transfer] enter effective date (in YYYY-MM-DD format, press enter for "${context.transfer.date}")`;
          return dialogStates.transferDate;
        },
      },
      {
        match: /^[l]{0,1}$/i,
        code: async (context) => {
          const users = await context.dbQuery.getUsers();
          if (!users) { return dialogStates.init; }
          printUsers(users);
          return dialogStates.transferUserId;
        },
      },
      {
        match: /^[b]$/i,
        code: () => dialogStates.init,
      },
    ],
  },

  [dialogStates.transferDate]: {
    text: '<replaced from [dialogStates.transferUserId], handler (id)>',
    handlers: [
      {
        match: /^$/,
        code: (context) => {
          const { hw } = context.transfer;
          /* eslint-disable max-len */
          let price = config.hwItems.getAgedPrice(hw.purchase_price, hw.purchase_date, context.transfer.date);
          if (hw.max_price !== null) { price = Math.min(hw.max_price, price); }
          if (hw.condition === 'new') { price = hw.purchase_price; }
          if (context.transfer.date < config.hwBudget.startDate) { price = 0; }
          context.transfer.price = price;
          questions[dialogStates.transferPrice].text = `[transfer] enter effective price (number, press enter for (${context.transfer.price}))`;
          return dialogStates.transferPrice;
        },
      },
      {
        match: /^20\d{2}-\d{2}-\d{2}$/,
        code: (context, answer) => {
          context.transfer.date = answer;
          const { hw } = context.transfer;
          let price = config.hwItems.getAgedPrice(hw.purchase_price, hw.purchase_date, context.transfer.date);
          if (hw.max_price !== null) { price = Math.min(hw.max_price, price); }
          if (hw.condition === 'new') { price = hw.purchase_price; }
          if (context.transfer.date < config.hwBudget.startDate) { price = 0; }
          context.transfer.price = price;
          questions[dialogStates.transferPrice].text = `[transfer] enter effective price (number, press enter for (${context.transfer.price}))`;
          return dialogStates.transferPrice;
        },
      },
    ],
  },

  [dialogStates.transferPrice]: {
    text: '<replaced from [dialogStates.transferDate], all handlers>',
    handlers: [
      {
        match: /^$/,
        code: (context) => {
          const str = `\nabout to transfer the hw item (id: ${context.transfer.id}):\n`
          + `+ to user (id: ${context.transfer.userId}, name: ${context.transfer.user.name})\n`
          + `+ effective on (date: ${context.transfer.date})\n`
          + `+ for (amount: ${context.transfer.price})\n\n`;
          process.stdout.write(str);
          return dialogStates.transfer;
        },
      },
      {
        match: /^\d+$/,
        code: (context, answer) => {
          context.transfer.price = parseInt(answer, 10);
          const str = `\nabout to transfer the hw item (id: ${context.transfer.id}):\n`
          + `+ to user (id: ${context.transfer.userId}, name: ${context.transfer.user.name})\n`
          + `+ effective on (date: ${context.transfer.date})\n`
          + `+ for (amount: ${context.transfer.price})\n\n`;
          process.stdout.write(str);
          return dialogStates.transfer;
        },
      },
    ],
  },

  [dialogStates.transfer]: {
    text: '[transfer] do you want to proceed? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          const id = await context.dbQuery.transferHw({
            id: context.transfer.id,
            condition: context.transfer.hw.condition,
            oldUser: context.transfer.hw.user_id,
            newUser: context.transfer.userId,
            date: context.transfer.date,
            price: context.transfer.price,
          });
          context.transfer = undefined;
          if (!id) { return dialogStates.init; }
          process.stdout.write(`\nhw item with id (${id}) successfully transferred\n\n`);
          return dialogStates.init;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: (context) => {
          context.transfer = undefined;
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
