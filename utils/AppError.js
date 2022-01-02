class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // set error message property

    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor); // constructor function call will not appear in the error stacktrace callstack
  }
}

module.exports = AppError;
