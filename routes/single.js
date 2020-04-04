const express = require('express');
const router = express.Router();
const uniqid = require('uniqid');
// Puzzle model
const Puzzle = require('../models/Puzzle');
// PuzzleType model
const PuzzleType = require('../models/PuzzleType');
// User model
const User = require('../models/User');

const { ensureAuthenticated } = require('../config/auth');

// Single puzzle page
router.get('/:puzzleid', async (req, res, next) => {
  try {
    var puzzle = await Puzzle.findOne({code: req.params.puzzleid}, "-data");
    if (!puzzle) {
      res.sendStatus(404);
      return;
    }
    var puzzleObj = puzzle.toObject();
    var type = await PuzzleType.findOne({ code: puzzleObj.type });
    if(type) {
      puzzleObj.type = type.toObject();
    }
    if (puzzleObj.author) {
      var author = await User.findById(puzzleObj.author, "name");
      if(type) {
        puzzleObj.type = type.toObject();
      }
      puzzleObj.author = author.name;
    }
    res.render('single', {
      user: req.user,
      puzzle: puzzleObj
    });
  } catch (e) {
    next(e);
  }
});

// Author puzzle page show
router.get('/:puzzleid/author', ensureAuthenticated, async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(403).send('You should log in to see the list!');
      return;
    }
    var puzzle = await Puzzle.findOne({code: req.params.puzzleid});
    if (!puzzle) {
      res.sendStatus(404);
      return;
    }
    var puzzleObj = puzzle.toObject();
    if (!puzzleObj.author.equals(req.user._id)) {
      res.sendStatus(404);
      return;
    }
    var type = await PuzzleType.findOne({ code: puzzleObj.type });
    if(type) {
      puzzleObj.type = type.toObject();
    }
    res.render('edit', {
      user: req.user,
      puzzle: puzzleObj
    });
  } catch (e) {
    next(e);
  }
});

// Create new puzzle and show author page
router.get('/:typeid/:dimension/new', ensureAuthenticated, async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(403).send('You should log in to add puzzles!');
      return;
    }
    var type = await PuzzleType.findOne({ code: req.params.typeid });
    if(!type) {
      res.sendStatus(404);
      return;
    }
    var puzzleid = uniqid();
    var puzzle = new Puzzle({
      code: puzzleid,
      type: req.params.typeid,
      dimension: req.params.dimension,
      data: "{}",
      author: req.user._id
    });
    await puzzle.save();
    var puzzleObj = puzzle.toObject();
    puzzleObj.type = type.toObject();
    res.render('edit', {
      user: req.user,
      puzzle: puzzleObj
    });
  } catch (e) {
    next(e);
  }
});


module.exports = router;
