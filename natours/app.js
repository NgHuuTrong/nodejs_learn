const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1. GLOBAL MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2. ROUTE HANDLERS: split files

// 3. ROUTES: import from external files

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} in this server!`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} in this server!`);
  // err.statusCode = 404;
  // err.status = 'fail';

  // next(err); // It will skip all other middleware in the stack and send the error that we passed in to our global error handling middleware

  next(new AppError(`Can't find ${req.originalUrl} in this server!`, 404)); // It will skip all other middleware in the stack and send the error that we passed in to our global error handling middleware
});

// Global handling middleware
app.use(globalErrorHandler);

module.exports = app;
