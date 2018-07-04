const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const readAnswer = (question) => new Promise((resolve) => {
  rl.question(`${question}\n> `, (answer) => {
    resolve(answer);
  });
});

const findHandler = (answer, handlers) => {
  for (let i = 0; i < handlers.length; i += 1) {
    if (handlers[i].match.test(answer)) { return handlers[i].code; }
  }
  return null;
};

module.exports = {
  readAnswer,
  findHandler,
};
