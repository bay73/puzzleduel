const express = require('express');
const router = express.Router();
// Puzzle model
const Puzzle = require('../models/Puzzle');
// PuzzleType model
const PuzzleType = require('../models/PuzzleType');
// UserActionLog model
const UserActionLog = require('../models/UserActionLog');
// UserSolvingTime model
const UserSolvingTime = require('../models/UserSolvingTime');

const type_cheker = {};

type_cheker["tapa_classic"] = require('../puzzle_types/tapa_classic')
type_cheker["yin_yang_classic"] = require('../puzzle_types/yin_yang_classic')
type_cheker["minesweeper_classic"] = require('../puzzle_types/minesweeper_classic')

function logAction(user, puzzleId, action) {
  const newUserActionLog = new UserActionLog({
    userId: user._id,
    puzzleId: puzzleId,
    action: action
  });
  newUserActionLog.save();
}

async function writeSilvingTime(user, puzzleId) {
  const time = await UserSolvingTime.findOne({userId: user._id, puzzleId: puzzleId});
  if (time != null) {
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
  if (! startTime || solveTime < startTime) {
    return;
  }
  const newUserSolvingTime = new UserSolvingTime({
    userId: user._id,
    userName: user.name,
    puzzleId: puzzleId,
    solvingTime: solveTime - startTime,
    errCount: errCount
  });
  newUserSolvingTime.save();
}

// Read puzzle header
router.get('/:puzzleid', async (req, res, next) => {
  try {
    const puzzle = await Puzzle.findOne({code: req.params.puzzleid}, "-_id -data -code");
    if (!puzzle) {
      res.sendStatus(404);
      return;
    }
    var returnObj = puzzle.toObject();
    type = await PuzzleType.findOne({ code: returnObj.type }, "-_id -code -puzzleJs -puzzleObj");
    if(type) {
      returnObj.type = type.toObject();
    }
    res.json(returnObj);
  } catch (e) {
    next(e) 
  }
});

// Read puzzle data
router.get('/:puzzleid/start', async (req, res, next) => {
  try {
    const puzzle = await Puzzle.findOne({code: req.params.puzzleid}, 'data daily');
    if (!puzzle) {
      res.sendStatus(404);
      return;
    }
    if (puzzle.hidden) {
      if (!req.user || req.user.role != 'test') {
        res.sendStatus(404);
        return;
      }
    }
    if (puzzle.needLogging) {
      if (!req.user) {
        res.status(403).send('You should log in to solve this puzzle!');
        return;
      }
      logAction(req.user, req.params.puzzleid, "start");
    }
    res.json(JSON.parse(puzzle.data));
  } catch (e) {
    next(e) 
  }
});

// Check puzzle solution
router.post('/:puzzleid/check', async (req, res, next) => {
  try {
    const puzzle = await Puzzle.findOne({code: req.params.puzzleid});
    if (!puzzle) {
      res.sendStatus(404);
      return;
    }
    if (puzzle.needLogging) {
      if (!req.user) {
        res.status(403).send('You should log in to solve this puzzle!');
        return;
      }
      var result = type_cheker[puzzle.type].check(puzzle.dimension, JSON.parse(puzzle.data), req.body);
      logAction(req.user, req.params.puzzleid, result.status == "OK" ? "solved" : "submitted");
      if (result.status == "OK") {
        writeSilvingTime(req.user, req.params.puzzleid);
      }
    }
    res.json(result);
  } catch (e) {
    next(e) 
  }
});

module.exports = router;

