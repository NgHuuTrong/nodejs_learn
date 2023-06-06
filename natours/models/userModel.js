const mongoose = require('mongoose');
const validator = require('validator');
const bscypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    require: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    require: [true, 'Please provide us your email!'],
    unique: true,
    validate: [validator.isEmail, 'This email is invalid'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    require: [true, 'Please provide password'],
    minlength: [8, 'Password must have more than 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    require: [true, 'Please confirm your password'],
    validate: {
      // This  only works on CREATE and SAVE!!! (not update)
      validator: function (ele) {
        return ele === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  // Only run this function if the password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bscypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bscypt.compare(candidatePassword, userPassword);
};

// If password has been changed after the token issued, return true
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt / 1000, 10);
    return changedTimestamp > JWTTimestamp;
  }

  // False means not changed
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
