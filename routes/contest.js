const express = require('express');
const router = express.Router();

const Contest = require('../models/Contest');
const Puzzle = require('../models/Puzzle');
const UserSolvingTime = require('../models/UserSolvingTime');
const recountContest = require('../utils/contest').recountContest;
const util = require('../utils/puzzle_util');
const profiler = require('../utils/profiler');
const cache = require('../utils/cache');

router.use(require('./common.js'));

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
    const contest = await cache.readContest(req.params.contestid);
    if (!contest || contest.start > new Date()) {
      res.sendStatus(404);
      return;
    }
    var contestObj = Object.assign({}, contest);
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

router.get('/:contestid/times', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const contest = await cache.readContest(req.params.contestid);
    if (!contest || contest.start > new Date()) {
      res.sendStatus(404);
      return;
    }
    var contestObj = Object.assign({}, contest);
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
    contestObj.puzzles.forEach(puzzle => {
      puzzle.results.forEach(res => {
        res.timeStr = util.timeToString(res.time);
      })
    })
    res.render('contest_times', {user: req.user, contest: contestObj})
    profiler.log('contestResult', processStart);
  } catch (e) {
    next(e);
  }
});

router.get('/:contestid', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const contest = await cache.readContest(req.params.contestid);
    if (!contest) {
      res.sendStatus(404);
      return;
    }
    if (contest.start > new Date() && !(req.user && (req.user.role == "admin" || req.user.isTester || req.user._id.equals(contest.author)))) {
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
    var contestObj = {code: contest.code, name: contest.name, type: contest.type, description: contest.description, logo: contest.logo};
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
      .filter(puzzle => puzzle.revealDate < new Date() || (req.user && (req.user.role == "admin" || req.user.isTester)))
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

router.get('/:contestid/edit', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const contest = await Contest.findOne({code: req.params.contestid});
    if (!contest || !req.user || (req.user.role != "admin" && !req.user._id.equals(contest.author))) {
      res.sendStatus(404);
      return;
    }
    const [typeMap, puzzles, timesMap] = await Promise.all([
      cache.readPuzzleTypes(),
      Puzzle.find({'contest.contestId': req.params.contestid}),
      util.bestSolvingTimeMap(true)
    ]);
    var puzzleMap = {};
    puzzles.forEach(puzzle => {puzzleMap[puzzle.code] = puzzle.toObject();puzzleMap[puzzle.code].needLogging = puzzle.needLogging});
    var contestObj = {code: contest.code, name: contest.name, description: contest.description, logo: contest.logo, start: contest.start, finish: contest.finish};
    var locale = req.getLocale();
    var puzzleList = contest.puzzles
      .map(puzzle => {
        puzzleObj = puzzleMap[puzzle.puzzleId];
        return {
          num: puzzle.puzzleNum,
          code: puzzle.puzzleId,
          type: typeMap[puzzleObj.type].name,
          dimension: puzzleObj.dimension,
          puzzleDate: puzzleObj.contest.puzzleDate,
          time: util.timeToString(timesMap[puzzle.puzzleId]),
          rating: puzzleObj.rating
        };
      });
    res.render('contest_edit', {user: req.user, contest: contestObj, puzzles: puzzleList})
    profiler.log('contestEdit', processStart);
  } catch (e) {
    next(e);
  }
});

router.post('/:contestid/edit', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const contestId = req.params.contestid;
    const contest = await Contest.findOne({code: contestId});
    if (!contest || !req.user || (req.user.role != "admin" && !req.user._id.equals(contest.author))) {
      res.sendStatus(404);
      return;
    }
    if (contest.start < new Date()) {
      res.sendStatus(403);
      return;
    }
    if (req.body.operation == "editdate") {
      let date = new Date(Date.parse(req.body.date))
      date.setUTCHours(req.body.time.split(":")[0], req.body.time.split(":")[1]);
      if (req.body.item == "start") {
        contest.start = date;
      }
      if (req.body.item == "finish") {
        contest.finish = date;
      }
      if (req.body.item.startsWith("puzzle-")) {
        let puzzleToUpdate = null;
        contest.puzzles.forEach(puzzle => {
          if (puzzle.puzzleId == req.body.item.substring(7)) {
            puzzle.revealDate = date;
            puzzleToUpdate = puzzle.puzzleId;
          }
        })
        contest.markModified('puzzles');
        const puzzle = await Puzzle.findOne({code: puzzleToUpdate})
        if (puzzle.contest.contestId == contestId) {
          puzzle.contest = {contestId: contestId, puzzleDate: date};
          await puzzle.save();
        }
      }
      await contest.save();
    }
    if (req.body.operation == "addpuzzle") {
      const puzzleId = req.body.puzzle
      const puzzle = await Puzzle.findOne({code: puzzleId})
      if (typeof(puzzle.contest) == "undefined" || typeof(puzzle.contest.contestId) == "undefined" || puzzle.contest.contestId == contestId) {
        let puzzleNum = Math.max(...contest.puzzles.map(puzzle => puzzle.puzzleNum));
        if (puzzleNum >0) {
          puzzleNum++;
        } else {
          puzzleNum=1;
        }
        contest.puzzles.push({puzzleNum: puzzleNum, puzzleId: puzzleId, revealDate: contest.start});
        contest.markModified('puzzles');
        puzzle.contest = {contestId: contestId, puzzleDate: contest.start};
        if (!puzzle.daily) {
          puzzle.tag = "contest";
        }
        await puzzle.save();
        await contest.save();
      }
    }
    if (req.body.operation == "removepuzzle") {
      const puzzleId = req.body.puzzle
      const puzzles = contest.puzzles;
      for( var i = 0; i < puzzles.length; i++){
        if ( puzzles[i].puzzleId == puzzleId) {
          puzzles.splice(i, 1);
          i--;
        }
      }
      contest.puzzles = puzzles
      const puzzle = await Puzzle.findOne({code: puzzleId})
      if (typeof(puzzle.contest) != "undefined" && puzzle.contest.contestId == contestId) {
        puzzle.contest = undefined;
        if (puzzle.tag == "contest") {
          puzzle.tag = "temporary";
        }
        await puzzle.save();
      }
      await contest.save();
    }
    if (req.body.operation == "edittitle") {
      const puzzles = contest.puzzles;
      contest.name = req.body.name
      contest.description = req.body.description
      await contest.save();
    }
    res.redirect('/contest/' + contestId + '/edit');
    profiler.log('contestEdit', processStart);
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

