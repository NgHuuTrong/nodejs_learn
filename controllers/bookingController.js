/* eslint-disable */
const paypal = require('paypal-rest-sdk');

const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

paypal.configure({
  mode: 'sandbox', //sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get Currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  const { startDateId } = req.params;

  // 2) Create checkout session
  const create_payment_json = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
      payer_info: {
        email: req.user.email,
      },
    },
    redirect_urls: {
      return_url: `${req.protocol}://${req.get('host')}/?tour=${
        req.params.tourId
      }&user=${req.user.id}&price=${tour.price}&startDateId=${startDateId}`,
      cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: `${tour.name} Tour`,
              sku: req.params.tourId,
              description: tour.summary,
              price: `${tour.price}.00`,
              currency: 'USD',
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: 'USD',
          total: `${tour.price}.00`,
        },
        description: `Payment for booking ${tour.name} Tour!`,
      },
    ],
  };

  paypal.payment.create(
    JSON.stringify(create_payment_json),
    function (error, payment) {
      if (error) {
        return new AppError(err.message);
      }
      res.status(201).json({
        status: 'success',
        data: {
          payment,
        },
      });
    }
  );
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { PayerID, paymentId, price, tour, user, startDateId } = req.query;
  if (!PayerID || !paymentId || !price || !tour || !user || !startDateId)
    return next();

  const execute_payment_json = {
    payer_id: PayerID,
  };
  paypal.payment.execute(
    paymentId,
    JSON.stringify(execute_payment_json),
    async function (error, payment) {
      if (error) {
        return next(new AppError(err.message));
      }
      await Booking.create({ tour, user, price, date: startDateId });
      res.redirect(req.originalUrl.split('?')[0]);
    }
  );
});

exports.getAllBookings = factory.getAll(Booking);

exports.getBooking = factory.getOne(Booking);

exports.createBooking = factory.createOne(Booking);

exports.updateBooking = factory.updateOne(Booking);

exports.deleteBooking = factory.deleteOne(Booking);
