const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    default: 'regular'
  },
  resetToken: {
    type: String,
    required: false
  },
  resetExpire: {
    type: Date,
    required: false
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
