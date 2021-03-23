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
const util = require('../utils/puzzle_util');

// Welcome Page
router.get('/', async (req, res, next) => {
  try {
    var datetime = new Date();
    var dailyPuzzle = await Puzzle.findOne({daily: datetime.toISOString().slice(0,10)}, "-data");
    if (dailyPuzzle) {
      var dailyPuzzleObj = await util.puzzleToObj(dailyPuzzle, req.getLocale());
      if (typeof dailyPuzzleObj.contest != "undefined") {
        dailyPuzzleObj.contest.link = "/contest/" + dailyPuzzleObj.contest.contestId;
        var contest = await Contest.findOne({code: dailyPuzzleObj.contest.contestId}, "name");
        dailyPuzzleObj.contest.name = contest.name;
      }
    }
    var contest = await Contest.findOne({type: "daily_shadow", start: {$lt: datetime}, finish: {$gt: datetime} }, "code name puzzles");
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
          var contestPuzzleObj = await util.puzzleToObj(contestPuzzle, req.getLocale());
          contestPuzzleObj.contest = {
            name: contest.name,
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

// Duel rules
router.get('/help/duelrules', async (req, res, next) => {
  try {
    res.render(res.__('duel_help_page'), {
      user: req.user,
    });
  } catch (e) {
    next(e);
  }
});

// Authors Page
router.get('/help/authors', async (req, res, next) => {
  try {
    const allPuzzles = await Puzzle.find({tag: {$ne: "example"}}, "-data");
    var byAuthorCountMap = {};
    allPuzzles.filter(puzzle => !puzzle.needLogging).forEach(puzzle => {
      if (typeof byAuthorCountMap[puzzle.author] == 'undefined') {
        byAuthorCountMap[puzzle.author]=0;
      }
      byAuthorCountMap[puzzle.author]++;
    })
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
