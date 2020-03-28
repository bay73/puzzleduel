const express = require('express');
const router = express.Router();
// Puzzle model
const Puzzle = require('../models/Puzzle');
// PuzzleType model
const PuzzleType = require('../models/PuzzleType');

const type_cheker = {};

type_cheker["tapa_classic"] = require('../puzzle_types/tapa_classic')

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
  Puzzle.findOne({code: req.params.puzzleid}, 'data').then(puzzle => {
    if (puzzle) {
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
      res.json(checker.check(puzzle.dimension, JSON.parse(puzzle.data), req.body));
    } else {
      res.sendStatus(404);
    }
  });
});

module.exports = router;

