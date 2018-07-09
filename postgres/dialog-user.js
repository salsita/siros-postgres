const printf = require('printf');

const dialogStates = {
  init: 1,
  end: 2,
  createUserName: 3,
  createUserSystem: 4,
  createUserStartDate: 5,
  createUserActive: 6,
  createUserPartTime: 7,
  createUser: 8,
};

const questions = {
  [dialogStates.init]: {
    text: '(s)how existing users, (c)reate a new user, (e)dit an existing user, or (q)uit? (S/c/e/q)',
    handlers: [
      {
        match: /^[s]{0,1}$/i,
        code: async (context) => {
          const users = await context.dbQuery.getUsers();
          if (users === null) { return dialogStates.init; }
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
          let str = printf(` %${idWidth}s | S | A | name:\n`, 'id:');
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
          return dialogStates.init;
        },
      },
      {
        match: /^[c]$/i,
        code: () => dialogStates.createUserName,
      },
      {
        match: /^[e]$/i,
        code: () => dialogStates.init,
      },
      {
        match: /^[q]$/i,
        code: () => dialogStates.end,
      },
    ],
  },

  [dialogStates.createUserName]: {
    text: 'enter (non-empty) name of the new user',
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
    text: 'system user? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: (context) => {
          context.newUser.system = true;
          context.newUser.active = null;
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
          questions[dialogStates.createUserStartDate].text = `start date (in YYYY-MM-DD format, press enter for ${context.newUser.start_date})`;
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
    text: 'active user? (Y/n)',
    handlers: [
      {
        match: /^[y]{0,1}$/i,
        code: (context) => {
          context.newUser.active = true;
          return dialogStates.createUserPartTime;
        },
      },
      {
        match: /^[n]$/i,
        code: (context) => {
          context.newUser.active = false;
          return dialogStates.createUserPartTime;
        },
      },
    ],
  },

  [dialogStates.createUserPartTime]: {
    text: 'part time? (y/N)',
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
    text: 'do you want to proceed? (y/N)',
    handlers: [
      {
        match: /^[y]$/i,
        code: async (context) => {
          const id = await context.dbQuery.createUser(context.newUser);
          if (id !== null) {
            process.stdout.write(`\nnew user with id (${id}) successfully created\n\n`);
          }
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
