const mongoose = require('mongoose');
const Tour = require('./tourModel');
const AppError = require('../utils/appError');

const bookingSchema = mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'A booking must belong to a Tour!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A booking must belong to a User!'],
  },
  date: {
    type: mongoose.Schema.ObjectId,
    require: [true, 'Please give me exactly date you book!'],
  },
  price: {
    type: Number,
    required: [true, 'A booking must have a price!'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });
  next();
});

bookingSchema.pre('save', async function (next) {
  const tour = await Tour.findById(this.tour);
  const startDate = tour.startDates.id(this.date);

  // If there is a maximum number of participants, throw an error.
  if (startDate.participants >= startDate.maxParticipants)
    return next(
      new AppError(
        'Sorry, but this tour has a maximum number of participants already. Please book another date.'
      )
    );

  startDate.participants += 1;
  await tour.save();
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
