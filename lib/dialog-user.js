const printf = require('printf');

const dialogStates = {
  init: 1,
  end: 2,

  createUserName: 3,
  createUserSystem: 4,
  createUserStartDate: 5,
  createUserActive: 6,
  createUserEmail: 7,
  createUserPartTime: 8,
  createUser: 9,

  editUserId: 10,
  editUserName: 11,
  editUserSystem: 12,
  editUserStartDate: 13,
  editUserActive: 14,
  editUserEmail: 15,
  editUserPartTime: 16,
  editUser: 17,
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
  let str = printf(` %-${idWidth}s | S | A | P | name:\n`, 'id:');
  process.stdout.write(str);
  str = '-';
  for (i = 0; i < idWidth; i += 1) { str += '-'; }
  str += '-+---+---+---+-';
  for (i = 0; i < nameWidth; i += 1) { str += '-'; }
  str += '-\n';
  process.stdout.write(str);
  users.forEach((user) => {
    str = printf(` %${idWidth}s | ${user.system === true ? 'x' : ' '} | ${user.active === true ? 'x' : ' '} | ${user.part_time === true ? 'x' : ' '} | %s\n`, user.id, user.name);
    process.stdout.write(str);
  });
  process.stdout.write(`(${users.length} rows)\n\n`);
};

const printChanges = (id, changes) => {
  if (Object.keys(changes).length) {
    const str = `\nabout to update the user (${id}) with the following changes:\n${JSON.stringify(changes, null, 2)}\n\n`;
    process.stdout.write(str);
    return dialogStates.editUser;
  }
  process.stdout.write('\nthere is no change for given user then\n\n');
  return dialogStates.init;
};

const questions = {
  [dialogStates.init]: {
    text: '[main] (l)ist existing users, (c)reate new user, (e)dit existing user, or (q)uit? (L/c/e/q)',
    handlers: [
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
        match: /^[c]$/i,
        code: () => dialogStates.createUserName,
      },
      {
        match: /^[e]$/i,
        code: () => dialogStates.editUserId,
      },
      {
        match: /^[q]$/i,
        code: () => dialogStates.end,
      },
    ],
  },

  [dialogStates.createUserName]: {
    text: '[create user] enter (non-empty) name of the new user',
    handlers: [
      {
        match: /^\S.*\S$/,
        code: (context, answer) => {
          context.newUser = { name: answer };
          return dialogStates.createUserSystem;
        },
      },
    ],
  },

  [dialogStates.createUserSystem]: {
    text: '[create user] system user? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: (context) => {
          context.newUser.system = true;
          context.newUser.active = null;
          context.newUser.email = null;
          context.newUser.start_date = null;
          context.newUser.part_time = null;
          const str = `\nabout to create the following user:\n${JSON.stringify(context.newUser, null, 2)}\n\n`;
          process.stdout.write(str);
          return dialogStates.createUser;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: (context) => {
          context.newUser.system = false;
          context.newUser.start_date = (new Date()).toISOString().substr(0, 10);
          questions[dialogStates.createUserStartDate].text = `[create user] start date (in YYYY-MM-DD format, press enter for "${context.newUser.start_date}")`;
          return dialogStates.createUserStartDate;
        },
      },
    ],
  },

  [dialogStates.createUserStartDate]: {
    text: '<replaced from [dialogStates.createUserSystem], handler "n">',
    handlers: [
      {
        match: /^$/,
        code: () => dialogStates.createUserActive,
      },
      {
        match: /^20\d{2}-\d{2}-\d{2}$/,
        code: (context, answer) => {
          context.newUser.start_date = answer;
          return dialogStates.createUserActive;
        },
      },
    ],
  },

  [dialogStates.createUserActive]: {
    text: '[create user] active user? (Y/n)',
    handlers: [
      {
        match: /^[y]{0,1}$/i,
        code: (context) => {
          context.newUser.active = true;
          return dialogStates.createUserEmail;
        },
      },
      {
        match: /^[n]$/i,
        code: (context) => {
          context.newUser.active = false;
          context.newUser.email = null;
          return dialogStates.createUserPartTime;
        },
      },
    ],
  },

  [dialogStates.createUserEmail]: {
    text: '[create user] enter (non-empty) email of the new user',
    handlers: [
      {
        match: /^\S+$/,
        code: (context, answer) => {
          context.newUser.email = answer;
          return dialogStates.createUserPartTime;
        },
      },
    ],
  },

  [dialogStates.createUserPartTime]: {
    text: '[create user] part time? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: (context) => {
          context.newUser.part_time = true;
          const str = `\nabout to create the following user:\n${JSON.stringify(context.newUser, null, 2)}\n\n`;
          process.stdout.write(str);
          return dialogStates.createUser;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: (context) => {
          context.newUser.part_time = false;
          const str = `\nabout to create the following user:\n${JSON.stringify(context.newUser, null, 2)}\n\n`;
          process.stdout.write(str);
          return dialogStates.createUser;
        },
      },
    ],
  },

  [dialogStates.createUser]: {
    text: '[create user] do you want to proceed? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          const id = await context.dbQuery.createUser(context.newUser);
          if (id) {
            process.stdout.write(`\nnew user with id (${id}) successfully created\n\n`);
          }
          context.newUser = undefined;
          return dialogStates.init;
        },
      },
      {
        match: /^[n]{0,1}$/i,
        code: () => dialogStates.init,
      },
    ],
  },


  [dialogStates.editUserId]: {
    text: '[edit user] enter user id to edit, (l)ist existing users, or go (b)ack (<number>/L/b)',
    handlers: [
      {
        match: /^[l]{0,1}$/i,
        code: async (context) => {
          const users = await context.dbQuery.getUsers();
          if (!users) { return dialogStates.init; }
          printUsers(users);
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
          questions[dialogStates.editUserName].text = `[edit user] edit name of the user (press enter for "${user.name}")`;
          questions[dialogStates.editUserSystem].text = `[edit user] system user? ${context.userData.system ? '(Y/n)' : '(y/N)'}`;
          context.userData.start_date_default = context.userData.start_date || (new Date()).toISOString().substr(0, 10);
          questions[dialogStates.editUserStartDate].text = `[edit user] start date (in YYYY-MM-DD format, press enter for "${context.userData.start_date_default}")`;
          context.userData.active_default = context.userData.active === null ? true : context.userData.active;
          questions[dialogStates.editUserActive].text = `[edit user] active user? ${context.userData.active_default ? '(Y/n)' : '(y/N)'}`;
          if (user.active === true) {
            questions[dialogStates.editUserEmail].text = `[edit user] edit email of the user (press enter for "${user.email}")`;
          } else {
            questions[dialogStates.editUserEmail].text = '[edit user] enter (non-empty) email of new user';
          }
          context.userData.part_time_default = context.userData.part_time === null ? false : context.userData.part_time;
          questions[dialogStates.editUserPartTime].text = `[edit user] part time? ${context.userData.part_time_default ? '(Y/n)' : '(y/N)'}`;

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
            if (context.userData.email !== null) { context.changes.email = null; }
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
          return dialogStates.editUserEmail;
        },
      },
      {
        match: /^[n]$/i,
        code: (context) => {
          if (context.userData.active !== false) {
            context.changes.active = false;
            if (context.userData.email !== null) { context.changes.email = null; }
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

  [dialogStates.editUserEmail]: {
    text: '<replaced from [dialogStates.editUserId], handler (number)>',
    handlers: [
      {
        match: /^\S+$/,
        code: (context, answer) => {
          if (context.userData.email !== answer) {
            context.changes.email = answer;
          }
          return dialogStates.editUserPartTime;
        },
      },
      {
        match: /^$/,
        code: (context) => {
          if (!context.userData.email) {
            process.stdout.write('\n! that is unfortunately invalid answer, please try again\n\n');
            return dialogStates.editUserEmail;
          }
          return dialogStates.editUserPartTime;
        },
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
    text: '[edit user] do you want to proceed? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          const id = await context.dbQuery.updateUser(context.userId, context.changes);
          if (id) {
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
