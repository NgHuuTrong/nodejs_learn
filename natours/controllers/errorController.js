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

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥:', err.name);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (err.name === 'CastError') error = handleCastErrorDB(error); // Invalid format (id, name...)
    if (err.code === 11000) error = handleDuplicateFieldsDB(error); // Duplicate unique fields
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error); // Validation Errors

    sendErrorProd(error, res);
  }
};
