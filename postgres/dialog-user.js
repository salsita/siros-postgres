const printf = require('printf');

const dialogStates = {
  init: 1,
  end: 2,
};

const questions = {
  [dialogStates.init]: {
    text: '(s)how existing users, (c)reate a new user, (e)dit an existing user, or (q)uit? (S/c/e/q)',
    handlers: [
      {
        match: /^[s]{0,1}$/i,
        code: async (context) => {
          const users = await context.dbQuery.getUsers();
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
        code: (context) => {
          return dialogStates.init;
        },
      },
      {
        match: /^[e]$/i,
        code: (context) => {
          return dialogStates.init;
        },
      },
      {
        match: /^[q]$/i,
        code: () => dialogStates.end,
      },
    ],
  },
};

module.exports = {
  dialogStates,
  questions,
};
