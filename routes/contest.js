const express = require('express');
const router = express.Router();

const Contest = require('../models/Contest');
const Puzzle = require('../models/Puzzle');
const UserSolvingTime = require('../models/UserSolvingTime');
const recountContest = require('../utils/contest');
const util = require('../utils/puzzle_util');

function getUserScore(puzzleDesc, userId) {
  var userScore = null;
  puzzleDesc.results.forEach(result => {
    if (result.userId.equals(userId)) {
      userScore = result.score;
    }
  })
  return userScore;
}

router.get('/:contestid/results', async (req, res, next) => {
  try {
    const contest = await Contest.findOne({code: req.params.contestid});
    if (!contest || contest.start > new Date()) {
      res.sendStatus(404);
      return;
    }
    var contestObj = contest.toObject();
    var locale = req.getLocale();
    if (locale != 'en' && contest.translations) {
      if (contest.translations[locale] && contest.translations[locale].name) {
        contestObj.name = contest.translations[locale].name;
      }
      if (contest.translations[locale] && contest.translations[locale].description) {
        contestObj.description = contest.translations[locale].description;
      }
    }
    res.render('contest_result', {user: req.user, contest: contestObj})
  } catch (e) {
    next(e);
  }
});

router.get('/:contestid', async (req, res, next) => {
  try {
    const contest = await Contest.findOne({code: req.params.contestid});
    if (!contest || contest.start > new Date()) {
      res.sendStatus(404);
      return;
    }
    var typeMap = await util.typeNameMap();
    var puzzleMap = {};
    const puzzles = await Puzzle.find();
    puzzles.forEach(puzzle => puzzles[puzzle.code] = puzzle.toObject());
    var userTimes = {};
    if (req.user) {
      var userId = req.user._id;
      const times = await UserSolvingTime.find({userId: userId});
       times.forEach(time => userTimes[time.puzzleId] = {time: time.solvingTime, errCount: time.errCount});
    }
    var contestObj = {code: contest.code, name: contest.name, description: contest.description};
    var locale = req.getLocale();
    if (locale != 'en' && contest.translations) {
      if (contest.translations[locale] && contest.translations[locale].name) {
        contestObj.name = contest.translations[locale].name;
      }
      if (contest.translations[locale] && contest.translations[locale].description) {
        contestObj.description = contest.translations[locale].description;
      }
    }
    var puzzleList = contest.puzzles
      .filter(puzzle => puzzle.revealDate < new Date())
      .map(puzzle => {
        puzzleObj = puzzles[puzzle.puzzleId];
        return {
          num: puzzle.puzzleNum,
          code: puzzle.puzzleId,
          type: typeMap[puzzleObj.type],
          dimension: puzzleObj.dimension,
          competitive: puzzleObj.needLogging,
          bestTime: util.timeToString(puzzle.details.bestTime),
          userTime: (typeof userTimes[puzzle.puzzleId]=="undefined")?"":util.timeToString(userTimes[puzzle.puzzleId].time),
          userErrCount: (typeof userTimes[puzzle.puzzleId]=="undefined")?0:userTimes[puzzle.puzzleId].errCount,
          userScore: req.user ? getUserScore(puzzle, req.user._id) : "",
        };
      });
    res.render('contest', {user: req.user, contest: contestObj, puzzles: puzzleList})
  } catch (e) {
    next(e);
  }
});

router.get('/:contestid/recount', async (req, res, next) => {
  try {
    if (!req.user || req.user.role != "admin") {
      res.sendStatus(404);
      return;
    }
    var recountResult = await recountContest(req.params.contestid)
    if (!recountResult) {
      res.sendStatus(404);
      return;
    }
    res.redirect('/contest/' + req.params.contestid + "/results");
  } catch (e) {
    next(e);
  }
});

module.exports = router;

