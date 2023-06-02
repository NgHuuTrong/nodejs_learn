class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // to distinguish with programming error or bugs in packages.

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
