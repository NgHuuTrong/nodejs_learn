const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.post(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.createCheckoutSession
);

router.get(
  '/',
  authController.protect,
  authController.restrictTo('admin'),
  bookingController.getAllBookings
);

router.get(
  '/:id',
  authController.protect,
  authController.restrictTo('admin'),
  bookingController.getBooking
);

module.exports = router;
