const express = require('express');
const router = express.Router();
const UserActionLog = require('../models/UserActionLog');
const User = require('../models/User');
const Puzzle = require('../models/Puzzle');
const util = require('../utils/puzzle_util');

const ensureAuthenticated = require('../config/auth').ensureAuthenticated;

router.get('/actionlog', ensureAuthenticated, async (req, res, next) => {
  try {
    if (!req.user || req.user.role != "admin") {
      res.sendStatus(404);
      return;
    }
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

router.get('/userips', ensureAuthenticated, async (req, res, next) => {
  try {
    if (!req.user || req.user.role != "admin") {
      res.sendStatus(404);
      return;
    }
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

router.get('/daily', ensureAuthenticated, async (req, res, next) => {
  try {
    if (!req.user || req.user.role != "admin") {
      res.sendStatus(404);
      return;
    }

    var d = new Date();
    d.setDate(d.getDate() - 20);
    var userMap = {}
    var userData = await User.find();
    userData.forEach(user => userMap[user._id] = user.name);
    var typeMap = await util.typeNameMap();
    var timesMap = await util.bestSolvingTimeMap(true);

    var filter = {
      tag: {$regex : ".*daily.*"},
      $or: [
        {daily: {$gt: d}},
        {daily: {$exists: false}}
      ]
    };

    const puzzles = await Puzzle.find(filter, "code type dimension tag daily author").sort({daily: -1});
    res.render('dailysetup', {
      user: req.user,
      puzzles: puzzles.map(puzzle => {
        return {
          code: puzzle.code,
          type: typeMap[puzzle.type],
          dimension: puzzle.dimension,
          tag: puzzle.tag,
          daily: puzzle.daily,
          time: util.timeToString(timesMap[puzzle.code]),
          author: userMap[puzzle.author],
          published: puzzle.published
        };
      })
    });
  } catch (e) {
    next(e)
  }
});

router.get('/daily/:puzzleid/up', ensureAuthenticated, async (req, res, next) => {
  try {
    if (!req.user || req.user.role != "admin") {
      res.sendStatus(404);
      return;
    }
    var puzzle = await Puzzle.findOne({code: req.params.puzzleid}, "tag daily");
    if (!puzzle || !puzzle.tag.includes("daily")) {
      res.sendStatus(404);
      return;
    }
    if (puzzle.daily < new Date()) {
      res.sendStatus(403);
      return;
    }
    var date = puzzle.daily;
    var nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    var nextPuzzle = await Puzzle.findOne({daily: nextDate}, "tag daily");
    puzzle.daily = nextDate;
    await puzzle.save();
    if (nextPuzzle) {
      nextPuzzle.daily = date;
      await nextPuzzle.save();
    }
    res.redirect('/admin/daily');
  } catch (e) {
    next(e)
  }
});

router.get('/daily/:puzzleid/top', ensureAuthenticated, async (req, res, next) => {
  try {
    if (!req.user || req.user.role != "admin") {
      res.sendStatus(404);
      return;
    }
    var puzzle = await Puzzle.findOne({code: req.params.puzzleid}, "tag daily");
    if (!puzzle || !puzzle.tag.includes("daily")) {
      res.sendStatus(404);
      return;
    }
    if (puzzle.daily < new Date()) {
      res.sendStatus(403);
      return;
    }
    var filter = {daily: {$lte: new Date()} };
    if (req.user && req.user.role == "test") {
      filter = {};
    }
    var date = new Date();
    var nextDate = null;
    if (puzzle.daily) {
      date = puzzle.daily;
      nextDate = new Date(date);
    }
    var lastDate = null;
    var nextPuzzles = await Puzzle.find({daily: {$gt: date} }, "daily").sort({daily: 1});
    for (var i=0;i < nextPuzzles.length; i++) {
      var nextPuzzle = nextPuzzles[i];
      if (nextDate) {
        nextPuzzle.daily = new Date(nextDate);
        nextDate.setDate(nextDate.getDate() + 1);
        await nextPuzzle.save();
      }
      lastDate = new Date(nextPuzzle.daily);
    }
    if (lastDate) {
      lastDate.setDate(lastDate.getDate() + 1);
    }
    puzzle.daily = lastDate;
    await puzzle.save();
    res.redirect('/admin/daily');
  } catch (e) {
    next(e)
  }
});

module.exports = router;
