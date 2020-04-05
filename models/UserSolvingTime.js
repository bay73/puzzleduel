const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSolvingTimeSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  puzzleId: {
    type: String,
    required: true,
    index: true
  },
  solvingTime: {
    type: Number,
    required: true
  },
  errCount: {
    type: Number,
    required: true
  },
  hidden: {
    type: Boolean,
    required: false
  }
});

UserSolvingTimeSchema.index({userId: 1, puzzleId: 1}, {unique: true})

const UserSolvingTime = mongoose.model('UserSolvingTime', UserSolvingTimeSchema);

module.exports = UserSolvingTime;
