const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;

const LeagueSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  finish: {
    type: Date,
    required: false
  },
  results: [{
    userId: {
      type: ObjectId,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    solvedCount:  {
      type: Number,
      required: false
    },
    totalSolvedCount:  {
      type: Number,
      required: false
    },
    totalTime:  {
      type: Number,
      required: false
    }
  }],
  participants: [{
    userId: {
      type: ObjectId,
      required: true
    },
    userName: {
      type: String,
      required: true
    }
  }]
});

const League = mongoose.model('League', LeagueSchema);

module.exports = League;
