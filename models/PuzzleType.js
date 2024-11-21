const mongoose = require('mongoose');
const { connectDBs } = require('../config/db')

const Mixed = mongoose.Schema.Types.Mixed;

const PuzzleTypeSchema = new mongoose.Schema({
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
  rules: {
    type: String,
    required: true
  },
  gridControl: {
    type: String,
    required: false
  },
  puzzleJs: {
    type: String,
    required: true
  },
  puzzleObj: {
    type: String,
    required: true
  },
  translations: {
    type: Mixed,
    required: false
  },
  example: {
    puzzleId: {
      type: String,
      required: false
    },
  },
  category: {
    type: String,
    required: true
  },
  properties: {
    type: Mixed,
    required: false
  },
});

const { db, logDb } = connectDBs()

const PuzzleType = db.model('PuzzleType', PuzzleTypeSchema);

module.exports = PuzzleType;
