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
  },
  data: {
    type: String,
    required: false
  }
});

UserActionLogSchema.index({userId: 1, puzzleId: 1})

const UserActionLog = mongoose.model('UserActionLog', UserActionLogSchema);

module.exports = UserActionLog;
