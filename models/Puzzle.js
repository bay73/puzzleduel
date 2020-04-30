const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;

const PuzzleSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: false
  },
  description: {
    type: Mixed,
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
    required: false,
  },
  author: {
    type: ObjectId,
    required: false
  }
});

PuzzleSchema.virtual('needLogging').get(function() {
  var d = new Date();
  d.setDate(d.getDate()-5);
  return !this.daily || this.daily > d
});

PuzzleSchema.virtual('hidden').get(function() {
  var d = new Date();
  if (this.daily < d) return false;
  return true;
});

PuzzleSchema.virtual('hiddenScore').get(function() {
  var d = new Date();
  if (this.daily < d) return false;
  return true;
});

PuzzleSchema.virtual('published').get(function() {
  var d = new Date();
  d.setDate(d.getDate()+2);
  return this.daily && this.daily < d
});

const Puzzle = mongoose.model('Puzzle', PuzzleSchema);

module.exports = Puzzle;
