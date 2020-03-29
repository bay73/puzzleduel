const express = require('express');
const router = express.Router();
// Puzzle model
const Puzzle = require('../models/Puzzle');
// PuzzleType model
const PuzzleType = require('../models/PuzzleType');


// Welcome Page
router.get('/', (req, res) => { 
  var datetime = new Date();
  Puzzle.findOne({daily: datetime.toISOString().slice(0,10)}, "-data").then(puzzle => {
    if (puzzle) {
      var puzzleObj = puzzle.toObject();
      PuzzleType.findOne({ code: puzzleObj.type }).then(type => {
        if(type) {
          puzzleObj.type = type.toObject();
        }
        res.render('welcome', {
          user: req.user,
          puzzle: puzzleObj
        });
      });
    } else {
      res.render('welcome', {
        user: req.user,
        puzzle: null
      });
    }
  });
});

module.exports = router;
