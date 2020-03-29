const express = require('express');
const router = express.Router();
// Puzzle model
const Puzzle = require('../models/Puzzle');
// PuzzleType model
const PuzzleType = require('../models/PuzzleType');


// Welcome Page
router.get('/', async (req, res, next) => { 
  try {
    const types = await PuzzleType.find({}, "code name");
    var typeMap = {};
    types.forEach(type => typeMap[type.code] = type.name);
    var filter = {daily: {$lte: new Date()} };
    if (req.user && req.user.role == "test") {
      filter = {};
    }
    const puzzles = await Puzzle.find(filter, "code type dimension daily").sort({daily: -1});
    res.render('archive', {
      user: req.user,
      puzzles: puzzles.map(puzzle => {
        return {
          code: puzzle.code,
          type: typeMap[puzzle.type],
          dimension: puzzle.dimension,
          daily: puzzle.daily};
      })
    });
  } catch (e) {
    next(e) 
  }
});

module.exports = router;
