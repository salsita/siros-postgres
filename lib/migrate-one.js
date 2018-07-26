const config = require('./config');

const dialogStates = {
  init: 1,
  end: 2,

  createHwCategory: 3,
  createHwDescription: 4,
  createHwStore: 5,
  createHwPurchaseDate: 6,
  createHwPurchasePrice: 7,
  createHwInvoiceId: 8,
  createHwSerialId: 9,
  createHwInventoryId: 10,
  createHwComment: 11,
  createHwCondition: 12,
  createHw: 13,
};

const questions = {
  [dialogStates.init]: {
    text: '[migrate] do you want to (p)roceed, or (s)kip this item? (P/s)',
    handlers: [
      {
        match: /^[p]{0,1}$/i,
        code: (context) => {
          context.newHw = {
            user_id: config.hwItems.systemUserId,
            max_price: null,
            active: true,
            available: false,
          };
          process.stdout.write(`\noriginal item category: "${context.hwItem.item}"\n`);
          return dialogStates.createHwCategory;
        },
      },
      {
        match: /^[s]$/i,
        code: () => dialogStates.end,
      },
    ],
  },

  [dialogStates.createHwCategory]: {
    text: '[migrate] enter corresponding category id (<number>)',
    handlers: [
      {
        match: /^\d+$/,
        code: (context, answer) => {
          context.newHw.category = parseInt(answer, 10);
          process.stdout.write(`\noriginal item description: "${context.hwItem.type}"\n`);
          return dialogStates.createHwDescription;
        },
      },
    ],
  },

  [dialogStates.createHwDescription]: {
    text: '[migrate] enter description (press enter to use the original value, "." to set <null>)',
    handlers: [
      {
        match: /.*/,
        code: (context, answer) => {
          const str = answer.trim();
          if (str === '') {
            context.newHw.description = context.hwItem.type;
          } else if (str === '.') {
            context.newHw.description = null;
          } else {
            context.newHw.description = answer;
          }
          process.stdout.write(`\nstore where this item was bought: "${context.hwItem.store}"\n`);
          return dialogStates.createHwStore;
        },
      },
    ],
  },

  [dialogStates.createHwStore]: {
    text: '[migrate] enter corresponding store id (<number>)',
    handlers: [
      {
        match: /^\d+$/,
        code: (context, answer) => {
          context.newHw.store = parseInt(answer, 10);
          process.stdout.write(`\noriginal item purchase date: ${context.hwItem.purchase_date}\n`);
          return dialogStates.createHwPurchaseDate;
        },
      },
    ],
  },

  [dialogStates.createHwPurchaseDate]: {
    text: '[migrate] enter purchase date (in YYYY-MM-DD format, press enter to use the original value)',
    handlers: [
      {
        match: /^$/,
        code: (context) => {
          context.newHw.purchase_date = context.hwItem.purchase_date;
          process.stdout.write(`\noriginal item purchase price: ${context.hwItem.purchase_price}\n`);
          return dialogStates.createHwPurchasePrice;
        },
      },
      {
        match: /^20\d{2}-\d{2}-\d{2}$/,
        code: (context, answer) => {
          context.newHw.purchase_date = answer;
          process.stdout.write(`\noriginal item purchase price: ${context.hwItem.purchase_price}\n`);
          return dialogStates.createHwPurchasePrice;
        },
      },
    ],
  },

  [dialogStates.createHwPurchasePrice]: {
    text: '[migrate] enter purchase price (<number>, press enter to use the original value)',
    handlers: [
      {
        match: /^$/,
        code: (context) => {
          context.newHw.purchase_price = Math.round(parseFloat(context.hwItem.purchase_price));
          if (Number.isNaN(context.newHw.purchase_price)) {
            process.stdout.write('cannot use original value!');
            return dialogStates.createHwPurchasePrice;
          }
          process.stdout.write(`\noriginal item invoice id: ${context.hwItem.invoice_id}\n`);
          return dialogStates.createHwInvoiceId;
        },
      },
      {
        match: /^\d+$/,
        code: (context, answer) => {
          context.newHw.purchase_price = parseInt(answer, 10);
          process.stdout.write(`\noriginal item invoice id: ${context.hwItem.invoice_id}\n`);
          return dialogStates.createHwInvoiceId;
        },
      },
    ],
  },

  [dialogStates.createHwInvoiceId]: {
    text: '[migrate] enter invoice id (<string>, press enter to use the original value, "." to set <null>)',
    handlers: [
      {
        match: /.*/,
        code: (context, answer) => {
          const str = answer.trim();
          if (answer === '') {
            context.newHw.store_invoice_id = context.hwItem.invoice_id || null;
          } else if (str === '.') {
            context.newHw.store_invoice_id = null;
          } else {
            context.newHw.store_invoice_id = answer;
          }
          process.stdout.write(`\noriginal item serial id: ${context.hwItem.serial_id}\n`);
          return dialogStates.createHwSerialId;
        },
      },
    ],
  },

  [dialogStates.createHwSerialId]: {
    text: '[migrate] enter serial id (<string>, press enter to use the original value, "." to set <null>)',
    handlers: [
      {
        match: /.*/,
        code: (context, answer) => {
          const str = answer.trim();
          if (answer === '') {
            context.newHw.serial_id = context.hwItem.serial_id || null;
          } else if (str === '.') {
            context.newHw.serial_id = null;
          } else {
            context.newHw.serial_id = answer;
          }
          process.stdout.write(`\noriginal item inventory id: ${context.hwItem.inventory_id}\n`);
          return dialogStates.createHwInventoryId;
        },
      },
    ],
  },

  [dialogStates.createHwInventoryId]: {
    text: '[migrate] enter (local) inventory id (<string>, press enter to use the original value, "." to set <null>)',
    handlers: [
      {
        match: /.*/,
        code: (context, answer) => {
          const str = answer.trim();
          if (answer === '') {
            context.newHw.inventory_id = context.hwItem.inventory_id || null;
          } else if (str === '.') {
            context.newHw.inventory_id = null;
          } else {
            context.newHw.inventory_id = answer;
          }
          process.stdout.write(`\noriginal item comment: ${context.hwItem.note}\n`);
          return dialogStates.createHwComment;
        },
      },
    ],
  },

  [dialogStates.createHwComment]: {
    text: '[migrate] enter comment (press enter to skip)',
    handlers: [
      {
        match: /.*/,
        code: (context, answer) => {
          const str = answer.trim();
          context.newHw.comment = (str === '' ? null : str);
          return dialogStates.createHwCondition;
        },
      },
    ],
  },

  [dialogStates.createHwCondition]: {
    text: '[migrate] create item as (n)ew, or (u)sed? (N/u)',
    handlers: [
      {
        match: /^[n]{0,1}$/i,
        code: (context) => {
          context.newHw.condition = 'new';
          const text = `\nabout to create the following hw item:\n${JSON.stringify(context.newHw, null, 2)}\n\n`;
          process.stdout.write(text);
          return dialogStates.createHw;
        },
      },
      {
        match: /^[u]$/i,
        code: (context) => {
          context.newHw.condition = 'used';
          const text = `\nabout to create the following hw item:\n${JSON.stringify(context.newHw, null, 2)}\n\n`;
          process.stdout.write(text);
          return dialogStates.createHw;
        },
      },
    ],
  },

  [dialogStates.createHw]: {
    text: '[migrate] do you want to proceed? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          const id = await context.dbQuery.createHw(context.newHw);
          context.newHw = undefined;
          if (id !== null) {
            process.stdout.write(`\nnew hw with id (${id}) successfully created\n\n`);
            return dialogStates.end;
          }
          process.stdout.write(`\nabout to migrate hw item:\n${JSON.stringify(context.hwItem, null, 2)}\n\n`);
          return dialogStates.init;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: (context) => {
          process.stdout.write(`\nabout to migrate hw item:\n${JSON.stringify(context.hwItem, null, 2)}\n\n`);
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
