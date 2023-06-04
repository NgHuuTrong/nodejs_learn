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
  password: {
    type: String,
    require: [true, 'Please provide password'],
    minlength: [8, 'Password must have more than 8 characters'],
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
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bscypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
