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

router.get('/me', authController.isLoggedin, viewController.getAccount);

module.exports = router;
