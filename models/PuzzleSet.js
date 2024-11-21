const mongoose = require('mongoose');
const { connectDBs } = require('../config/db')

const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;

const PuzzleSetSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  translations: {
    type: Mixed,
    required: false
  },
  tag: {
    type: String,
    required: false
  },
  author: {
    type: ObjectId,
    required: false
  },
  puzzles: [{
    puzzleNum: {
      type: Number,
      required: true
    },
    puzzleId: {
      type: String,
      required: true
    },
  }],
});

const { db, logDb } = connectDBs()

const PuzzleSet = db.model('PuzzleSet', PuzzleSetSchema);

module.exports = PuzzleSet;
