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
  logo: {
    type: String,
    required: false
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
  author: {
    type: ObjectId,
    required: false
  },
  scoring: {
    type: Mixed,
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
    closeDate: {
      type: Date,
      required: false
    },
    results: [{
      userId: {
        type: ObjectId,
        required: true
      },
      score: {
        type: Number,
        required: true
      },
      time: {
        type: Number,
        required: false
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
    },
    solvedCount:  {
      type: Number,
      required: false
    },
    totalTime:  {
      type: Number,
      required: false
    },
    errCount:  {
      type: Number,
      required: false
    },
    tiebreakScore: {
      type: Number,
      required: false
    },
    started: {
      type: Boolean,
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
    },
  }],
  seedData: {
    type: Mixed,
    required: false
  }
});

const Contest = mongoose.model('Contest', ContestSchema);

module.exports = Contest;
