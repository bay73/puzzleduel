const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Puzzle = require('../models/Puzzle');
const util = require('../utils/puzzle_util');
const profiler = require('../utils/profiler');
const cache = require('../utils/cache');

// Welcome Page
router.get('/', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    var dailyPuzzle = await cache.readPuzzleByDate(new Date().toISOString().slice(0,10));
    if (dailyPuzzle) {
      var dailyPuzzleObj = await util.puzzleToPresent(dailyPuzzle, req.getLocale());
      if (typeof dailyPuzzleObj.contest != "undefined") {
        dailyPuzzleObj.contest.link = "/contest/" + dailyPuzzleObj.contest.contestId;
        var contest = await cache.readContest(dailyPuzzleObj.contest.contestId);
        dailyPuzzleObj.contest.name = contest.name;
      }
    }
    var contest = await cache.readDailyShadowContest();
    if (contest) {
      var contestPuzzleId = null;
      contest.puzzles.forEach(puzzle => {
        if (puzzle.revealDate.toISOString().slice(0,10) == datetime.toISOString().slice(0,10)) {
          contestPuzzleId = puzzle.puzzleId;
        }
      })
      if (contestPuzzleId) {
        var contestPuzzle = await cache.readPuzzle(contestPuzzleId);
        if (contestPuzzle) {
          var contestPuzzleObj = await util.puzzleToPresent(contestPuzzle, req.getLocale());
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
    profiler.log('welcomePage', processStart);
  } catch (e) {
    next(e);
  }
});

// Help Page
router.get('/help', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    res.render(res.__('help_page'), {
      user: req.user,
    });
    profiler.log('helpPage', processStart);
  } catch (e) {
    next(e);
  }
});

// Duel rules
router.get('/help/duelrules', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    res.render(res.__('duel_help_page'), {
      user: req.user,
    });
    profiler.log('helpDuel', processStart);
  } catch (e) {
    next(e);
  }
});

// Authors Page
router.get('/help/authors', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
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
    profiler.log('helpAuthors', processStart);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
