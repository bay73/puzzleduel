const express = require('express');
const router = express.Router();
const Puzzle = require('../models/Puzzle');
const PuzzleType = require('../models/PuzzleType');
const UserSolvingTime = require('../models/UserSolvingTime');
const User = require('../models/User');
const UserActionLog = require('../models/UserActionLog');
const util = require('../utils/puzzle_util');

const ensureAuthenticated = require('../config/auth').ensureAuthenticated;

// List of daily puzzles
router.get('/', async (req, res, next) => { 
  try {
    var timesMap = await util.bestSolvingTimeMap(false);
    var typeMap = await util.typeNameMap();

    var filter = {daily: {$lte: new Date()} };
    if (req.user && req.user.role == "test") {
      filter = {};
    }
    const puzzles = await Puzzle.find(filter, "code type dimension tag daily").sort({daily: -1});
    res.render('archive', {
      user: req.user,
      puzzles: puzzles.map(puzzle => {
        return {
          code: puzzle.code,
          type: typeMap[puzzle.type],
          dimension: puzzle.dimension,
          daily: puzzle.daily,
          competitive: puzzle.needLogging,
          time: util.timeToString(timesMap[puzzle.code])
        };
      })
    });
  } catch (e) {
    next(e) 
  }
});

// Solving time for a single puzzle
router.get(['/:puzzleid/scores','/:puzzleid/times'],
  async (req, res, next) => {
  try {
    var date = Date.parse(req.params.puzzleid);
    var filter = {code: req.params.puzzleid};
    if (date) {
      filter = {daily: date};
    }
    puzzle = await Puzzle.findOne(filter, "-data");
    if (!puzzle || puzzle.hiddenScore) {
      res.sendStatus(404);
      return;
    }
    var puzzleType = puzzle.type;
    const type = await PuzzleType.findOne({code: puzzle.type}, "name");
    if (type) {
      puzzleType = type.name;
    }
    var userMap = {}
    var userData = await User.find();
    userData.forEach(user => userMap[user._id] = user.name);

    const times = await UserSolvingTime.find({puzzleId: puzzle.code}).sort("solvingTime");
    const finished = await UserActionLog.find({puzzleId: puzzle.code, action: "solved"}, "userId").distinct("userId");
    const notFinished = await UserActionLog.find({puzzleId: puzzle.code, userId: {$nin: finished}}, "userId").distinct("userId");
    res.render('times', {
      user: req.user,
      puzzle: {
        code: puzzle.code,
        type: puzzleType,
        dimension: puzzle.dimension,
        daily: puzzle.daily,
      },
      times: times
        .filter(time => typeof time.hidden=="undefined" || time.hidden==false)
        .map(time => {
          return {
            userName: time.userName,
            time: util.timeToString(time.solvingTime),
            errors: time.errCount
          };
        }),
      notFinished: notFinished.map(log => userMap[log])
    });
  } catch (e) {
    next(e) 
  }
});

// Socre for today's puzzle
router.get('/scores', (req, res) => {
  var d = new Date().toISOString().split('T')[0];
  res.redirect('/archive/' + d + '/scores');
});

// Author puzzle list
router.get('/author', ensureAuthenticated, async (req, res, next) => {
  try {
    if (!req.user || req.user.role != "author") {
      res.sendStatus(404);
      return;
    }

    var typeMap = await util.typeNameMap();
    var timesMap = await util.bestSolvingTimeMap(true);

    var filter = {author: req.user._id};

    if (req.query.future) {
      filter = {
        author: req.user._id,
        $or: [
          {daily: {$gt: new Date()}},
          {daily: {$exists: false}}
        ]
      }
    }
    const puzzles = await Puzzle.find(filter, "code type dimension tag daily").sort({daily: -1});
    res.render('author', {
      user: req.user,
      future: req.query.future,
      types: Object.entries(typeMap).sort(([key1, value1],[key2, value2]) => key1.localeCompare(key2)).map(([key, value]) => {
        return {
          code: key,
          name: value
        };
      }),
      puzzles: puzzles.map(puzzle => {
        return {
          code: puzzle.code,
          type: typeMap[puzzle.type],
          dimension: puzzle.dimension,
          tag: puzzle.tag,
          daily: puzzle.daily,
          time: util.timeToString(timesMap[puzzle.code]),
          published: puzzle.published
        };
      })
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
