const express = require('express');
const router = express.Router();
// Puzzle model
const Puzzle = require('../models/Puzzle');
// PuzzleType model
const PuzzleType = require('../models/PuzzleType');
// UserActionLog model
const UserActionLog = require('../models/UserActionLog');

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

// Read puzzle header
router.get('/:puzzleid', async (req, res, next) => {
  try {
    puzzle = await Puzzle.findOne({code: req.params.puzzleid}, "-_id -data -code");
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
    puzzle = await Puzzle.findOne({code: req.params.puzzleid}, 'data daily');
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
    puzzle = await Puzzle.findOne({code: req.params.puzzleid});
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
    }
    res.json(result);
  } catch (e) {
    next(e) 
  }
});

module.exports = router;

