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

// Read puzzle header
router.get('/:puzzleid', (req, res) => {
  Puzzle.findOne({code: req.params.puzzleid}, "-_id -data -code").then(puzzle => {
    if (puzzle) {
      var returnObj = puzzle.toObject();
      PuzzleType.findOne({ code: returnObj.type }, "-_id -code -puzzleJs -puzzleObj").then(type => {
        if(type) {
          returnObj.type = type.toObject();
        }
        res.json(returnObj);
      });
    } else {
      res.sendStatus(404);
    }
  });
});

// Read puzzle data
router.get('/:puzzleid/start', (req, res) => {
  Puzzle.findOne({code: req.params.puzzleid}, 'data daily').then(puzzle => {
    if (puzzle) {
      if (puzzle.hidden) {
        res.sendStatus(404);
        return;
      }
      if (puzzle.needLogging) {
        if (!req.user) {
	  res.status(403).send('You should log in to solve this puzzle!');
          return;
        }
        const newUserActionLog = new UserActionLog({
          userId: req.user._id,
          puzzleId: req.params.puzzleid,
          action: "start"
        });
        newUserActionLog.save();
      }
      res.json(JSON.parse(puzzle.data));
    } else {
      res.sendStatus(404);
    }
  });
});

// Check puzzle solution
router.post('/:puzzleid/check', (req, res) => {
  Puzzle.findOne({code: req.params.puzzleid}).then(puzzle => {
    if (puzzle) {
      var checker = type_cheker[puzzle.type]();
      var result = checker.check(puzzle.dimension, JSON.parse(puzzle.data), req.body);
      if (puzzle.needLogging) {
        if (!req.user) {
	  res.status(403).send('You should log in to solve this puzzle!');
          return;
        }
        const newUserActionLog = new UserActionLog({
          userId: req.user._id,
          puzzleId: req.params.puzzleid,
          action: result.status == "OK" ? "solved" : "submitted"
        });
        newUserActionLog.save();
      }
      res.json(result);
    } else {
      res.sendStatus(404);
    }
  });
});

module.exports = router;

