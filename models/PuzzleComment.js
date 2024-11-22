const mongoose = require('mongoose');
const { connectDBs } = require('../config/db')

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
    required: true,
    index: true
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
  },
  receiver:  {
    type: ObjectId,
    required: false,
    index: true
  }
});

PuzzleCommentSchema.index({userId: 1, puzzleId: 1})

const { dataDb } = connectDBs()

const PuzzleComment = dataDb.model('PuzzleComment', PuzzleCommentSchema);

module.exports = PuzzleComment;
