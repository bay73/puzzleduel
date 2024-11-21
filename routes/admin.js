const express = require('express');
const router = express.Router();
const UserActionLog = require('../models/UserActionLog');
const User = require('../models/User');
const Puzzle = require('../models/Puzzle');
const Rating = require('../models/Rating');
const util = require('../utils/puzzle_util');
const profiler = require('../utils/profiler');
const cache = require('../utils/cache');

const ensureAuthenticated = require('../config/auth').ensureAuthenticated;

router.use(require('./common.js'));

router.get('/actionlog', ensureAuthenticated, async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
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
    profiler.log('adminActionLog', processStart);
  } catch (e) {
    next(e)
  }
});

router.get('/clearcache', ensureAuthenticated, async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    if (!req.user || req.user.role != "admin") {
      res.sendStatus(404);
      return;
    }
    cache.resetCache();
    res.redirect('/');
    profiler.log('adminClearCache', processStart);
  } catch (e) {
    next(e)
  }
});

router.get('/actionlog/:puzzleid/:userid', ensureAuthenticated, async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    if (!req.user || req.user.role != "admin") {
      res.sendStatus(404);
      return;
    }
    const userMap = await util.userNameMap();
    var log = await UserActionLog.find({userId: req.params.userid, puzzleId: req.params.puzzleid}).sort("date");
    if (log.length > 0) {
      var startTime = log[0].date;
    }
    res.render('puzzleactionlog', {
      user: req.user,
      logData: log.map(logItem => {
        return {
          user: userMap[logItem.userId],
          date: logItem.date,
          timeDiff: logItem.date > startTime?util.timeToString(logItem.date - startTime):"",
          action: logItem.action,
          data: (typeof logItem.data!="undefined")?JSON.parse(logItem.data):null,
          ipInfo: logItem.ipInfo
        };
      })
    });
    profiler.log('adminUserActionLog', processStart);
  } catch (e) {
    next(e)
  }
});

router.get('/userips', ensureAuthenticated, async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
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
    profiler.log('adminUserIps', processStart);
  } catch (e) {
    next(e)
  }
});

router.get('/daily', ensureAuthenticated, async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    if (!req.user || req.user.role != "admin") {
      res.sendStatus(404);
      return;
    }

    var d = new Date();
    d.setDate(d.getDate() - 20);
    var filter = {
      tag: {$regex : ".*daily.*"},
      $or: [
        {daily: {$gt: d}},
        {daily: {$exists: false}}
      ]
    };
    var oldDailyFilter = {
      tag: {$regex : ".*daily.*"},
      daily: {$lt: new Date()},
    };


    const [userData, typeMap, timesMap, puzzles, oldPuzzles] = await Promise.all([
      User.find(),
      cache.readPuzzleTypes(),
      util.bestSolvingTimeMap(true),
      Puzzle.find(filter, "code type dimension tag daily author rating").sort(req.query.sort=='t'?{daily: -1, type: 1}:{daily: -1}),
      Puzzle.find(oldDailyFilter, "type daily").sort({daily: -1})
    ])

    oldPuzzles.forEach(puzzle => {
      if (typeof typeMap[puzzle.type].last == "undefined" || typeMap[puzzle.type].last < puzzle.daily) {
        typeMap[puzzle.type].last = puzzle.daily;
      }
    })
    var userMap = {}
    userData.forEach(user => userMap[user._id] = user.name);

    res.render('dailysetup', {
      user: req.user,
      puzzles: puzzles.map(puzzle => {
        return {
          code: puzzle.code,
          type: typeMap[puzzle.type].name,
          publishAge: new Date() - typeMap[puzzle.type].last,
          dimension: puzzle.dimension,
          tag: puzzle.tag,
          daily: puzzle.daily,
          time: util.timeToString(timesMap[puzzle.code]),
          author: userMap[puzzle.author],
          published: puzzle.published,
          rating: puzzle.rating
        };
      })
    });
    profiler.log('adminDailySetup', processStart);
  } catch (e) {
    next(e)
  }
});

router.get('/daily/:puzzleid/up', ensureAuthenticated, async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
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
    profiler.log('adminDailyUp', processStart);
  } catch (e) {
    next(e)
  }
});

router.get('/daily/:puzzleid/top', ensureAuthenticated, async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
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
    var nextPuzzles = await Puzzle.find({daily: {$gt: date} }, "tag daily").sort({daily: 1});
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
    profiler.log('adminDailyTop', processStart);
  } catch (e) {
    next(e)
  }
});

router.get('/instantrating', ensureAuthenticated, async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    if (!req.user || req.user.role != "admin") {
      res.sendStatus(404);
      return;
    }
    var userData = {}
    var users = await User.find();
    users.forEach(user => userData[user._id] = {name: user.name, country: user.country, email: user.email, ipCountries: []});
    var lastDate = new Date();
    if (lastDate.getUTCDay() != 0) {
      lastDate.setDate(lastDate.getDate() + 7 - lastDate.getUTCDay());
    }
    lastDate.setUTCHours(0,0,0,0);
    var dates = [];
    for (var i=5;i>=0;i--) {
      var d = new Date(lastDate);
      d.setDate(lastDate.getDate() - i*7);
      dates.push(d);
      const ratingList = await Rating.find({date: d});
      ratingList.forEach(rating => userData[rating.userId][d] = rating.details.weekValue);
    }
    var date = new Date(lastDate);
    date.setDate(lastDate.getDate() - 42);
    const actionLog = await UserActionLog.find({date: {$gt: date}});
    actionLog.forEach(log => {if (userData[log.userId].ipCountries.indexOf(log.ipInfo.country)==-1) userData[log.userId].ipCountries.push(log.ipInfo.country)});
    console.log(userData)
    var allData = [];
    for (let [userId, data] of Object.entries(userData)) {
      var sum = 0;
      var count = 0;
      var item = {userId: userId, userName: data.name, userCountry: data.country, userAddress: data.email, ipCountries: data.ipCountries }
      dates.forEach(d => {
        if (data[d]) {
         sum = sum + data[d];
         item[d] = data[d]
         count++;
        }
      });
      if (count > 0 ) {
        item.avg = sum / count;
        allData.push(item);
      }
    }
    res.render('instantrating', {
      user: req.user,
      dates: dates,
      data: allData
    });
    profiler.log('adminInstantRating', processStart);
  } catch (e) {
    next(e)
  }
});


module.exports = router;
