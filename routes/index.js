const express = require('express');
const router = express.Router();
// Puzzle model
const Puzzle = require('../models/Puzzle');
// PuzzleType model
const PuzzleType = require('../models/PuzzleType');
// User model
const User = require('../models/User');

// Welcome Page
router.get('/', async (req, res, next) => { 
  try {
    var datetime = new Date();
    var puzzle = await Puzzle.findOne({daily: datetime.toISOString().slice(0,10)}, "-data");
    if (!puzzle) {
      res.render(res.__('welcome_page'), {
        user: req.user,
        puzzle: null
      });
      return;
    }
    var puzzleObj = puzzle.toObject();
    var type = await PuzzleType.findOne({ code: puzzleObj.type });
    if (req.getLocale() != 'en') {
      if (type.translations[req.getLocale()] && type.translations[req.getLocale()].rules) {
        type.rules = type.translations[req.getLocale()].rules;
      }
    }
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
    res.render(res.__('welcome_page'), {
      user: req.user,
      puzzle: puzzleObj
    });
  } catch (e) {
    next(e);
  }
});

// Help Page
router.get('/help', async (req, res, next) => {
  try {
    res.render('help', {
      user: req.user,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
