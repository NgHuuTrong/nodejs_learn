const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.post(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.createCheckoutSession
);

// router.get(
//   '/generate-client-token',
//   authController.protect,
//   bookingController.generateClientToken
// );

// router.post(
//   '/process-checkout/:tourId',
//   authController.protect,
//   bookingController.processCheckout
// );

module.exports = router;
