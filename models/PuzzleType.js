const mongoose = require('mongoose');

const PuzzleTypeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rules: {
    type: String,
    required: true
  },
  puzzleJs: {
    type: String,
    required: true
  },
  puzzleObj: {
    type: String,
    required: true
  },
});

const PuzzleType = mongoose.model('PuzzleType', PuzzleTypeSchema);

module.exports = PuzzleType;