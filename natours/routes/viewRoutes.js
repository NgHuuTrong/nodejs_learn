const express = require('express');

const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedin, viewController.getOverview);

router.get(
  '/tour/:tourSlug',
  authController.isLoggedin,
  viewController.getTour
);

router.get('/login', authController.isLoggedin, viewController.getLoginForm);

router.get('/me', authController.protect, viewController.getAccount);

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

module.exports = router;
