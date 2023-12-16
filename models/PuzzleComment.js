const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const PuzzleCommentSchema = new mongoose.Schema({
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
    required: true
  },
  rating: {
    type: Number,
    required: false
  },
  comment: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  replyTo:  {
    type: ObjectId,
    required: false
  }
});

PuzzleCommentSchema.index({userId: 1, puzzleId: 1})

const PuzzleComment = mongoose.model('PuzzleComment', PuzzleCommentSchema);

module.exports = PuzzleComment;
