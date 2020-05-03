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

// List of daily puzzles
router.get('/userips', ensureAuthenticated, async (req, res, next) => {
  try {
    var d = new Date();
    d.setDate(d.getDate() - 10);
    var userMap = {}
    var userData = await User.find();
    userData.forEach(user => userMap[user._id] = user);
    var log = await UserActionLog.aggregate([{
      $match : {"ipInfo.ip": {$exists: true}, "date": {$gt: d}}
    },{
      $group: {
        _id: {ip:"$ipInfo.ip", userId:"$userId"},
        country: { $min: "$ipInfo.country"},
        region: { $min: "$ipInfo.region"},
        count: { $sum: 1 }
      }
    }]);
    res.render('userips', {
      user: req.user,
      logData: log.map(logItem => {
        return {
          country: logItem.country,
          region: logItem.region,
          ip: logItem._id.ip,
          userId: logItem._id.userId,
          userName: userMap[logItem._id.userId].name,
          userEmail: userMap[logItem._id.userId].email,
          count: logItem.count
        };
      })
    });
  } catch (e) {
    next(e)
  }
});

module.exports = router;
