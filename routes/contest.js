const express = require('express');
const router = express.Router();

const Contest = require('../models/Contest');
const Puzzle = require('../models/Puzzle');
const UserSolvingTime = require('../models/UserSolvingTime');
const recountContest = require('../utils/contest').recountContest;
const util = require('../utils/puzzle_util');
const profiler = require('../utils/profiler');
const cache = require('../utils/cache');

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
    const processStart = new Date().getTime();
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
    contestObj.results.forEach(result => {
      result.totalTimeStr = util.timeToString(result.totalTime);
    })
    res.render('contest_result', {user: req.user, contest: contestObj})
    profiler.log('contestResult', processStart);
  } catch (e) {
    next(e);
  }
});

router.get('/:contestid', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const contest = await Contest.findOne({code: req.params.contestid});
    if (!contest) {
      res.sendStatus(404);
      return;
    }
    if (contest.start > new Date() && !(req.user && req.user.role == "admin")) {
      res.sendStatus(404);
      return;
    }
    const [typeMap, puzzles] = await Promise.all([
      cache.readPuzzleTypes(),
      Puzzle.find({'contest.contestId': req.params.contestid})
    ]);
    var puzzleMap = {};
    puzzles.forEach(puzzle => {puzzleMap[puzzle.code] = puzzle.toObject();puzzleMap[puzzle.code].needLogging = puzzle.needLogging});
    var userTimes = {};
    if (req.user) {
      var userId = req.user._id;
      const times = await UserSolvingTime.find({userId: userId, solvingTime: {$exists: true}});
      times.forEach(time => userTimes[time.puzzleId] = {time: time.solvingTime, errCount: time.errCount});
    }
    var contestObj = {code: contest.code, name: contest.name, description: contest.description, logo: contest.logo};
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
      .filter(puzzle => puzzle.revealDate < new Date() || (req.user && req.user.role == "admin"))
      .map(puzzle => {
        puzzleObj = puzzleMap[puzzle.puzzleId];
        return {
          num: puzzle.puzzleNum,
          code: puzzle.puzzleId,
          type: typeMap[puzzleObj.type].name,
          dimension: puzzleObj.dimension,
          puzzleDate: puzzleObj.contest.puzzleDate,
          competitive: puzzleObj.needLogging,
          bestTime: (typeof puzzle.details != 'undefined')?util.timeToString(puzzle.details.bestTime):"",
          userTime: (typeof userTimes[puzzle.puzzleId]=="undefined")?"":util.timeToString(userTimes[puzzle.puzzleId].time),
          userErrCount: (typeof userTimes[puzzle.puzzleId]=="undefined")?0:userTimes[puzzle.puzzleId].errCount,
          userScore: req.user ? getUserScore(puzzle, req.user._id) : "",
        };
      });
    res.render('contest', {user: req.user, contest: contestObj, puzzles: puzzleList})
    profiler.log('contestView', processStart);
  } catch (e) {
    next(e);
  }
});

router.get('/:contestid/recount', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
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
    profiler.log('contestRecount', processStart);
  } catch (e) {
    next(e);
  }
});

module.exports = router;

