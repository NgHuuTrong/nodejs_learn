const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();
  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guide)
  const query = Tour.findOne({ slug: req.params.tourSlug });
  query.populate({ path: 'reviews', fields: 'review rating user' });
  const tour = await query;
  console.log("hello");

  if (!tour) {
    return next(new AppError('This is no tour with that name!'));
  }

  if (req.user) {
    const booking = await Booking.find({
      tour: tour.id,
      user: req.user.id,
    });

    if (booking.length === 0) {
      res.locals.isBooked = false;
    } else {
      res.locals.isBooked = true;
    }

    const review = await Review.find({
      tour: tour.id,
      user: req.user.id,
    });

    if (review.length > 0) {
      res.locals.isReviewed = true;
      res.locals.reviewed = {
        review: review[0].review,
        rating: review[0].rating,
        id: review[0].id,
      };
    } else {
      res.locals.reviewed = {};
      res.locals.isReviewed = false;
    }
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log in your account',
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up new account',
  });
};

exports.getForgotPasswordForm = (req, res) => {
  res.status(200).render('forgotPassword', {
    title: 'Forgot Password',
  });
};

exports.getResetPasswordForm = (req, res) => {
  res.status(200).render('resetPassword', {
    title: 'Reset Password',
    token: req.params.token,
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((ele) => ele.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updateUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      email: req.body.email,
      name: req.body.name,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', {
    title: 'Your account',
    user: updateUser,
  });
});
