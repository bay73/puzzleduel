const express = require('express');
const router = express.Router();
// Puzzle model
const Puzzle = require('../models/Puzzle');
// PuzzleType model
const PuzzleType = require('../models/PuzzleType');

// Read puzzle header
router.get('/:puzzleid', (req, res) => {
  Puzzle.findOne({code: req.params.puzzleid}, "-data").then(puzzle => {
    if (puzzle) {
      var returnObj = puzzle.toObject();
      PuzzleType.findOne({ code: returnObj.type }, "-puzzleJs -puzzleObj").then(type => {
        if(type) {
          returnObj.type = type.toObject();
        }
        res.json(returnObj)
      });
    } else {
      res.sendStatus(404);
    }
  });
});

module.exports = router;

