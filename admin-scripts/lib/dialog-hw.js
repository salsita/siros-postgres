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
  showHwUserId: 19,
  showHwUserAll: 20,
  showHwCategoryId: 21,
  showHwCategoryAll: 22,
  showHwStoreId: 23,
  showHwStoreAll: 24,

  editHwId: 25,
  editHwCategory: 26,
  editHwCreateCategoryName: 27,
  editHwCreateCategory: 28,
  editHwDescription: 29,
  editHwStore: 30,
  editHwCreateStoreName: 31,
  editHwCreateStore: 32,
  editHwPurchaseDate: 33,
  editHwPurchasePrice: 34,
  editHwInvoiceId: 35,
  editHwSerialId: 36,
  editHwCondition: 37,
  editHwInventoryId: 38,
  editHwMaxPrice: 39,
  editHwAvailable: 40,
  editHwComment: 41,
  editHw: 42,
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
  const serialIdWidthMax = config.hwDisplay.serialIdWidth;
  let idWidth = 3;
  let categoryWidth = 9;
  let descrWidth = 6;
  let purchDateWidth = 10;
  let priceWidth = 6;
  let curPriceWidth = 10;
  let condWidth = 5;
  let userWidth = 5;
  let commentWidth = 8;
  let serialIdWidth = 8;

  const today = (new Date()).toISOString().substr(0, 10);
  let len;
  let i;
  hw.forEach((item) => {
    //
    let price = config.hwItems.getAgedPrice(item.purchase_price, item.purchase_date, today);
    if (item.condition === 'new') { price = item.purchase_price; }
    item.current_price_calc = price;
    //
    len = item.id.toString().length;
    if (len > idWidth) { idWidth = len; }
    len = item.category.length;
    if (len > categoryWidth) { categoryWidth = len; }
    len = item.description ? Math.min(descrWidthMax, item.description.length) : 0;
    if (len > descrWidth) { descrWidth = len; }
    len = item.purchase_price.toString().length;
    if (len > priceWidth) { priceWidth = len; }
    len = item.current_price_calc.toString().length;
    if (len > curPriceWidth) { curPriceWidth = len; }
    len = item.condition.length;
    if (len > condWidth) { condWidth = len; }
    len = item.user.length;
    if (len > userWidth) { userWidth = len; }
    len = item.serial_id !== null ? Math.min(serialIdWidthMax, item.serial_id.length) : 0;
    if (len > serialIdWidth) { serialIdWidth = len; }
    len = item.comment ? Math.min(commentWidthMax, item.comment.length) : 0;
    if (len > commentWidth) { commentWidth = len; }
  });
  let str = printf(
    ` %-${idWidth}s | A | M | %-${condWidth}s | %-${categoryWidth}s | %-${descrWidth}s | `
    + `pur. date: | %-${priceWidth}s | %-${curPriceWidth}s | %-${userWidth}s | %-${serialIdWidth}s | comment:\n`,
    'id:', 'cond:', 'category:', 'descr:', 'price:', 'cur.price:', 'user:', 'serial_id:',
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
  for (i = 0; i < purchDateWidth; i += 1) { str += '-'; }
  str += '-+-';
  for (i = 0; i < priceWidth; i += 1) { str += '-'; }
  str += '-+-';
  for (i = 0; i < curPriceWidth; i += 1) { str += '-'; }
  str += '-+-';
  for (i = 0; i < userWidth; i += 1) { str += '-'; }
  str += '-+-';
  for (i = 0; i < serialIdWidth; i += 1) { str += '-'; }
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
    const serialId = item.serial_id
      ? (item.serial_id.length <= serialIdWidthMax ? item.serial_id : `${item.serial_id.substr(0, serialIdWidthMax - 3)}...`)
      : '';
    str = printf(
      ` %${idWidth}s | %s | %s | %-${condWidth}s | %-${categoryWidth}s | %-${descrWidth}s | `
      + `%s | %${priceWidth}s | %${curPriceWidth}s | %-${userWidth}s | %-${serialIdWidth}s | %s\n`,
      item.id.toString(), item.active ? 'x' : ' ', item.available ? 'x' : ' ', item.condition, item.category, descr,
      item.purchase_date, item.purchase_price.toString(),
      item.active ? item.current_price_calc.toString() : '',
      item.user, serialId, comment,
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

const printChanges = (id, changes) => {
  if (Object.keys(changes).length) {
    const str = `\nabout to update the hw item (${id}) with the following changes:\n${JSON.stringify(changes, null, 2)}\n\n`;
    process.stdout.write(str);
    return dialogStates.editHw;
  }
  process.stdout.write('\nthere is no change for given hw item then\n\n');
  return dialogStates.init;
};

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
            user_id: config.hwItems.systemUserId,
            max_price: null,
            active: true,
            available: false,
          };
          questions[dialogStates.createHwPurchaseDate].text = `[create hw] enter purchase date (in YYYY-MM-DD format, press enter for "${context.newHw.purchase_date}")`;
          return dialogStates.createHwCategory;
        },
      },
      {
        match: /^[q]$/i,
        code: () => dialogStates.end,
      },
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
    text: '[create hw] do you want to proceed? (y/N)',
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
    text: '[show hw] list (a)ll items, only for selected (u)ser / (c)ategory / (s)tore, full history for one id, or go (b)ack? (A/u/c/s/<number>/b)',
    handlers: [
      {
        match: /^[a]{0,1}$/i,
        code: () => dialogStates.showHwAll,
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
      {
        match: /^\d+$/,
        code: async (context, answer) => {
          const hwId = parseInt(answer, 10);
          const hw = await context.dbQuery.getHwDetails(hwId);
          if (!hw) { return dialogStates.init; }
          if (!hw.length) {
            process.stdout.write(`\nhw item with id (${hwId}) not found!\n\n`);
            return dialogStates.init;
          }
          const today = (new Date()).toISOString().substr(0, 10);
          let price = config.hwItems.getAgedPrice(hw[0].purchase_price, hw[0].purchase_date, today);
          if (hw[0].max_price !== null) { price = Math.min(hw[0].max_price, price); }
          if (hw[0].condition === 'new') { price = hw[0].purchase_price; }
          hw[0].current_price_calc = price;
          process.stdout.write(`\nhw details:\n${JSON.stringify(hw[0], null, 2)}\n`);
          const ownerHistory = await context.dbQuery.getHwOwners(hwId);
          if (!ownerHistory) { return dialogStates.init; }
          process.stdout.write(`\nhw owners:\n${JSON.stringify(ownerHistory, null, 2)}\n`);
          const hwRepairs = await context.dbQuery.getHwRepairs(hwId);
          if (!hwRepairs) { return dialogStates.init; }
          process.stdout.write(`\nhw repairs:\n${JSON.stringify(hwRepairs, null, 2)}\n\n`);
          return dialogStates.init;
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

  [dialogStates.showHwUserId]: {
    text: '[show hw] enter user id, (l)ist existing users, or go (b)ack (<number>/L/b)',
    handlers: [
      {
        match: /^\d+$/,
        code: (context, answer) => {
          context.showHwUserId = parseInt(answer, 10);
          return dialogStates.showHwUserAll;
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

  [dialogStates.showHwUserAll]: {
    text: '[show hw] include inactive (sold) items? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          const hw = await context.dbQuery.getHw({ 'h.user_id': context.showHwUserId });
          context.showHwUserId = undefined;
          if (!hw) { return dialogStates.init; }
          printHw(hw);
          return dialogStates.init;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: async (context) => {
          const hw = await context.dbQuery.getHw({
            'h.user_id': context.showHwUserId,
            'h.active': true,
          });
          context.showHwUserId = undefined;
          if (!hw) { return dialogStates.init; }
          printHw(hw);
          return dialogStates.init;
        },
      },
    ],
  },

  [dialogStates.showHwCategoryId]: {
    text: '[show hw] enter category id, (l)ist existing categories, or go (b)ack (<number>/L/b)',
    handlers: [
      {
        match: /^\d+$/,
        code: (context, answer) => {
          context.showHwCategoryId = parseInt(answer, 10);
          return dialogStates.showHwCategoryAll;
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

  [dialogStates.showHwCategoryAll]: {
    text: '[show hw] include inactive (sold) items? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          const hw = await context.dbQuery.getHw({ 'h.category': context.showHwCategoryId });
          context.showHwCategoryId = undefined;
          if (!hw) { return dialogStates.init; }
          printHw(hw);
          return dialogStates.init;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: async (context) => {
          const hw = await context.dbQuery.getHw({
            'h.category': context.showHwCategoryId,
            'h.active': true,
          });
          context.showHwCategoryId = undefined;
          if (!hw) { return dialogStates.init; }
          printHw(hw);
          return dialogStates.init;
        },
      },
    ],
  },

  [dialogStates.showHwStoreId]: {
    text: '[show hw] enter store id, (l)ist existing stores, or go (b)ack (<number>/L/b)',
    handlers: [
      {
        match: /^\d+$/,
        code: (context, answer) => {
          context.showHwStoreId = parseInt(answer, 10);
          return dialogStates.showHwStoreAll;
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

  [dialogStates.showHwStoreAll]: {
    text: '[show hw] include inactive (sold) items? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          const hw = await context.dbQuery.getHw({ 'h.store': context.showHwStoreId });
          context.showHwStoreId = undefined;
          if (!hw) { return dialogStates.init; }
          printHw(hw);
          return dialogStates.init;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: async (context) => {
          const hw = await context.dbQuery.getHw({
            'h.store': context.showHwStoreId,
            'h.active': true,
          });
          context.showHwStoreId = undefined;
          if (!hw) { return dialogStates.init; }
          printHw(hw);
          return dialogStates.init;
        },
      },
    ],
  },

  [dialogStates.editHwId]: {
    text: '[edit hw] enter hw id to edit, or go (b)ack (<number>/B)\n(note: to change user (owner) or active flag, use different scripts)',
    handlers: [
      {
        match: /^\d+$/,
        code: async (context, answer) => {
          const id = parseInt(answer, 10);
          const hw = await context.dbQuery.getHwDetails(id);
          if (!hw) { return dialogStates.init; }
          if (!hw.length) {
            process.stdout.write(`\nhw item with id (${id}) not found!\n\n`);
            return dialogStates.init;
          }
          context.editHwId = id;
          const hwItem = hw[0];
          hwItem.id = undefined;
          context.editHw = hwItem;
          process.stdout.write(`\nediting hw item:\n${JSON.stringify(hwItem, null, 2)}\n\n`);
          context.changes = {};
          return dialogStates.editHwCategory;
        },
      },
      {
        match: /^[b]{0,1}$/i,
        code: () => dialogStates.init,
      },
    ],
  },

  [dialogStates.editHwCategory]: {
    text: '[edit hw] enter category id, (l)ist existing categories, (c)reate new category, or go (b)ack\n'
      + '(<number>/l/c/b, press enter to keep the original value)',
    handlers: [
      {
        match: /^\d*$/,
        code: (context, answer) => {
          const newCateg = (answer === '' ? context.editHw.category_id : parseInt(answer, 10));
          if (newCateg !== context.editHw.category_id) { context.changes.category = newCateg; }
          return dialogStates.editHwDescription;
        },
      },
      {
        match: /^[l]$/i,
        code: async (context) => {
          const categories = await context.dbQuery.getHwCategories();
          if (!categories) { return dialogStates.init; }
          printCategories(categories);
          return dialogStates.editHwCategory;
        },
      },
      {
        match: /^[c]$/i,
        code: () => dialogStates.editHwCreateCategoryName,
      },
      {
        match: /^[b]$/i,
        code: () => dialogStates.init,
      },
    ],
  },

  [dialogStates.editHwCreateCategoryName]: {
    text: '[edit hw] enter (non-empty) name of the new category',
    handlers: [
      {
        match: /^\S.*\S$/,
        code: (context, answer) => {
          context.newCategory = { category: answer };
          const str = `\nabout to create the following category:\n${JSON.stringify(context.newCategory, null, 2)}\n\n`;
          process.stdout.write(str);
          return dialogStates.editHwCreateCategory;
        },
      },
    ],
  },

  [dialogStates.editHwCreateCategory]: {
    text: '[edit hw] do you want to proceed? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          const id = await context.dbQuery.createHwCategory(context.newCategory);
          context.newCategory = undefined;
          if (!id) { return dialogStates.editHwCategory; }
          process.stdout.write(`\nnew category with id (${id}) successfully created\n\n`);
          context.changes.category = id;
          return dialogStates.editHwDescription;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: () => dialogStates.editHwCategory,
      },
    ],
  },

  [dialogStates.editHwDescription]: {
    text: '[edit hw] enter description (press enter to keep original value)',
    handlers: [
      {
        match: /.*/,
        code: (context, answer) => {
          const str = (answer === '' ? context.editHw.description : answer.trim());
          if (str !== context.editHw.description) { context.changes.description = str; }
          return dialogStates.editHwStore;
        },
      },
    ],
  },

  [dialogStates.editHwStore]: {
    text: '[edit hw] enter store id, (l)ist existing stores, (c)reate new store, or go (b)ack\n'
    + '(<number>/l/c/b, press enter to keep the original value)',
    handlers: [
      {
        match: /^\d*$/,
        code: (context, answer) => {
          const newStore = (answer === '' ? context.editHw.store_id : parseInt(answer, 10));
          if (newStore !== context.editHw.store_id) { context.changes.store = newStore; }
          return dialogStates.editHwPurchaseDate;
        },
      },
      {
        match: /^[l]{0,1}$/i,
        code: async (context) => {
          const stores = await context.dbQuery.getStores();
          if (!stores) { return dialogStates.init; }
          printStores(stores);
          return dialogStates.editHwStore;
        },
      },
      {
        match: /^[c]$/i,
        code: () => dialogStates.editHwCreateStoreName,
      },
      {
        match: /^[b]$/i,
        code: () => dialogStates.init,
      },
    ],
  },

  [dialogStates.editHwCreateStoreName]: {
    text: '[edit hw] enter (non-empty) name of the new store',
    handlers: [
      {
        match: /^\S.*\S$/,
        code: (context, answer) => {
          context.newStore = { store: answer };
          const str = `\nabout to create the following store:\n${JSON.stringify(context.newStore, null, 2)}\n\n`;
          process.stdout.write(str);
          return dialogStates.editHwCreateStore;
        },
      },
    ],
  },

  [dialogStates.editHwCreateStore]: {
    text: '[edit hw] do you want to proceed? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          const id = await context.dbQuery.createStore(context.newStore);
          context.newStore = undefined;
          if (!id) { return dialogStates.editHwStore; }
          process.stdout.write(`\nnew store with id (${id}) successfully created\n\n`);
          context.changes.store = id;
          return dialogStates.editHwPurchaseDate;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: () => dialogStates.editHwStore,
      },
    ],
  },

  [dialogStates.editHwPurchaseDate]: {
    text: '[edit hw] enter purchase date (in YYYY-MM-DD format, press enter to keep the original value)',
    handlers: [
      {
        match: /^$/,
        code: () => dialogStates.editHwPurchasePrice,
      },
      {
        match: /^20\d{2}-\d{2}-\d{2}$/,
        code: (context, answer) => {
          if (context.editHw.purchase_date !== answer) { context.changes.purchase_date = answer; }
          return dialogStates.editHwPurchasePrice;
        },
      },
    ],
  },

  [dialogStates.editHwPurchasePrice]: {
    text: '[edit hw] enter purchase price (press enter to keep the original value)',
    handlers: [
      {
        match: /^\d*$/,
        code: (context, answer) => {
          const price = (answer === '' ? context.editHw.purchase_price : parseInt(answer, 10));
          if (price !== context.editHw.purchase_price) { context.changes.purchase_price = price; }
          return dialogStates.editHwInvoiceId;
        },
      },
    ],
  },

  [dialogStates.editHwInvoiceId]: {
    text: '[edit hw] enter invoice id (string, press enter to keep the original value)',
    handlers: [
      {
        match: /.*/,
        code: (context, answer) => {
          const str = (answer === '' ? context.editHw.store_invoice_id : answer.trim());
          if (str !== context.editHw.store_invoice_id) { context.changes.store_invoice_id = str; }
          return dialogStates.editHwSerialId;
        },
      },
    ],
  },

  [dialogStates.editHwSerialId]: {
    text: '[edit hw] enter serial id (string, press enter to keep the original value)',
    handlers: [
      {
        match: /.*/,
        code: (context, answer) => {
          const str = (answer === '' ? context.editHw.serial_id : answer.trim());
          if (str !== context.editHw.serial_id) { context.changes.serial_id = str; }
          return dialogStates.editHwCondition;
        },
      },
    ],
  },

  [dialogStates.editHwCondition]: {
    text: '[edit hw] enter condition ("new"/"used"/"broken"/"repaired"/"missing"/"discarded", or press enter to keep the original value)',
    handlers: [
      {
        match: /^(new|used|broken|repaired|missing|discarded|)$/i,
        code: (context, answer) => {
          const cond = (answer === '' ? context.editHw.condition : answer);
          if (cond !== context.editHw.condition) { context.changes.condition = cond; }
          return dialogStates.editHwInventoryId;
        },
      },
    ],
  },

  [dialogStates.editHwInventoryId]: {
    text: '[edit hw] enter (local) inventory id (string, press enter to keep the original value)',
    handlers: [
      {
        match: /.*/,
        code: (context, answer) => {
          const str = (answer === '' ? context.editHw.inventory_id : answer.trim());
          if (str !== context.editHw.inventory_id) { context.changes.inventory_id = str; }
          return dialogStates.editHwMaxPrice;
        },
      },
    ],
  },

  [dialogStates.editHwMaxPrice]: {
    text: '[edit hw] enter max price (number, press enter to keep the original value)',
    handlers: [
      {
        match: /^\d*$/,
        code: (context, answer) => {
          const price = (answer === '' ? context.editHw.max_price : parseInt(answer, 10));
          if (price !== context.editHw.max_price) { context.changes.max_price = price; }
          return dialogStates.editHwAvailable;
        },
      },
    ],
  },

  [dialogStates.editHwAvailable]: {
    text: '[edit hw] available item? (marketplace; y/n, press enter to keep the original value)',
    handlers: [
      {
        match: /^$/,
        code: () => dialogStates.editHwComment,
      },
      {
        match: /^[y]$/i,
        code: (context) => {
          if (!context.editHw.available) { context.changes.available = true; }
          return dialogStates.editHwComment;
        },
      },
      {
        match: /^[n]$/i,
        code: (context) => {
          if (context.editHw.available) { context.changes.available = false; }
          return dialogStates.editHwComment;
        },
      },
    ],
  },

  [dialogStates.editHwComment]: {
    text: '[edit hw] enter comment (press enter to keep the original value)',
    handlers: [
      {
        match: /.*/,
        code: (context, answer) => {
          const str = (answer === '' ? context.editHw.comment : answer.trim());
          if (str !== context.editHw.comment) { context.changes.comment = str; }
          return printChanges(context.editHwId, context.changes);
        },
      },
    ],
  },

  [dialogStates.editHw]: {
    text: '[edit hw] do you want to proceed? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          const id = await context.dbQuery.updateHw(context.editHwId, context.changes);
          if (id) {
            process.stdout.write(`\nhw item with id (${id}) successfully updated\n\n`);
          }
          context.editHwId = undefined;
          context.editHw = undefined;
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
