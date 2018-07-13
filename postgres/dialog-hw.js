const printf = require('printf');
const config = require('./config');

const dialogStates = {
  init: 1,
  end: 2,

  createHwCategory: 3,
  createHwCreateCategoryName: 4,
  createHwCreateCategory: 5,
  createHwDescription: 6,
  createHwStore: 7,
  createHwCreateStoreName: 8,
  createHwCreateStore: 9,
  createHwPurchaseDate: 10,
  createHwPurchasePrice: 11,
  createHwInvoiceId: 12,
  createHwSerialId: 13,
  createHwInventoryId: 14,
  createHwComment: 15,
  createHw: 16,

  showHwMain: 17,
  showHwAll: 18,
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
  const descrWidthMax = 20;
  const commentWidthMax = 20;
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
    ` %-${idWidth}s | A | M | %-${condWidth}s | %-${categoryWidth}s | %-${descrWidth}s | %-${storeWidth}s | `
    + `pur. date: | %-${priceWidth}s | %-${userWidth}s | %-${maxWidth}s | comment:\n`,
    'id:', 'cond:', 'category:', 'descr:', 'store:',
    'price:', 'user:', 'max:',
  );
  process.stdout.write(str);
  str = '-';
  for (i = 0; i < idWidth; i += 1) { str += '-'; }
  str += '-+---+---+-';
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
      ` %${idWidth}s | %s | %s | %-${condWidth}s | %-${categoryWidth}s | %-${descrWidth}s | %-${storeWidth}s | `
      + `%s | %${priceWidth}s | %-${userWidth}s | %${maxWidth}s | %s\n`,
      item.id.toString(), item.active ? 'x' : ' ', item.available ? 'x' : ' ', item.condition, item.category, descr, item.store,
      item.purchase_date, item.purchase_price.toString(), item.user, item.max_price !== null ? item.max_price.toString() : '', comment,
    );
    process.stdout.write(str);
  });
  process.stdout.write(`(${hw.length} rows)\n\n`);
};

// -- garbage below --

const printChanges = (id, changes) => {
  if (Object.keys(changes).length) {
    const str = `\nabout to update the user (${id}) with the following changes:\n${JSON.stringify(changes, null, 2)}\n\n`;
    process.stdout.write(str);
    return dialogStates.editUser;
  }
  process.stdout.write('\nthere is no change for given user then\n\n');
  return dialogStates.init;
};

// -- end of garbage --

const questions = {
  [dialogStates.init]: {
    text: '[main] (s)how hw, (c)reate new hw item, (e)dit existing hw item, or (q)uit? (S/c/e/q)',
    handlers: [
      {
        match: /^[s]{0,1}$/i,
        code: () => dialogStates.showHwMain,
      },
      {
        match: /^[c]$/i,
        code: (context) => {
          context.newHw = {
            purchase_date: (new Date()).toISOString().substr(0, 10),
            condition: 'new',
            user_id: config.hwBudget.systemUserId,
            max_price: null,
            active: true,
            available: false,
          };
          questions[dialogStates.createHwPurchaseDate].text = `[create hw] purchase date (in YYYY-MM-DD format, press enter for "${context.newHw.purchase_date}")`;
          return dialogStates.createHwCategory;
        },
      },
      {
        match: /^[q]$/i,
        code: () => dialogStates.end,
      },
      // -- TODO --
      {
        match: /^[e]$/i,
        code: () => dialogStates.editHwId,
      },
    ],
  },

  [dialogStates.createHwCategory]: {
    text: '[create hw] enter category id, (l)ist existing categories, (c)reate new category, or go (b)ack (<number>/L/c/b)',
    handlers: [
      {
        match: /^\d+$/,
        code: (context, answer) => {
          context.newHw.category = parseInt(answer, 10);
          return dialogStates.createHwDescription;
        },
      },
      {
        match: /^[l]{0,1}$/i,
        code: async (context) => {
          const categories = await context.dbQuery.getHwCategories();
          if (!categories) { return dialogStates.init; }
          printCategories(categories);
          return dialogStates.createHwCategory;
        },
      },
      {
        match: /^[c]$/i,
        code: () => dialogStates.createHwCreateCategoryName,
      },
      {
        match: /^[b]$/i,
        code: () => dialogStates.init,
      },
    ],
  },

  [dialogStates.createHwCreateCategoryName]: {
    text: '[create hw] enter (non-empty) name of the new category',
    handlers: [
      {
        match: /^\S.*\S$/,
        code: (context, answer) => {
          context.newCategory = { category: answer };
          const str = `\nabout to create the following category:\n${JSON.stringify(context.newCategory, null, 2)}\n\n`;
          process.stdout.write(str);
          return dialogStates.createHwCreateCategory;
        },
      },
    ],
  },

  [dialogStates.createHwCreateCategory]: {
    text: '[create hw] do you want to proceed? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          const id = await context.dbQuery.createHwCategory(context.newCategory);
          context.newCategory = undefined;
          if (!id) { return dialogStates.createHwCategory; }
          process.stdout.write(`\nnew category with id (${id}) successfully created\n\n`);
          context.newHw.category = id;
          return dialogStates.createHwDescription;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: () => dialogStates.createHwCategory,
      },
    ],
  },

  [dialogStates.createHwDescription]: {
    text: '[create hw] enter description (press enter to skip)',
    handlers: [
      {
        match: /.*/,
        code: (context, answer) => {
          const str = answer.trim();
          context.newHw.description = (str === '' ? null : str);
          return dialogStates.createHwStore;
        },
      },
    ],
  },

  [dialogStates.createHwStore]: {
    text: '[create hw] enter store id, (l)ist existing stores, (c)reate new store, or go (b)ack (<number>/L/c/b)',
    handlers: [
      {
        match: /^\d+$/,
        code: (context, answer) => {
          context.newHw.store = parseInt(answer, 10);
          return dialogStates.createHwPurchaseDate;
        },
      },
      {
        match: /^[l]{0,1}$/i,
        code: async (context) => {
          const stores = await context.dbQuery.getStores();
          if (!stores) { return dialogStates.init; }
          printStores(stores);
          return dialogStates.createHwStore;
        },
      },
      {
        match: /^[c]$/i,
        code: () => dialogStates.createHwCreateStoreName,
      },
      {
        match: /^[b]$/i,
        code: () => dialogStates.init,
      },
    ],
  },

  [dialogStates.createHwCreateStoreName]: {
    text: '[create hw] enter (non-empty) name of the new store',
    handlers: [
      {
        match: /^\S.*\S$/,
        code: (context, answer) => {
          context.newStore = { store: answer };
          const str = `\nabout to create the following store:\n${JSON.stringify(context.newStore, null, 2)}\n\n`;
          process.stdout.write(str);
          return dialogStates.createHwCreateStore;
        },
      },
    ],
  },

  [dialogStates.createHwCreateStore]: {
    text: '[create hw] do you want to proceed? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          const id = await context.dbQuery.createStore(context.newStore);
          context.newStore = undefined;
          if (!id) { return dialogStates.createHwStore; }
          process.stdout.write(`\nnew store with id (${id}) successfully created\n\n`);
          context.newHw.store = id;
          return dialogStates.createHwPurchaseDate;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: () => dialogStates.createHwStore,
      },
    ],
  },

  [dialogStates.createHwPurchaseDate]: {
    text: '<replaced from [dialogStates.init], handler "c">',
    handlers: [
      {
        match: /^$/,
        code: () => dialogStates.createHwPurchasePrice,
      },
      {
        match: /^20\d{2}-\d{2}-\d{2}$/,
        code: (context, answer) => {
          context.newHw.purchase_date = answer;
          return dialogStates.createHwPurchasePrice;
        },
      },
    ],
  },

  [dialogStates.createHwPurchasePrice]: {
    text: '[create hw] enter (non-empty) purchase price',
    handlers: [
      {
        match: /^\d+$/,
        code: (context, answer) => {
          context.newHw.purchase_price = parseInt(answer, 10);
          return dialogStates.createHwInvoiceId;
        },
      },
    ],
  },

  [dialogStates.createHwInvoiceId]: {
    text: '[create hw] enter invoice id (string, press enter to skip)',
    handlers: [
      {
        match: /.*/,
        code: (context, answer) => {
          const str = answer.trim();
          context.newHw.store_invoice_id = (str === '' ? null : str);
          return dialogStates.createHwSerialId;
        },
      },
    ],
  },

  [dialogStates.createHwSerialId]: {
    text: '[create hw] enter serial id (string, press enter to skip)',
    handlers: [
      {
        match: /.*/,
        code: (context, answer) => {
          const str = answer.trim();
          context.newHw.serial_id = (str === '' ? null : str);
          return dialogStates.createHwInventoryId;
        },
      },
    ],
  },

  [dialogStates.createHwInventoryId]: {
    text: '[create hw] enter (local) inventory id (string, press enter to skip)',
    handlers: [
      {
        match: /.*/,
        code: (context, answer) => {
          const str = answer.trim();
          context.newHw.inventory_id = (str === '' ? null : str);
          return dialogStates.createHwComment;
        },
      },
    ],
  },

  [dialogStates.createHwComment]: {
    text: '[create hw] enter comment (press enter to skip)',
    handlers: [
      {
        match: /.*/,
        code: (context, answer) => {
          const str = answer.trim();
          context.newHw.comment = (str === '' ? null : str);
          const text = `\nabout to create the following hw item:\n${JSON.stringify(context.newHw, null, 2)}\n\n`;
          process.stdout.write(text);
          return dialogStates.createHw;
        },
      },
    ],
  },

  [dialogStates.createHw]: {
    text: 'do you want to proceed? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          const id = await context.dbQuery.createHw(context.newHw);
          if (id !== null) {
            process.stdout.write(`\nnew hw with id (${id}) successfully created\n\n`);
          }
          context.newHw = undefined;
          return dialogStates.init;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: () => dialogStates.init,
      },
    ],
  },

  [dialogStates.showHwMain]: {
    text: '[show hw] list (a)ll items, only for selected (c)ategory, only for selected (s)hop, full history for one id, or go (b)ack? (A/c/s/<number>/b)',
    handlers: [
      {
        match: /^[a]{0,1}$/i,
        code: () => dialogStates.showHwAll,
      },
      {
        match: /^[b]$/i,
        code: () => dialogStates.init,
      },
      // -- TODO --
      {
        match: /^[c]$/i,
        code: () => {
        },
      },
      {
        match: /^[s]$/i,
        code: () => {
        },
      },
      {
        match: /^\d+$/,
        code: () => {
        },
      },
    ],
  },

  [dialogStates.showHwAll]: {
    text: '[show hw] include inactive (sold) items? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          const hw = await context.dbQuery.getHw();
          if (!hw) { return dialogStates.init; }
          printHw(hw);
          return dialogStates.init;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: async (context) => {
          const hw = await context.dbQuery.getHw({ 'h.active': true });
          if (!hw) { return dialogStates.init; }
          printHw(hw);
          return dialogStates.init;
        },
      },
    ],
  },

  // -------------------------------------------------------------------------------
  // -- garbage below --
  // -------------------------------------------------------------------------------

  [dialogStates.editUserId]: {
    text: '(s)how existing users, go (b)ack, or enter user id to edit (S/b/<number>)',
    handlers: [
      {
        match: /^[s]{0,1}$/i,
        code: async (context) => {
          const users = await context.dbQuery.getUsers();
          if (users === null) { return dialogStates.init; }
          // printUsers(users);
          return dialogStates.editUserId;
        },
      },
      {
        match: /^[b]$/i,
        code: () => dialogStates.init,
      },
      {
        match: /^\d+$/,
        code: async (context, answer) => {
          const id = parseInt(answer, 10);
          const user = await context.dbQuery.getUser(id);
          if (user === null) { return dialogStates.init; }
          if (user === 0) {
            process.stdout.write('\nno such user in DB\n\n');
            return dialogStates.editUserId;
          }
          context.userId = id;
          context.userData = user;
          user.id = undefined;
          process.stdout.write(`\nediting user:\n${JSON.stringify(user, null, 2)}\n\n`);

          context.changes = {};
          /* eslint-disable max-len */
          questions[dialogStates.editUserName].text = `edit name of the new user (press enter for "${user.name}")`;
          questions[dialogStates.editUserSystem].text = `system user? ${context.userData.system ? '(Y/n)' : '(y/N)'}`;
          context.userData.start_date_default = context.userData.start_date || (new Date()).toISOString().substr(0, 10);
          questions[dialogStates.editUserStartDate].text = `start date (in YYYY-MM-DD format, press enter for "${context.userData.start_date_default}")`;
          context.userData.active_default = context.userData.active === null ? true : context.userData.active;
          questions[dialogStates.editUserActive].text = `active user? ${context.userData.active_default ? '(Y/n)' : '(y/N)'}`;
          context.userData.part_time_default = context.userData.part_time === null ? false : context.userData.part_time;
          questions[dialogStates.editUserPartTime].text = `part time? ${context.userData.part_time_default ? '(Y/n)' : '(y/N)'}`;

          return dialogStates.editUserName;
        },
      },
    ],
  },

  [dialogStates.editUserName]: {
    text: '<replaced from [dialogStates.editUserId], handler (number)>',
    handlers: [
      {
        match: /^$/,
        code: () => dialogStates.editUserSystem,
      },
      {
        match: /^\S.*\S$/,
        code: (context, answer) => {
          if (answer !== context.userData.name) {
            context.changes.name = answer;
          }
          return dialogStates.editUserSystem;
        },
      },
    ],
  },

  [dialogStates.editUserSystem]: {
    text: '<replaced from [dialogStates.editUserId], handler (number)>',
    handlers: [
      {
        match: /^[y]$/i,
        code: (context) => {
          if (context.userData.system === false) {
            context.changes.system = true;
            context.changes.active = null;
            context.changes.start_date = null;
            context.changes.part_time = null;
          }
          return printChanges(context.userId, context.changes);
        },
      },
      {
        match: /^[n]$/i,
        code: (context) => {
          if (context.userData.system === true) {
            context.changes.system = false;
          }
          return dialogStates.editUserStartDate;
        },
      },
      {
        match: /^$/,
        code: (context) => questions[dialogStates.editUserSystem].handlers[context.userData.system ? 0 : 1].code(context),
      },
    ],
  },

  [dialogStates.editUserStartDate]: {
    text: '<replaced from [dialogStates.editUserId], handler (number)>',
    handlers: [
      {
        match: /^$/,
        code: (context) => {
          if (context.userData.start_date !== context.userData.start_date_default) {
            context.changes.start_date = context.userData.start_date_default;
          }
          return dialogStates.editUserActive;
        },
      },
      {
        match: /^20\d{2}-\d{2}-\d{2}$/,
        code: (context, answer) => {
          if (context.userData.start_date !== answer) {
            context.changes.start_date = answer;
          }
          return dialogStates.editUserActive;
        },
      },
    ],
  },

  [dialogStates.editUserActive]: {
    text: '<replaced from [dialogStates.editUserId], handler (number)>',
    handlers: [
      {
        match: /^[y]$/i,
        code: (context) => {
          if (context.userData.active !== true) {
            context.changes.active = true;
          }
          return dialogStates.editUserPartTime;
        },
      },
      {
        match: /^[n]$/i,
        code: (context) => {
          if (context.userData.active !== false) {
            context.changes.active = false;
          }
          return dialogStates.editUserPartTime;
        },
      },
      {
        match: /^$/,
        code: (context) => questions[dialogStates.editUserActive].handlers[context.userData.active_default ? 0 : 1].code(context),
      },
    ],
  },

  [dialogStates.editUserPartTime]: {
    text: '<replaced from [dialogStates.editUserId], handler (number)>',
    handlers: [
      {
        match: /^[y]$/i,
        code: (context) => {
          if (context.userData.part_time !== true) {
            context.changes.part_time = true;
          }
          return printChanges(context.userId, context.changes);
        },
      },
      {
        match: /^[n]$/i,
        code: (context) => {
          if (context.userData.part_time !== false) {
            context.changes.part_time = false;
          }
          return printChanges(context.userId, context.changes);
        },
      },
      {
        match: /^$/,
        code: (context) => questions[dialogStates.editUserPartTime].handlers[context.userData.part_time_default ? 0 : 1].code(context),
      },
    ],
  },

  [dialogStates.editUser]: {
    text: 'do you want to proceed? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          const id = await context.dbQuery.updateUser(context.userId, context.changes);
          if (id !== null) {
            process.stdout.write(`\nuser with id (${id}) successfully updated\n\n`);
          }
          context.userId = undefined;
          context.userData = undefined;
          context.changes = undefined;
          return dialogStates.init;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: () => dialogStates.init,
      },
    ],
  },
};

module.exports = {
  dialogStates,
  questions,
};
