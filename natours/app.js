const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSantitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1. GLOBAL MIDDLEWARE

// Serving statis files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet()); // use as the first of all middlewares

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
// Example: Login without email, only correct password: { "email": { "$gt": "" } }
app.use(mongoSantitize());

// Data sanitization against XSS (cross-site scripting attacks)
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2. ROUTE HANDLERS: split files

// 3. ROUTES: import from external files
app.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'The Forest Hiker',
    user: 'nghuutrong',
  });
});

app.get('/overview', (req, res) => {
  res.status(200).render('overview', {
    title: 'All tours',
  });
});

app.get('/tour', (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
  });
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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
