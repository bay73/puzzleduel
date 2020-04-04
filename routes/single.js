const express = require('express');
const router = express.Router();
// Puzzle model
const Puzzle = require('../models/Puzzle');
// PuzzleType model
const PuzzleType = require('../models/PuzzleType');

const { ensureAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/:puzzleid', async (req, res, next) => {
  try {
    var puzzle = await Puzzle.findOne({code: req.params.puzzleid}, "-data");
    if (!puzzle) {
      res.sendStatus(404);
      return;
    }
    var puzzleObj = puzzle.toObject();
    var type = await PuzzleType.findOne({ code: puzzleObj.type });
    console.log("type",type);
    if(type) {
      puzzleObj.type = type.toObject();
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

module.exports = router;
