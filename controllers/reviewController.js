const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes (review on tour)
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  next();
};
exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);

exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);

exports.checkBookedBefore = catchAsync(async (req, res, next) => {
  const booking = await Booking.find({
    tour: req.body.tour,
    user: req.body.user,
  });

  if (booking.length === 0) {
    return next(
      new AppError('You must book this tour to review and rate it!', 401)
    );
  }
  next();
});

exports.checkReviewBefore = catchAsync(async (req, res, next) => {
  const review = await Review.find({
    tour: req.body.tour,
    user: req.user.id,
  });

  if (review.length > 0) {
    return next(new AppError('You have reviewed and rated it before!', 401));
  }
  next();
});
