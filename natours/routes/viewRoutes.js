const express = require('express');

const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedin);

router.get('/', viewController.getOverview);

router.get('/tour/:tourSlug', viewController.getTour);

router.get('/login', viewController.getLoginForm);

module.exports = router;
