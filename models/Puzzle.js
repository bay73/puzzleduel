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

PuzzleSchema.virtual('needLogging').get(function() {
  var d = new Date();
  d.setDate(d.getDate()-5);
  return !this.daily || this.daily > d
});

PuzzleSchema.virtual('hidden').get(function() {
  var d = new Date();
  return this.daily && this.daily > d
});

const Puzzle = mongoose.model('Puzzle', PuzzleSchema);

module.exports = Puzzle;
