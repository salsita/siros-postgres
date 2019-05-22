const printf = require('printf');
const config = require('./config');

const dialogStates = {
  init: 1,
  end: 2,

  showMain: 3,
  showUserId: 4,
  showCategoryId: 5,

  createCategory: 6,
  createCreateCategoryName: 7,
  createCreateCategory: 8,
  createDescription: 9,
  createAmount: 10,
  createUserId: 11,
  createDate: 12,
  createInvoiceId: 13,
  createEvent: 14,

  editId: 15,
  editCategory: 16,
  editCreateCategoryName: 17,
  editCreateCategory: 18,
  editDescription: 19,
  editInvoiceId: 20,
  editEvent: 21,

  reportFrom: 22,
  reportTo: 23,
  reportList: 24,
};

const printEvents = (events) => {
  let idWidth = 3;
  let categoryWidth = 9;
  let nameWidth = 5;
  let amountWidth = 7;
  let descrWidth = 12;
  let len;
  let i;
  const descrWidthMax = config.hwDisplay.descriptionWidth;
  events.forEach((event) => {
    len = event.id.toString().length;
    if (len > idWidth) { idWidth = len; }
    len = event.category.length;
    if (len > categoryWidth) { categoryWidth = len; }
    len = event.name.length;
    if (len > nameWidth) { nameWidth = len; }
    len = event.amount.toString().length;
    if (len > amountWidth) { amountWidth = len; }
    len = event.description.length;
    if (len > descrWidth) { descrWidth = len; }
  });
  if (descrWidth > descrWidthMax) { descrWidth = descrWidthMax; }
  let str = printf(
    ` %-${idWidth}s | date:      | %-${categoryWidth}s | %-${nameWidth}s | %${amountWidth}s | description:\n`,
    'id:', 'category:', 'name:', 'amount:',
  );
  process.stdout.write(str);
  str = '-';
  for (i = 0; i < idWidth; i += 1) { str += '-'; }
  str += '-+------------+-';
  for (i = 0; i < categoryWidth; i += 1) { str += '-'; }
  str += '-+-';
  for (i = 0; i < nameWidth; i += 1) { str += '-'; }
  str += '-+-';
  for (i = 0; i < amountWidth; i += 1) { str += '-'; }
  str += '-+-';
  for (i = 0; i < descrWidth; i += 1) { str += '-'; }
  str += '-\n';
  process.stdout.write(str);
  events.forEach((event) => {
    const descr = (event.description.length <= descrWidthMax)
      ? event.description
      : `${event.description.substr(0, descrWidthMax - 3)}...`;
    str = printf(
      ` %${idWidth}s | %s | %-${categoryWidth}s | %-${nameWidth}s | %${amountWidth}s | %s\n`,
      event.id.toString(), event.date, event.category, event.name, event.amount.toString(), descr,
    );
    process.stdout.write(str);
  });
  process.stdout.write(`(${events.length} rows)\n\n`);
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

const printReport = (events) => {
  let total = 0;
  events.forEach((event) => { total += event.amount; });
  const totalWidth = Math.max(6, total.toString().length);
  let i;
  let str;
  str = printf(` %${totalWidth}s\n`, 'total:');
  process.stdout.write(str);
  str = '-';
  for (i = 0; i < totalWidth; i += 1) { str += '-'; }
  str += '-\n';
  process.stdout.write(str);
  str = printf(` %${totalWidth}s\n`, total.toString());
  process.stdout.write(str);
  process.stdout.write('(1 row)\n\n');
};

const printChanges = (id, changes) => {
  if (Object.keys(changes).length) {
    const str = `\nabout to update the event (${id}) with the following changes:\n${JSON.stringify(changes, null, 2)}\n\n`;
    process.stdout.write(str);
    return dialogStates.editEvent;
  }
  process.stdout.write('\nthere is no change for given hw item then\n\n');
  return dialogStates.init;
};

const questions = {
  [dialogStates.init]: {
    text: '[main] (s)how education events, (c)reate edu. event, (e)dit edu. event, show overall (r)eport, or (q)uit (S/c/e/r/q)',
    handlers: [
      {
        match: /^[q]$/i,
        code: () => dialogStates.end,
      },
      {
        match: /^[s]{0,1}$/i,
        code: () => dialogStates.showMain,
      },
      {
        match: /^[c]$/i,
        code: () => dialogStates.createCategory,
      },
      {
        match: /^[e]$/i,
        code: () => dialogStates.editId,
      },
      {
        match: /^[r]$/i,
        code: (context) => {
          context.reportOptions = {};
          return dialogStates.reportFrom;
        },
      },
    ],
  },

  [dialogStates.showMain]: {
    text: '[show] list (a)ll events, for selected (u)ser, for selected (c)ategory, or go (b)ack? (A/u/c/b)',
    handlers: [
      {
        match: /^[b]$/i,
        code: () => dialogStates.init,
      },
      {
        match: /^[a]{0,1}$/i,
        code: async (context) => {
          const events = await context.dbQuery.getEduEvents();
          if (!events) { return dialogStates.init; }
          printEvents(events);
          return dialogStates.init;
        },
      },
      {
        match: /^[u]$/i,
        code: () => dialogStates.showUserId,
      },
      {
        match: /^[c]$/i,
        code: () => dialogStates.showCategoryId,
      },
    ],
  },

  [dialogStates.showUserId]: {
    text: '[show] enter user id, (l)ist existing users, or go (b)ack (<number>/L/b)',
    handlers: [
      {
        match: /^\d+$/,
        code: async (context, answer) => {
          const events = await context.dbQuery.getEduEvents({ usedId: parseInt(answer, 10) });
          if (!events) { return dialogStates.init; }
          printEvents(events);
          return dialogStates.init;
        },
      },
      {
        match: /^[l]{0,1}$/i,
        code: async (context) => {
          const users = await context.dbQuery.getUsers();
          if (!users) { return dialogStates.init; }
          printUsers(users);
          return dialogStates.showUserId;
        },
      },
      {
        match: /^[b]$/i,
        code: () => dialogStates.init,
      },
    ],
  },

  [dialogStates.showCategoryId]: {
    text: '[show] enter category id, (l)ist existing categories, or go (b)ack (<number>/L/b)',
    handlers: [
      {
        match: /^\d+$/,
        code: async (context, answer) => {
          const events = await context.dbQuery.getEduEvents({ categoryId: parseInt(answer, 10) });
          if (!events) { return dialogStates.init; }
          printEvents(events);
          return dialogStates.init;
        },
      },
      {
        match: /^[l]{0,1}$/i,
        code: async (context) => {
          const categories = await context.dbQuery.getEduCategories();
          if (!categories) { return dialogStates.init; }
          printCategories(categories);
          return dialogStates.showCategoryId;
        },
      },
      {
        match: /^[b]$/i,
        code: () => dialogStates.init,
      },
    ],
  },

  [dialogStates.createCategory]: {
    text: '[create] enter category id, (l)ist existing categories, (c)reate new category, or go (b)ack (<number>/L/c/b)',
    handlers: [
      {
        match: /^\d+$/,
        code: async (context, answer) => {
          const id = parseInt(answer, 10);
          const category = await context.dbQuery.getEduCategory(id);
          if (category === null) { return dialogStates.init; }
          if (category === 0) {
            process.stdout.write(`\ncategory with id (${id}) not found!\n\n`);
            return dialogStates.init;
          }
          context.newEvent = {
            categoryId: id,
            categoryName: category.category,
          };
          return dialogStates.createDescription;
        },
      },
      {
        match: /^[l]{0,1}$/i,
        code: async (context) => {
          const categories = await context.dbQuery.getEduCategories();
          if (!categories) { return dialogStates.init; }
          printCategories(categories);
          return dialogStates.createCategory;
        },
      },
      {
        match: /^[c]$/i,
        code: () => dialogStates.createCreateCategoryName,
      },
      {
        match: /^[b]$/i,
        code: () => dialogStates.init,
      },
    ],
  },

  [dialogStates.createCreateCategoryName]: {
    text: '[create] enter (non-empty) name of the new category',
    handlers: [
      {
        match: /^\S.*\S$/,
        code: (context, answer) => {
          context.newCategory = { category: answer };
          const str = `\nabout to create the following category:\n${JSON.stringify(context.newCategory, null, 2)}\n\n`;
          process.stdout.write(str);
          return dialogStates.createCreateCategory;
        },
      },
    ],
  },

  [dialogStates.createCreateCategory]: {
    text: '[create] do you want to proceed? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          const id = await context.dbQuery.createEduCategory(context.newCategory);
          if (!id) {
            context.newCategory = undefined;
            return dialogStates.createCategory;
          }
          process.stdout.write(`\nnew category with id (${id}) successfully created\n\n`);
          context.newEvent = {
            categoryId: id,
            categoryName: context.newCategory.category,
          };
          context.newCategory = undefined;
          return dialogStates.createDescription;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: () => dialogStates.createCategory,
      },
    ],
  },

  [dialogStates.createDescription]: {
    text: '[create] enter (non-empty) event description',
    handlers: [
      {
        match: /^\S.*\S$/,
        code: (context, answer) => {
          const str = answer.trim();
          context.newEvent.description = str;
          return dialogStates.createAmount;
        },
      },
    ],
  },

  [dialogStates.createAmount]: {
    text: '[create] enter (non-empty) expense amount',
    handlers: [
      {
        match: /^\d+$/,
        code: (context, answer) => {
          context.newEvent.amount = parseInt(answer, 10);
          return dialogStates.createUserId;
        },
      },
    ],
  },

  [dialogStates.createUserId]: {
    text: '[create] enter user id, (l)ist existing users, or go (b)ack (<number>/L/b)',
    handlers: [
      {
        match: /^\d+$/,
        code: async (context, answer) => {
          const id = parseInt(answer, 10);
          context.newEvent.userId = id;
          const user = await context.dbQuery.getUser(id);
          if (user === null) { return dialogStates.init; }
          if (user === 0) {
            process.stdout.write(`\nuser with id (${id}) not found!\n\n`);
            return dialogStates.init;
          }
          context.newEvent.userName = user.name;
          context.newEvent.date = (new Date()).toISOString().substr(0, 10);
          questions[dialogStates.createDate].text = `[create] enter purchase date (in YYYY-MM-DD format, press enter for "${context.newEvent.date}")`;
          return dialogStates.createDate;
        },
      },
      {
        match: /^[l]{0,1}$/i,
        code: async (context) => {
          const users = await context.dbQuery.getUsers();
          if (!users) { return dialogStates.init; }
          printUsers(users);
          return dialogStates.createUserId;
        },
      },
      {
        match: /^[b]$/i,
        code: () => dialogStates.init,
      },
    ],
  },

  [dialogStates.createDate]: {
    text: '<replaced from [dialogStates.createUserId], handler <num>>',
    handlers: [
      {
        match: /^$/,
        code: () => dialogStates.createInvoiceId,
      },
      {
        match: /^20\d{2}-\d{2}-\d{2}$/,
        code: (context, answer) => {
          context.newEvent.date = answer;
          return dialogStates.createInvoiceId;
        },
      },
    ],
  },

  [dialogStates.createInvoiceId]: {
    text: '[create] enter invoice id (string, press enter to skip)',
    handlers: [
      {
        match: /.*/,
        code: (context, answer) => {
          const str = answer.trim();
          context.newEvent.invoiceId = (str === '' ? null : str);
          const text = `\nabout to create the following event:\n${JSON.stringify(context.newEvent, null, 2)}\n\n`;
          process.stdout.write(text);
          return dialogStates.createEvent;
        },
      },
    ],
  },

  [dialogStates.createEvent]: {
    text: '[create] do you want to proceed? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          const id = await context.dbQuery.createEduEvent(context.newEvent);
          if (id) {
            process.stdout.write(`\nnew education event with id (${id}) successfully created\n\n`);
          }
          context.newEvent = undefined;
          return dialogStates.init;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: (context) => {
          context.newEvent = undefined;
          return dialogStates.init;
        },
      },
    ],
  },

  [dialogStates.editId]: {
    text: '[edit] enter event id to edit, or go (b)ack (<number>/B)',
    handlers: [
      {
        match: /^\d+$/,
        code: async (context, answer) => {
          const id = parseInt(answer, 10);
          const event = await context.dbQuery.getEduDetails(id);
          if (!event) { return dialogStates.init; }
          context.editId = id;
          event.id = undefined;
          context.editEvent = event;
          process.stdout.write(`\nediting education event:\n${JSON.stringify(event, null, 2)}\n\n`);
          context.changes = {};
          return dialogStates.editCategory;
        },
      },
      {
        match: /^[b]{0,1}$/i,
        code: () => dialogStates.init,
      },
    ],
  },

  [dialogStates.editCategory]: {
    text: '[edit] enter category id, (l)ist existing categories, (c)reate new category, or go (b)ack\n'
      + '(<number>/l/c/b, press enter to keep the original value)',
    handlers: [
      {
        match: /^\d*$/,
        code: (context, answer) => {
          const newCateg = (answer === '' ? context.editEvent.category_id : parseInt(answer, 10));
          if (newCateg !== context.editEvent.category_id) { context.changes.category = newCateg; }
          return dialogStates.editDescription;
        },
      },
      {
        match: /^[l]$/i,
        code: async (context) => {
          const categories = await context.dbQuery.getEduCategories();
          if (!categories) { return dialogStates.init; }
          printCategories(categories);
          return dialogStates.editCategory;
        },
      },
      {
        match: /^[c]$/i,
        code: () => dialogStates.editCreateCategoryName,
      },
      {
        match: /^[b]$/i,
        code: () => dialogStates.init,
      },
    ],
  },

  [dialogStates.editCreateCategoryName]: {
    text: '[edit] enter (non-empty) name of the new category',
    handlers: [
      {
        match: /^\S.*\S$/,
        code: (context, answer) => {
          context.newCategory = { category: answer };
          const str = `\nabout to create the following category:\n${JSON.stringify(context.newCategory, null, 2)}\n\n`;
          process.stdout.write(str);
          return dialogStates.editCreateCategory;
        },
      },
    ],
  },

  [dialogStates.editCreateCategory]: {
    text: '[edit] do you want to proceed? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          const id = await context.dbQuery.createEduCategory(context.newCategory);
          context.newCategory = undefined;
          if (!id) { return dialogStates.editCategory; }
          process.stdout.write(`\nnew category with id (${id}) successfully created\n\n`);
          context.changes.category = id;
          return dialogStates.editDescription;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: () => dialogStates.editCategory,
      },
    ],
  },

  [dialogStates.editDescription]: {
    text: '[edit] enter event description (press enter to keep original value)',
    handlers: [
      {
        match: /.*/,
        code: (context, answer) => {
          const str = (answer === '' ? context.editEvent.description : answer.trim());
          if (str !== context.editEvent.description) { context.changes.description = str; }
          return dialogStates.editInvoiceId;
        },
      },
    ],
  },

  [dialogStates.editInvoiceId]: {
    text: '[edit] enter invoice id (string, press enter to keep the original value)',
    handlers: [
      {
        match: /.*/,
        code: (context, answer) => {
          let str = (answer === '' ? context.editEvent.invoice_id : answer.trim());
          if (str === '') { str = null; }
          if (str !== context.editEvent.invoice_id) { context.changes.invoice_id = str; }
          return printChanges(context.editId, context.changes);
        },
      },
    ],
  },

  [dialogStates.editEvent]: {
    text: '[edit] do you want to proceed? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          const id = await context.dbQuery.updateEduEvent(context.editId, context.changes);
          if (id) {
            process.stdout.write(`\nevent with id (${id}) successfully updated\n\n`);
          }
          context.editId = undefined;
          context.editEvent = undefined;
          return dialogStates.init;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: () => dialogStates.init,
      },
    ],
  },

  [dialogStates.reportFrom]: {
    text: '[report] enter report start date (in YYYY-MM-DD format, press enter for no start date)',
    handlers: [
      {
        match: /^$/,
        code: () => dialogStates.reportTo,
      },
      {
        match: /^20\d{2}-\d{2}-\d{2}$/,
        code: (context, answer) => {
          context.reportOptions.from = answer;
          return dialogStates.reportTo;
        },
      },
    ],
  },

  [dialogStates.reportTo]: {
    text: '[report] enter report end date (in YYYY-MM-DD format, press enter for no end date)',
    handlers: [
      {
        match: /^$/,
        code: () => dialogStates.reportList,
      },
      {
        match: /^20\d{2}-\d{2}-\d{2}$/,
        code: (context, answer) => {
          context.reportOptions.to = answer;
          return dialogStates.reportList;
        },
      },
    ],
  },

  [dialogStates.reportList]: {
    text: '[report] list all events? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          const events = await context.dbQuery.getEduEvents({
            fromDate: context.reportOptions.from,
            toDate: context.reportOptions.to,
          });
          context.reportOptions = undefined;
          if (!events) { return dialogStates.init; }
          printEvents(events);
          printReport(events);
          return dialogStates.init;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: async (context) => {
          const events = await context.dbQuery.getEduEvents({
            fromDate: context.reportOptions.from,
            toDate: context.reportOptions.to,
          });
          context.reportOptions = undefined;
          if (!events) { return dialogStates.init; }
          printReport(events);
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
