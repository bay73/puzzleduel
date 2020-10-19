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

// Authors Page
router.get('/help/authors', async (req, res, next) => {
  try {
    const byAuthorCount = await Puzzle.aggregate([{
      $group: {
        _id: "$author",
        count: { $sum: 1 }
      }
    }]);
    var byAuthorCountMap = {};
    byAuthorCount.forEach(author => byAuthorCountMap[author._id] = author.count);
    const authors = await User.find({role: "author"}, "_id name about");
    const locale = req.getLocale();
    res.render('contributors', {
      user: req.user,
      contributors: authors.map(author => {
        var text = "";
        if (typeof author.about !="undefined") {
          text = author.about.text;
          if (locale != 'en' && typeof author.about.translations !="undefined") {
            if (author.about.translations[locale] && author.about.translations[locale].text) {
              text = author.about.translations[locale].text;
            }
          }
        }
        return {
          id: author._id,
          name: author.name,
          puzzleCount: byAuthorCountMap[author._id],
          about: author.about,
          realName: typeof author.about!="undefined"?author.about.realName:"",
          picture: typeof author.about!="undefined"?author.about.picture:"",
          text: text
        }
      })
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
