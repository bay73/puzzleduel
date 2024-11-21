const mongoose = require('mongoose');
const { connectDBs } = require('../config/db')

const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;

const RatingSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true,
  },
  userId: {
    type: ObjectId,
    required: true,
    index: true,
  },
  userName: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  change: {
    type: Number,
    required: false
  },
  solved: {
    type: Number,
    required: false
  },
  ratingWeek: {
    type: Number,
    required: false
  },
  missedWeek: {
    type: Number,
    required: false
  },
  totalStarted: {
    type: Number,
    required: false
  },
  totalSolved: {
    type: Number,
    required: false
  },
  details: {
    type: Mixed,
    required: false
  }
});

const { db, logDb } = connectDBs()

const Rating = db.model('Rating', RatingSchema);

module.exports = Rating;
