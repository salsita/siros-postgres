const printf = require('printf');
const config = require('./config');

const dialogStates = {
  init: 1,
  end: 2,

  showHwCategoryId: 3,
  showHwStoreId: 4,
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
  const today = (new Date()).toISOString().substr(0, 10);
  let idWidth = 3;
  let condWidth = 5;
  let categoryWidth = 9;
  let descrWidth = 6;
  let curPriceWidth = 10;
  let storeWidth = 6;
  let purPriceWidth = 10;
  let commentWidth = 8;

  let len;
  let i;
  hw.forEach((item) => {
    item.curPrice = config.hwItems.getAgedPrice(item.purchase_price, item.purchase_date, today);
    if (item.max_price !== null) { item.curPrice = Math.min(item.curPrice, item.max_price); }
    if (item.condition === 'new') { item.curPrice = item.purchase_price; }
    len = item.id.toString().length;
    if (len > idWidth) { idWidth = len; }
    len = item.condition.length;
    if (len > condWidth) { condWidth = len; }
    len = item.category.length;
    if (len > categoryWidth) { categoryWidth = len; }
    len = item.description ? Math.min(descrWidthMax, item.description.length) : 0;
    if (len > descrWidth) { descrWidth = len; }
    len = item.curPrice.toString().length;
    if (len > curPriceWidth) { curPriceWidth = len; }
    len = item.store.length;
    if (len > storeWidth) { storeWidth = len; }
    len = item.purchase_price.toString().length;
    if (len > purPriceWidth) { purPriceWidth = len; }
    len = item.comment ? Math.min(commentWidthMax, item.comment.length) : 0;
    if (len > commentWidth) { commentWidth = len; }
  });
  let str = printf(
    ` %-${idWidth}s | %-${condWidth}s | %-${categoryWidth}s | %-${descrWidth}s | %-${curPriceWidth}s | `
    + `%-${storeWidth}s | pur. date: | %-${purPriceWidth}s | comment:\n`,
    'id:', 'cond:', 'category:', 'descr:', 'cur.price:', 'store:', 'pur.price:',
  );
  process.stdout.write(str);
  str = '-';
  for (i = 0; i < idWidth; i += 1) { str += '-'; }
  str += '-+-';
  for (i = 0; i < condWidth; i += 1) { str += '-'; }
  str += '-+-';
  for (i = 0; i < categoryWidth; i += 1) { str += '-'; }
  str += '-+-';
  for (i = 0; i < descrWidth; i += 1) { str += '-'; }
  str += '-+-';
  for (i = 0; i < curPriceWidth; i += 1) { str += '-'; }
  str += '-+-';
  for (i = 0; i < storeWidth; i += 1) { str += '-'; }
  str += '-+------------+-';
  for (i = 0; i < purPriceWidth; i += 1) { str += '-'; }
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
      ` %${idWidth}s | %-${condWidth}s | %-${categoryWidth}s | %-${descrWidth}s | %${curPriceWidth}s | `
      + `%-${storeWidth}s | %s | %${purPriceWidth}s | %s\n`,
      item.id.toString(), item.condition, item.category, descr, item.curPrice.toString(),
      item.store, item.purchase_date, item.purchase_price.toString(), comment,
    );
    process.stdout.write(str);
  });
  process.stdout.write(`(${hw.length} rows)\n\n`);
};

const questions = {
  [dialogStates.init]: {
    text: '[main] list (a)ll marketplace items, only for selected (c)ategory / (s)tore, or (q)uit (A/c/s/q)',
    handlers: [
      {
        match: /^[a]{0,1}$/i,
        code: async (context) => {
          const hw = await context.dbQuery.getHw({
            'h.active': true,
            'h.available': true,
          });
          if (!hw) { return dialogStates.init; }
          printHw(hw);
          return dialogStates.init;
        },
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
        match: /^[q]$/i,
        code: () => dialogStates.end,
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
            'h.available': true,
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
            'h.available': true,
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
};

module.exports = {
  dialogStates,
  questions,
};
