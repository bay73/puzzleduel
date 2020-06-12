const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;

const ContestSchema = new mongoose.Schema({
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
  type: {
    type: String,
    required: false
  },
  start: {
    type: Date,
    required: true
  },
  finish: {
    type: Date,
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
    revealDate: {
      type: Date,
      required: true
    },
    results: [{
      userId: {
        type: ObjectId,
        required: true
      },
      score: {
        type: Number,
        required: true
      }
    }],
    details: {
      type: Mixed,
      required: false
    }
  }],
  results: [{
    userId: {
      type: ObjectId,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    }
  }],
});

const Contest = mongoose.model('Contest', ContestSchema);

module.exports = Contest;
