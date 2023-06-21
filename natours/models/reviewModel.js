const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    review: { type: String, required: [true, 'Review can not be empty!'] },
    rating: {
      type: Number,
      required: [true, 'A review must have a rating!'],
      min: [0, 'Rating must be larger than 0!'],
      max: [5, 'Rating must be smaller than 5!'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must belongs to a tour!'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belongs to a user!'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
