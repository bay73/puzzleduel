const mongoose = require('mongoose');
const { connectDBs } = require('../config/db')

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
  createdAt: {
    type: Date,
    required: false,
  },
  daily: {
    type: Date,
    required: false,
  },
  contest: {
    contestId: {
      type: String,
      required: false,
      index: true,
    },
    puzzleDate: {
      type: Date,
      required: false,
    },
  },
  author: {
    type: ObjectId,
    required: false
  },
  difficulty: {
    type: Number,
    required: false
  },
  rating: {
    rating: {
      type: Number,
      required: false
    },
    count: {
      type: Number,
      required: false
    },
  },
  comment: {
      type: String,
      required: false
  }
});

PuzzleSchema.virtual('changeDate').get(function() {
  if (!this.tag) return null;
  var date = null;
  if (this.tag.includes("daily")) {
    date = new Date(this.daily);
  } else if (this.tag.includes("contest")) {
    if (this.contest && this.contest.puzzleDate) {
      date = new Date(this.contest.puzzleDate);
    }
  }
  if (date && date <= new Date()) {
    date.setDate(date.getDate()+5);
  }
  return date;
});

PuzzleSchema.virtual('needLogging').get(function() {
  if (!this.tag) return true;
  if (this.tag.includes("daily")) {
    var d = new Date();
    d.setDate(d.getDate()-5);
    return !this.daily || this.daily > d
  } else if (this.tag.includes("contest")) {
    if (this.contest && this.contest.puzzleDate) {
      var d = new Date();
      d.setDate(d.getDate()-5);
      return this.contest.puzzleDate > d;
    }
  } else if (this.tag.includes("example")) {
    return false;
  } else if (this.tag.includes("public")) {
    return false;
  }
  return true;
});

PuzzleSchema.virtual('publishDate').get(function() {
  if (!this.tag) return null;
  if (this.tag.includes("daily")) {
    return this.daily;
  } else if (this.tag.includes("contest")) {
    if (this.contest && this.contest.puzzleDate) {
      return this.contest.puzzleDate;
    }
  }
  return null;
});

PuzzleSchema.virtual('hidden').get(function() {
  if (!this.tag) return true;
  if (this.tag.includes("daily")) {
    var d = new Date();
    if (this.daily < d) return false;
  } else if (this.tag.includes("contest")) {
    if (this.contest && this.contest.puzzleDate) {
      var d = new Date();
      return this.contest.puzzleDate > d;
    }
  } else if (this.tag.includes("example")) {
    return false;
  } else if (this.tag.includes("public")) {
    return false;
  }
  return true;
});

PuzzleSchema.virtual('hiddenScore').get(function() {
  if (!this.tag) return true;
  if (this.tag.includes("daily")) {
    var d = new Date();
    if (this.daily < d) return false;
  } else if (this.tag.includes("contest")) {
    if (this.contest && this.contest.puzzleDate) {
      var d = new Date();
      return this.contest.puzzleDate > d;
    }
  } else if (this.tag.includes("example")) {
    return false;
  } else if (this.tag.includes("public")) {
    return false;
  }
  return true;
});

PuzzleSchema.virtual('published').get(function() {
  if (!this.tag) return false;
  if (this.tag.includes("daily")) {
    var d = new Date();
    d.setDate(d.getDate()+2);
    return this.daily && this.daily < d
  } else if (this.tag.includes("contest")) {
    if (this.contest && this.contest.puzzleDate) {
      var d = new Date();
      d.setDate(d.getDate()+2);
      return this.contest.puzzleDate && this.contest.puzzleDate < d
    }
    return true;
  }
  return false;
});

const { dataDb } = connectDBs()

const Puzzle = dataDb.model('Puzzle', PuzzleSchema);

module.exports = Puzzle;
