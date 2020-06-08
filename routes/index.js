const express = require('express');
const router = express.Router();
// Puzzle model
const Puzzle = require('../models/Puzzle');
// PuzzleType model
const PuzzleType = require('../models/PuzzleType');
// Puzzle model
const Contest = require('../models/Contest');
// User model
const User = require('../models/User');

async function puzzleToObj(puzzle, locale) {
  if (!puzzle) return null;
  var puzzleObj = puzzle.toObject();
  var type = await PuzzleType.findOne({ code: puzzleObj.type });
  if (locale != 'en') {
    if (type.translations[locale] && type.translations[locale].rules) {
      type.rules = type.translations[locale].rules;
    }
  }
  if(type) {
    puzzleObj.type = type.toObject();
  }
  if (puzzleObj.author) {
    var author = await User.findById(puzzleObj.author, "name");
    puzzleObj.author = author.name;
  }
  return puzzleObj;
}

// Welcome Page
router.get('/', async (req, res, next) => {
  try {
    var datetime = new Date();
    var dailyPuzzle = await Puzzle.findOne({daily: datetime.toISOString().slice(0,10)}, "-data");
    if (dailyPuzzle) {
      var dailyPuzzleObj = await puzzleToObj(dailyPuzzle, req.getLocale());
    }
    var contest = await Contest.findOne({type: "daily_shadow", start: {$lt: datetime}, finish: {$gt: datetime} }, "code puzzles");
    if (contest) {
      var contestPuzzleId = null;
      contest.puzzles.forEach(puzzle => {
        if (puzzle.revealDate.toISOString().slice(0,10) == datetime.toISOString().slice(0,10)) {
          contestPuzzleId = puzzle.puzzleId;
        }
      })
      if (contestPuzzleId) {
        var contestPuzzle = await Puzzle.findOne({code: contestPuzzleId}, "-data");
        if (contestPuzzle) {
          var contestPuzzleObj = await puzzleToObj(contestPuzzle, req.getLocale());
          contestPuzzleObj.contest = {
            link: "/contest/" + contest.code
          };
        }
      }
    }
    res.render(res.__('welcome_page'), {
      user: req.user,
      dailyPuzzle: dailyPuzzleObj,
      contestPuzzle: contestPuzzleObj
    });
  } catch (e) {
    next(e);
  }
});

// Help Page
router.get('/help', async (req, res, next) => {
  try {
    res.render(res.__('help_page'), {
      user: req.user,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
