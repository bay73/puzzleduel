const express = require('express');
const router = express.Router();
// Puzzle model
const Puzzle = require('../models/Puzzle');
// PuzzleType model
const PuzzleType = require('../models/PuzzleType');

// Welcome Page
router.get('/:puzzleid', (req, res) => { 
  Puzzle.findOne({code: req.params.puzzleid}, "-data").then(puzzle => {
    if (puzzle) {
      var puzzleObj = puzzle.toObject();
      PuzzleType.findOne({ code: puzzleObj.type }).then(type => {
        if(type) {
          puzzleObj.type = type.toObject();
        }
        res.render('single', {
          user: req.user,
          puzzle: puzzleObj
        });
      });
    } else {
      res.sendStatus(404);
    }
  });
});

module.exports = router;
