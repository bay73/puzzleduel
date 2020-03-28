const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

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
  }
});

const UserActionLog = mongoose.model('UserActionLog', UserActionLogSchema);

module.exports = UserActionLog;
