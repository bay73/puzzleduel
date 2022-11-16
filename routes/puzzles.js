const glob = require('glob');
const path = require('path');
const express = require('express');
const router = express.Router();
// Puzzle model
const Puzzle = require('../models/Puzzle');
// UserActionLog model
const UserActionLog = require('../models/UserActionLog');
// UserSolvingTime model
const UserSolvingTime = require('../models/UserSolvingTime');
const PuzzleComment = require('../models/PuzzleComment');
const profiler = require('../utils/profiler');
const cache = require('../utils/cache');
const axios = require('axios');

const type_cheker = {};

glob.sync( './puzzle_types/*.js' ).forEach( function( file ) {
  var extension = path.extname(file);
  var type_name = path.basename(file,extension);
  type_cheker[type_name] = require( path.resolve( file ) );
});

async function logAction(user, puzzleId, action, ipInfo, data) {
  const newUserActionLog = new UserActionLog({
    userId: user._id,
    puzzleId: puzzleId,
    action: action,
    ipInfo: ipInfo
  });
  if (data) {
    newUserActionLog.data = data;
  }
  await newUserActionLog.save();
  const time = await UserSolvingTime.findOne({userId: user._id, puzzleId: puzzleId});
  if (time != null) {
    return;
  }
  var newUserSolvingTime = new UserSolvingTime({
    userId: user._id,
    userName: user.name,
    puzzleId: puzzleId,
    errCount: 0
  });
  await newUserSolvingTime.save();
}

async function writeSolvingTime(user, puzzleId, hidden, clientTime) {
  const time = await UserSolvingTime.findOne({userId: user._id, puzzleId: puzzleId});
  if (time != null && time.solvingTime != null) {
    return;
  }
  const logs = await UserActionLog.find({userId: user._id, puzzleId: puzzleId}).sort('date');
  var startTime = null;
  var solveTime = null;
  var errCount = 0;
  logs.forEach(log => {
    if (!startTime && log.action == "start") {
      startTime = log.date;
    }
    if (!solveTime && log.action == "solved") {
      solveTime = log.date;
    }
    if (!solveTime && log.action == "submitted") {
      errCount++;
    }
  });
  if (!solveTime) solveTime = new Date();
  if (!startTime || solveTime < startTime) {
    return;
  }
  if (time != null) {
    var newUserSolvingTime = time;
  } else {
    var newUserSolvingTime = new UserSolvingTime({
      userId: user._id,
      userName: user.name,
      puzzleId: puzzleId,
      solvingTime: solveTime - startTime,
      serverTime: solveTime - startTime,
      clientTime: clientTime,
      errCount: errCount
    });
  }
  newUserSolvingTime.userName = user.name;
  newUserSolvingTime.solvingTime = solveTime - startTime;
  newUserSolvingTime.serverTime = solveTime - startTime;
  newUserSolvingTime.clientTime = clientTime;
  newUserSolvingTime.errCount = errCount;
  newUserSolvingTime.date = new Date();
  if (hidden) {
    newUserSolvingTime.hidden = true;
  }
  await newUserSolvingTime.save();
}

// Read puzzle header
router.get('/:puzzleid', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const puzzle = await cache.readPuzzle(req.params.puzzleid);
    if (!puzzle) {
      res.sendStatus(404);
      profiler.log('puzzleHeaderFailed', processStart);
      return;
    }
    var returnObj = puzzle.toObject();
    type = await cache.readPuzzleType(returnObj.type);
    if(type) {
      returnObj.type = type.toObject();
    }
    res.json(returnObj);
    profiler.log('puzzleHeader', processStart);
  } catch (e) {
    next(e);
  }
});

// Read puzzle data
router.get('/:puzzleid/start', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const puzzle = await cache.readPuzzle(req.params.puzzleid);
    if (!puzzle) {
      res.sendStatus(404);
      profiler.log('puzzleStartFailed', processStart);
      return;
    }
    if (puzzle.hidden) {
      if (!req.user) {
        res.sendStatus(404);
        profiler.log('puzzleStartFailed', processStart);
        return;
      }
      if (!puzzle.author.equals(req.user._id) && req.user.role != 'test' && !req.user.isTester) {
        res.status(404).send(res.__('Puzzle is not available yet'));
        profiler.log('puzzleStartFailed', processStart);
        return;
      }
    }
    if (puzzle.needLogging) {
      if (!req.user) {
        res.status(403).send(res.__('This puzzle is competitive and you should log in to solve it! ' +
                             'Check our <a href="/archive">archive</a> to try puzzles without registration'));
        profiler.log('puzzleStartFailed', processStart);
        return;
      }
      if (req.user.role == "blocked") {
        res.status(403).send('Your account is blocked. Please contact the side admin');
        profiler.log('puzzleStartFailed', processStart);
        return;
      }
      if (req.user.role == "admin") {
        res.status(403).send('Admin account cannot solve contest puzzles');
        profiler.log('puzzleStartFailed', processStart);
        return;
      }
      if (req.user.role != "test") {
        await logAction(req.user, req.params.puzzleid, "start", req.ipInfo);
      }
    }
    res.json(JSON.parse(puzzle.data));
    profiler.log('puzzleStart', processStart);
  } catch (e) {
    next(e);
  }
});

// Read puzzle data
router.get('/:puzzleid/get', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const puzzle = await cache.readPuzzle(req.params.puzzleid);
    if (!puzzle) {
      res.sendStatus(404);
      profiler.log('puzzleReadFailed', processStart);
      return;
    }
    if (!puzzle.author || !puzzle.author.equals(req.user._id)) {
      res.sendStatus(404);
      profiler.log('puzzleReadFailed', processStart);
      return;
    }
    res.json(JSON.parse(puzzle.data));
    profiler.log('puzzleRead', processStart);
  } catch (e) {
    next(e);
  }
});

// Save puzzle log
router.post('/:puzzleid/log', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const puzzle = await cache.readPuzzle(req.params.puzzleid);
    if (!puzzle) {
      res.sendStatus(404);
      profiler.log('puzzleLogFailed', processStart);
      return;
    }
    if (puzzle.needLogging) {
      if (!req.user) {
        res.status(403).send(res.__('You should log in to log this puzzle data!'));
        profiler.log('puzzleLogFailed', processStart);
        return;
      }
      if (req.user.role != "test") {
        await logAction(
          req.user,
          req.params.puzzleid,
          "log",
          req.ipInfo,
          JSON.stringify(req.body)
        );
      }
    }
    res.json(null);
    profiler.log('puzzleLog', processStart);
  } catch (e) {
    next(e);
  }
});

// Check puzzle solution
router.post('/:puzzleid/check', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const puzzle = await cache.readPuzzle(req.params.puzzleid);
    if (!puzzle) {
      res.sendStatus(404);
      profiler.log('puzzleSubmitFailed', processStart);
      return;
    }
    var result = type_cheker[puzzle.type].check(puzzle.dimension, JSON.parse(puzzle.data), req.body);
    if (puzzle.needLogging) {
      if (!req.user) {
        res.status(403).send(res.__('You should log in to solve this puzzle!'));
        profiler.log('puzzleSubmitFailed', processStart);
        return;
      }
      if (req.user.role != "test") {
        await logAction(
          req.user,
          req.params.puzzleid,
          result.status == "OK" ? "solved" : "submitted",
          req.ipInfo,
          JSON.stringify(req.body)
        );
        var hidden = puzzle.author.equals(req.user._id);
        if (result.status == "OK") {
          await writeSolvingTime(req.user, req.params.puzzleid, hidden, req.body.time);
        }
      }
    }
    result.status = res.__(result.status);
    if (req.user) {
      const comment = await PuzzleComment.findOne({userId: req.user._id, puzzleId: req.params.puzzleid});
      if (comment != null) {
        result.rating = comment.rating;
        result.comment = comment.comment;
      }
    }
    res.json(result);
    profiler.log('puzzleSubmit', processStart);
  } catch (e) {
    next(e);
  }
});

// Save puzzle data
router.post('/:puzzleid/edit', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const puzzle = await Puzzle.findOne({code: req.params.puzzleid});
    if (!puzzle) {
      res.sendStatus(404);
      profiler.log('puzzleEditFailed', processStart);
      return;
    }
    var puzzleObj = puzzle.toObject();
    if (!puzzleObj.author || !puzzleObj.author.equals(req.user._id)) {
      res.sendStatus(404);
      profiler.log('puzzleEditFailed', processStart);
      return;
    }
    if (puzzle.published) {
      res.status(403).send(res.__('Puzzle is already published, changes are not allowed!'));
      profiler.log('puzzleEditFailed', processStart);
      return;
    }
    var tag = req.body["tag"];
    var difficulty = req.body["difficulty"];
    var data = req.body;
    delete data["tag"];
    delete data["difficulty"];
    var newData = JSON.stringify(data);
    puzzle.tag = tag;
    puzzle.difficulty = difficulty;
    if (puzzle.data != newData) {
      puzzle.data = newData;
      await Promise.all([
        UserSolvingTime.deleteMany({puzzleId: puzzle.code}),
        UserActionLog.deleteMany({puzzleId: puzzle.code}),
        puzzle.save()
      ]);
    } else {
      await puzzle.save();
    }
    cache.refreshPuzzle(puzzle.code);
    res.json({status: "OK"});
    profiler.log('puzzleEdit', processStart);
  } catch (e) {
    next(e);
  }
});

// Save rating and comment
router.post('/:puzzleid/comment', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    let rating = parseInt(req.body.rating);
    let commentText = req.body.comment;
    if (rating > 0 || commentText.length > 0) {
      const puzzle = await cache.readPuzzle(req.params.puzzleid);
      if (!req.user) {
        res.status(403).send(res.__('You should log in to rate the puzzle!'));
        profiler.log('puzzleCommentFailed', processStart);
        return;
      }
      if (!puzzle) {
        res.sendStatus(404);
        profiler.log('puzzleCommentFailed', processStart);
        return;
      }
      if (puzzle.author.equals(req.user._id)) {
        res.status(403).send(res.__('Author can not rate own puzzles!'));;
        profiler.log('puzzleEditFailed', processStart);
        return;
      }
      const comment = await PuzzleComment.findOne({userId: req.user._id, puzzleId: req.params.puzzleid});
      if (comment != null) {
        var newComment = comment;
      } else {
        var newComment = new PuzzleComment({
        userId: req.user._id,
        userName: req.user.name,
        puzzleId: req.params.puzzleid
        });
      }
      newComment.userName = req.user.name;
      newComment.rating = rating;
      newComment.comment = commentText;
      newComment.save();
    }
    res.json(null);
    profiler.log('puzzleComment', processStart);
  } catch (e) {
    next(e);
  }
});

// Read all comments
router.get('/:puzzleid/comments', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const comments = await PuzzleComment.find({puzzleId: req.params.puzzleid});
    let showAll = req.user && req.user.role == "admin";
    res.render('puzzle_comments', {
      layout: "empty_layout",
      showAll: showAll,
      comments: comments
        .filter(comment => {
          return comment.comment.length > 0 || showAll
        })
        .map(comment => {
          return {
            userName: showAll?comment.userName:"",
            rating: showAll?comment.rating:null,
            comment: comment.comment
          }
      })
    })
    profiler.log('puzzleComment', processStart);
  } catch (e) {
    next(e);
  }
});

// Read solving log
router.get('/:puzzleid/log/:userid', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    if (!req.user || !req.user.isReplayVisible) {
      res.sendStatus(404);
      return;
    }
    const puzzle = await cache.readPuzzle(req.params.puzzleid);
    if (!puzzle || puzzle.needLogging) {
      res.sendStatus(404);
      return;
    }
    const logs = await UserActionLog.find({userId: req.params.userid, puzzleId: req.params.puzzleid}).sort('date');
    let result = [];
    for (let i=0;i<logs.length;i++) {
      let logItem = logs[i];
      if (typeof logItem.data!="undefined") {
        let data = JSON.parse(logItem.data)
        if (typeof data.log != "undefined") {
          result.push(...data.log);
        }
        if (logItem.action=="solved") {
          result.push({d: "solved"});
          break;
        }
      }
    }
    res.json(result);
    profiler.log('readPuzzleLog', processStart);
  } catch (e) {
    next(e);
  }
});

async function getSolversLog(puzzleId) {
  const [times, logs] = await Promise.all([
    UserSolvingTime.find({puzzleId: puzzleId}).lean(),
    UserActionLog.find({puzzleId: puzzleId}).sort('userId date')
  ]);
  var userSolvingTime = {};
  times.forEach(time => {
    if (typeof time.solvingTime != 'undefined') {
      userSolvingTime[time.userId.toString()] = time.solvingTime;
    }
  });
  let result = [];
  let singleUserLog = {};
  let currentUser = null;
  let solved = false;
  for (let i=0;i<logs.length;i++) {
    let logItem = logs[i];
    if (!logItem.userId.equals(currentUser)) {
      if (currentUser) {
        result.push(singleUserLog);
      }
      currentUser = logItem.userId;
      solved = false;
      singleUserLog = {
        _id: logItem._id.toString(),
        userId: logItem.userId.toString(),
        puzzleId: logItem.puzzleId,
        solvingTime: userSolvingTime[logItem.userId.toString()],
        log: []
      };
    }
    if (typeof logItem.data!="undefined") {
      let data = JSON.parse(logItem.data)
      if (typeof data.log != "undefined" && !solved) {
        singleUserLog.log.push(...data.log);
      }
      if (logItem.action=="solved") {
        if (!solved) {
          singleUserLog.log.push({d: "solved"});
        }
        solved = true;
      }
    }
  }
  result.push(singleUserLog);
  return result;
}

// Read solving logs for all users
router.get('/:puzzleid/log', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    if (!req.user || !req.user.isReplayVisible) {
      res.sendStatus(404);
      return;
    }
    const puzzle = await cache.readPuzzle(req.params.puzzleid);
    if (!puzzle || puzzle.needLogging) {
      res.sendStatus(404);
      return;
    }
    const result = await getSolversLog(req.params.puzzleid);
    res.json(result);
    profiler.log('readPuzzleLog', processStart);
  } catch (e) {
    next(e);
  }
});

// Analyse solving logs for all users
router.get('/:puzzleid/analyse', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const puzzle = await cache.readPuzzle(req.params.puzzleid);
    if (!puzzle || puzzle.needLogging) {
      res.sendStatus(404);
      return;
    }
    const logs = await getSolversLog(req.params.puzzleid);
    const response = await axios.post('http://inconsistent-solving.herokuapp.com/detectOutliers?itp=' + req.query.itp + '&pp=' + req.query.pp + '', logs);
    res.json(response.data);
    profiler.log('readPuzzleLog', processStart);
  } catch (e) {
    next(e);
  }
});

// Delete puzzle
router.post('/:puzzleid/delete', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const puzzle = await Puzzle.findOne({code: req.params.puzzleid});
    if (!puzzle) {
      res.sendStatus(404);
      profiler.log('puzzleDeleteFailed', processStart);
      return;
    }
    var puzzleObj = puzzle.toObject();
    if (!puzzleObj.author || !puzzleObj.author.equals(req.user._id)) {
      res.sendStatus(404);
      profiler.log('puzzleDeleteFailed', processStart);
      return;
    }
    if (puzzle.tag == 'daily') {
      if (puzzle.daily) {
        res.status(403).send(res.__('Puzzle is already planned for publishing, deletion is not allowed!'));
        profiler.log('puzzleDeleteFailed', processStart);
        return;
      }
    } else if (puzzle.tag && puzzle.tag != 'temporary') {
      res.status(403).send(res.__('Puzzle is already used, deletion is not allowed!'));
      profiler.log('puzzleDeleteFailed', processStart);
      return;
    }
    await UserSolvingTime.deleteMany({puzzleId: puzzle.code});
    await UserActionLog.deleteMany({puzzleId: puzzle.code});
    await puzzle.delete();
    res.json({status: "OK"});
    profiler.log('puzzleDelete', processStart);
  } catch (e) {
    next(e);
  }
});

module.exports = router;

