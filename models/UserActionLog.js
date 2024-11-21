const mongoose = require('mongoose');
const { connectDBs } = require('../config/db')

const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;

const UserActionLogSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    required: true
  },
  puzzleId: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  data: {
    type: String,
    required: false
  },
  ipInfo: {
    type: Mixed,
    required: false
  }
});

UserActionLogSchema.index({userId: 1, puzzleId: 1})

const { db, logDb } = connectDBs()

const UserActionLog = logDb.model('UserActionLog', UserActionLogSchema);

module.exports = UserActionLog;
