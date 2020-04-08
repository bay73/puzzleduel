const express = require('express');
const router = express.Router();
// Puzzle model
const Puzzle = require('../models/Puzzle');
// PuzzleType model
const PuzzleType = require('../models/PuzzleType');
// UserSolvingTime model
const UserSolvingTime = require('../models/UserSolvingTime');

const { ensureAuthenticated } = require('../config/auth');

function timeToString(millis) {
  if (!millis) return "";
  var secs = Math.round(millis/1000);
  var mins = Math.trunc(secs/60);
  var hours = Math.trunc(mins/60);
  secs = secs - 60 * mins;
  mins = mins - 60 * hours;
  return (hours > 0 ? (hours + "h ") : "") +
    ((hours > 0 || mins > 0) ? (mins + "m ") : "") +
    (secs + " s");
}

function showPuzzle(puzzle, user) {
  if (!puzzle) return false;
  if (!puzzle.daily || puzzle.daily > new Date()) {
    if (!user || user.role != "test") {
      return false;
    }
  }
  return true;
}

// Puzzle list
router.get('/', async (req, res, next) => { 
  try {
    const types = await PuzzleType.find({}, "code name");
    var typeMap = {};
    types.forEach(type => typeMap[type.code] = type.name);
    const times = await UserSolvingTime.aggregate([{
      $match : {
        errCount : 0,
        $or: [
          {hidden: false},
          {hidden: {$exists: false}}
        ]
      }
    }, {
      $group: {
        _id: "$puzzleId",
        min: { $min: "$solvingTime" }
      }
    }]);
    var timesMap = {};
    times.forEach(time => timesMap[time._id] = time.min);

    var filter = {daily: {$lte: new Date()} };
    if (req.user && req.user.role == "test") {
      filter = {};
    }
    const puzzles = await Puzzle.find(filter, "code type dimension daily").sort({daily: -1});
    res.render('archive', {
      user: req.user,
      puzzles: puzzles.map(puzzle => {
        return {
          code: puzzle.code,
          type: typeMap[puzzle.type],
          dimension: puzzle.dimension,
          daily: puzzle.daily,
          time: timeToString(timesMap[puzzle.code])
        };
      })
    });
  } catch (e) {
    next(e) 
  }
});

router.get(['/:puzzleid/scores','/:puzzleid/times'],
  async (req, res, next) => {
  try {
    var date = Date.parse(req.params.puzzleid);
    var filter = {code: req.params.puzzleid};
    if (date) {
      filter = {daily: date};
    }
    puzzle = await Puzzle.findOne(filter, "-data");
    if (!showPuzzle(puzzle, req.user)) {
      res.render('times', {
        user: req.user,
        puzzle: null,
        times: []
      });
      return;
    }
    var puzzleType = puzzle.type;
    const type = await PuzzleType.findOne({code: puzzle.type}, "name");
    if (type) {
      puzzleType = type.name;
    }
    const times = await UserSolvingTime.find({
      puzzleId: puzzle.code,
      $or: [
        {hidden: false},
        {hidden: {$exists: false}}
      ]
    }).sort("solvingTime");
    res.render('times', {
      user: req.user,
      puzzle: {
        code: puzzle.code,
        type: puzzleType,
        dimension: puzzle.dimension,
        daily: puzzle.daily,
      },
      times: times.map(time => {
        return {
          userName: time.userName,
          time: timeToString(time.solvingTime),
          errors: time.errCount
        };
      })
    });
  } catch (e) {
    next(e) 
  }
});

// Author puzzle list
router.get('/author', ensureAuthenticated, async (req, res, next) => {
  try {
    if (!req.user || req.user.role != "author") {
      res.sendStatus(404);
    }
    const types = await PuzzleType.find({}, "code name");
    var typeMap = {};
    types.forEach(type => typeMap[type.code] = type.name);
    const times = await UserSolvingTime.aggregate([{$group: {
        _id: "$puzzleId",
        min: { $min: "$solvingTime" }
      }
    }]);
    var timesMap = {};
    times.forEach(time => timesMap[time._id] = time.min);
    var filter = {author: req.user._id};
    const puzzles = await Puzzle.find(filter, "code type dimension daily").sort({daily: -1});
    res.render('author', {
      user: req.user,
      types: types.map(type => {
        return {
          code: type.code,
          name: type.name
        };
      }),
      puzzles: puzzles.map(puzzle => {
        return {
          code: puzzle.code,
          type: typeMap[puzzle.type],
          dimension: puzzle.dimension,
          daily: puzzle.daily,
          time: timeToString(timesMap[puzzle.code]),
          published: puzzle.published
        };
      })
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
