const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const dupProp = Object.getOwnPropertyNames(err.keyValue);
  const message = `Duplicate "${dupProp}": ${err.keyValue[dupProp]}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const messages = Object.values(err.errors).map((ele) => ele.message);
  const message = `Invalid input data: ${messages.join('; ')}`;
  return new AppError(message, 400);
};

const handleJWTInvalidTokenError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredToken = () =>
  new AppError('Your token has expired. Please log in again!', 401);

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // Rendered page
  console.error('ERROR 💥:', err.message);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

      // Programming or other unknown error: don't leak error details
    }
    // 1) Log error
    console.error('ERROR 💥:', err.message);
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
  // Rendered page
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });

    // Programming or other unknown error: don't leak error details
  }
  // 1) Log error
  console.error('ERROR 💥:', err.message);
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') error = handleCastErrorDB(error); // Invalid format (id, name...)
    if (err.code === 11000) error = handleDuplicateFieldsDB(error); // Duplicate unique fields
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error); // Validation Errors

    if (err.name === 'JsonWebTokenError') error = handleJWTInvalidTokenError(); // JWT Invalid Token Error
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredToken(); // JWT Expired Token

    sendErrorProd(error, req, res);
  }
};
