const mongoose = require('mongoose');

const PuzzleSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  dimension: {
    type: String,
    required: false
  },
  data: {
    type: String,
    required: true
  },
  daily: {
    type: Date,
    required: false
  },
});

const Puzzle = mongoose.model('Puzzle', PuzzleSchema);

module.exports = Puzzle;
