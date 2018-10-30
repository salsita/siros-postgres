const formatError = (err) => {
  let message = 'SERVER ERROR';
  if (err.name) { message += ` [${err.name}]`; }
  message += `:
  * message: ${err.message || '<not provided>'}
  * stack: `;
  if (err.stack) {
    err.stack.split('\n').forEach((frame, idx) => {
      if (idx) { message += `\n    + ${frame.trim()}`; }
    });
  } else {
    message += '<not provided>';
  }
  return message;
};

class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class DbError extends CustomError { }

module.exports = {
  formatError,
  CustomError,
  DbError,
};
