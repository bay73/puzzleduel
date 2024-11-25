const mongoose = require('mongoose');
const { connectDBs } = require('../config/db')

const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;

const SudoqLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  puzzleDate: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  answer: {
    type: Number,
    required: true
  },
  solved: {
    type: Boolean,
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
});

const { logDb } = connectDBs()

const SudoqLog = logDb.model('SudoqLog', SudoqLogSchema);

module.exports = SudoqLog;
