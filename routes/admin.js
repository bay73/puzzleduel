const express = require('express');
const router = express.Router();
const UserActionLog = require('../models/UserActionLog');
const User = require('../models/User');
const util = require('../utils/puzzle_util');

const ensureAuthenticated = require('../config/auth').ensureAuthenticated;

// List of daily puzzles
router.get('/actionlog', ensureAuthenticated, async (req, res, next) => { 
  try {
    var users = req.query.users.split(',');
    var userData = await User.find({_id: {$in: users}});
    var log = await UserActionLog.find({userId: {$in: users}}).sort("date");
    res.render('actionlog', {
      user: req.user,
      users: userData.map(user => user.toObject()),
      logData: log.map(logItem => logItem.toObject())
    });
  } catch (e) {
    next(e) 
  }
});

module.exports = router;
