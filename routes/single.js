const express = require('express');
const router = express.Router();
const uniqid = require('uniqid');
// Puzzle model
const Puzzle = require('../models/Puzzle');
// PuzzleType model
const PuzzleType = require('../models/PuzzleType');
// User model
const User = require('../models/User');
// UserSolvingTime model
const UserSolvingTime = require('../models/UserSolvingTime');
// UserActionLog model
const { UserActionLog } = require('../models/UserActionLog');
const util = require('../utils/puzzle_util');
const profiler = require('../utils/profiler');
const cache = require('../utils/cache');

const ensureAuthenticated = require('../config/auth').ensureAuthenticated;

router.use(require('./common.js'));

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

// Single puzzle page
router.get('/:puzzleid', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    var puzzle = await cache.readPuzzle(req.params.puzzleid);
    if (!puzzle) {
      res.sendStatus(404);
      return;
    }
    let userId = null;
    if (req.user) {
      userId = req.user._id;
    }
    var [puzzleObj, times] = await Promise.all([
      util.puzzleToPresent(puzzle, req.getLocale()),
      cache.readSolvingTime(puzzle.code)
    ]);
    const solvedByCurrent = times.filter(time => typeof time.solvingTime!="undefined" && time.userId.equals(userId)).length > 0;
    if (puzzleObj.needLogging) {
      puzzleObj.rating = null;
      puzzleObj.difficulty = null;
    }
    puzzleObj.showComments = solvedByCurrent || puzzle.author.equals(userId) || !puzzleObj.needLogging;
    res.render('single', {
      user: req.user,
      puzzle: puzzleObj,
      autoStart: req.query.start=='true'
    });
    profiler.log('singlePuzzle', processStart);
  } catch (e) {
    next(e);
  }
});

// Author puzzle page show
router.get('/:puzzleid/author', ensureAuthenticated, async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    if (!req.user) {
      res.sendStatus(404);
      return;
    }
    var puzzle = await Puzzle.findOne({code: req.params.puzzleid});
    if (!puzzle) {
      res.sendStatus(404);
      return;
    }
    var puzzleObj = puzzle.toObject();
    if (!puzzleObj.author.equals(req.user._id)) {
      res.sendStatus(404);
      return;
    }
    var type = await PuzzleType.findOne({ code: puzzleObj.type });
    if(type) {
      puzzleObj.type = type.toObject();
    }
    const times = await UserSolvingTime.find({puzzleId: puzzle.code, solvingTime: {$exists: true}}).sort("solvingTime");
    res.render('edit', {
      user: req.user,
      puzzle: puzzleObj,
      times: times.map(time => {
        return {
          userName: time.userName,
          time: timeToString(time.solvingTime),
          errors: time.errCount
        };
      })
    });
    profiler.log('singleAuthor', processStart);
  } catch (e) {
    next(e);
  }
});

// Create new puzzle and show author page
router.get('/:typeid/:dimension/new', ensureAuthenticated, async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    if (!req.user || req.user.role != "author") {
      res.sendStatus(404);
    }
    var type = await PuzzleType.findOne({ code: req.params.typeid });
    if(!type) {
      res.sendStatus(404);
      return;
    }
    var puzzleid = uniqid();
    var puzzle = new Puzzle({
      code: puzzleid,
      type: req.params.typeid,
      dimension: req.params.dimension,
      data: "{}",
      author: req.user._id,
      tag: "daily",
      createdAt: new Date(),
    });
    await puzzle.save();
    res.redirect("/single/" + puzzleid + "/author/");
    profiler.log('singleNew', processStart);
  } catch (e) {
    next(e);
  }
});

// Author puzzle page show
router.get('/:puzzleid/answers', ensureAuthenticated, async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    if (!req.user || req.user.role!="admin") {
      res.sendStatus(404);
      return;
    }
    var puzzle = await Puzzle.findOne({code: req.params.puzzleid});
    if (!puzzle) {
      res.sendStatus(404);
      return;
    }
    var userMap = await util.userNameMap();
    var puzzleObj = puzzle.toObject();
    var type = await PuzzleType.findOne({ code: puzzleObj.type });
    if(type) {
      puzzleObj.type = type.toObject();
    }
    const log = await UserActionLog.find({puzzleId: puzzle.code, action: "solved"});
    res.render('answers', {
      user: req.user,
      puzzle: puzzleObj,
      answers: log.map(item => {
        var data = (typeof item.data!="undefined")?JSON.parse(item.data):null;
        delete data.time;
        delete data.log;
        return {date: item.date, data: data, userName: userMap[item.userId]};
      })
    });
    profiler.log('singleAnswers', processStart);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
