const mongoose = require('mongoose');
const { connectDBs } = require('../config/db')

const Mixed = mongoose.Schema.Types.Mixed;

const AnnouncementSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  translations: {
    type: Mixed,
    required: false
  },
  start: {
    type: Date,
    required: true
  },
  finish: {
    type: Date,
    required: false
  }
});

const { db, logDb } = connectDBs()

const Announcement = db.model('Announcement', AnnouncementSchema);

module.exports = Announcement;