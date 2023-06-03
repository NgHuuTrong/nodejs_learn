const mongoose = require('mongoose');
const validator = require('validator');

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
  password: {
    type: String,
    require: [true, 'Please provide password'],
    minlength: [8, 'Password must have more than 8 characters'],
  },
  passwordConfirm: {
    type: String,
    require: [true, 'Please confirm your password'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
