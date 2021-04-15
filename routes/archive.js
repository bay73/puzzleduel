const express = require('express');
const router = express.Router();
const Puzzle = require('../models/Puzzle');
const PuzzleType = require('../models/PuzzleType');
const UserSolvingTime = require('../models/UserSolvingTime');
const User = require('../models/User');
const util = require('../utils/puzzle_util');
const profiler = require('../utils/profiler');
const cache = require('../utils/cache');

const ensureAuthenticated = require('../config/auth').ensureAuthenticated;

// List of daily puzzles
router.get(['/','/daily'],
  async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    var timesMap = await util.bestSolvingTimeMap(false);
    var typeMap = await util.typeNameMap();

    var filter = {daily: {$lte: new Date()} };
    if (req.user && req.user.role == "test") {
      filter = {};
    }
    if (req.user) {
      var userTimesMap = await util.userSolvingTimeMap(req.user._id, false);
    } else {
      var userTimesMap = {};
    }
    const puzzles = await Puzzle.find(filter, "-data").sort({daily: -1});
    res.render('archive', {
      user: req.user,
      puzzles: puzzles.map(puzzle => {
        return {
          code: puzzle.code,
          type: typeMap[puzzle.type],
          dimension: puzzle.dimension,
          daily: puzzle.daily,
          competitive: puzzle.needLogging,
          userTime: userTimesMap[puzzle.code]?util.timeToString(userTimesMap[puzzle.code].time):"",
          userErr: userTimesMap[puzzle.code]?userTimesMap[puzzle.code].errors:0,
          time: util.timeToString(timesMap[puzzle.code])
        };
      })
    });
    profiler.log('archiveDaily', processStart);
  } catch (e) {
    next(e)
  }
});

// List of all old puzzles
router.get('/types', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    var typeMap = await util.typeDataMap();

    const puzzles = await Puzzle.find({}, "-data");
    res.render('by_type', {
      user: req.user,
      puzzles: puzzles
        .filter(puzzle => !puzzle.needLogging)
        .filter(puzzle => !util.isHiddenType(typeMap[puzzle.type]))
        .map(puzzle => {
        return {
          code: puzzle.code,
          category: typeMap[puzzle.type].category,
          type: typeMap[puzzle.type].name,
          dimension: puzzle.dimension,
          difficulty: puzzle.difficulty
        };
      })
    });
    profiler.log('archiveByType', processStart);
  } catch (e) {
    next(e)
  }
});


// List of all old puzzles by author
router.get('/types/author/:authorid', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    var typeMap = await util.typeDataMap();
    var author = await User.findById(req.params.authorid, "name");

    const puzzles = await Puzzle.find({author: req.params.authorid}, "-data").sort({daily: -1});
    res.render('by_type', {
      user: req.user,
      author: author.name,
      puzzles: puzzles
        .filter(puzzle => !puzzle.needLogging)
        .filter(puzzle => !util.isHiddenType(typeMap[puzzle.type]))
        .map(puzzle => {
        return {
          code: puzzle.code,
          category: typeMap[puzzle.type].category,
          type: typeMap[puzzle.type].name,
          dimension: puzzle.dimension,
          difficulty: puzzle.difficulty
        };
      })
    });
    profiler.log('archiveByAuthor', processStart);
  } catch (e) {
    next(e)
  }
});

// List of example puzzles
router.get('/examples', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    var typeMap = await util.typeDataMap();

    const puzzles = await Puzzle.find({tag: "example" }, "-data");
    res.render('examples', {
      user: req.user,
      puzzles: puzzles
        .filter(puzzle => !util.isHiddenType(typeMap[puzzle.type]))
        .map(puzzle => {
        return {
          code: puzzle.code,
          category: typeMap[puzzle.type].category,
          type: typeMap[puzzle.type].name,
          dimension: puzzle.dimension,
        };
      })
    });
    profiler.log('archiveExamples', processStart);
  } catch (e) {
    next(e)
  }
});

// Solving time for a single puzzle
router.get(['/:puzzleid/scores','/:puzzleid/times'],
  async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    var date = Date.parse(req.params.puzzleid);
    if (date) {
      var puzzle = await cache.readPuzzleByDate(date);
    } else {
      var puzzle = await cache.readPuzzle(req.params.puzzleid);
    }
    if (!puzzle || puzzle.hiddenScore) {
      res.sendStatus(404);
      return;
    }
    var puzzleType = puzzle.type;
    const type = await cache.readPuzzleType(puzzle.type);
    if (type) {
      puzzleType = type.name;
    }

    const times = await cache.readSolvingTime(puzzle.code);
    const notFinished = times.filter(time => typeof time.solvingTime=="undefined").map(time => time.userName);

    res.render('times', {
      user: req.user,
      puzzle: {
        code: puzzle.code,
        type: puzzleType,
        dimension: puzzle.dimension,
        daily: puzzle.daily,
      },
      times: times
        .filter(time => typeof time.solvingTime!="undefined")
        .filter(time => typeof time.hidden=="undefined" || time.hidden==false)
        .sort((time1, time2) => time1.solvingTime-time2.solvingTime)
        .map(time => {
          return {
            userId: time.userId,
            userName: time.userName,
            time: util.timeToString(time.solvingTime),
            errors: time.errCount
          };
        }),
      notFinished: notFinished
    });
    profiler.log('archiveScores', processStart);
  } catch (e) {
    next(e)
  }
});

// Socre for today's puzzle
router.get('/scores', (req, res) => {
  var d = new Date().toISOString().split('T')[0];
  res.redirect('/archive/' + d + '/scores');
});

// Author puzzle list
router.get('/author', ensureAuthenticated, async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    if (!req.user || req.user.role != "author") {
      res.sendStatus(404);
      return;
    }
    var onlyFuture = req.query.future=="true" || typeof req.query.future=="undefined";

    var typeMap = await util.typeDataMap();
    var timesMap = await util.bestSolvingTimeMap(true);

    var filter = {author: req.user._id};

    if (onlyFuture) {
      filter = {
        author: req.user._id,
        $and : [
          {tag: {$ne: "example"}},
          {tag: {$ne: "public"}}
        ],
        $or: [
          {daily: {$gt: new Date()}},
          {daily: {$exists: false}}
        ]
      }
    }
    const puzzles = await Puzzle.find(filter, "-data").sort({daily: -1});
    var typePuzzleCount = Object.entries(typeMap).reduce((map, [key, value]) => {
      map[key] = {name: value.name, puzzleCount: 0, properties: value.properties};
      return map;
    }, {});
    const futurePuzzles = await Puzzle.find({tag: "daily", $or: [{daily: {$gt: new Date()}}, {daily: {$exists: false}}]}, "-data").sort({daily: -1});
    futurePuzzles.forEach(puzzle => typePuzzleCount[puzzle.type].puzzleCount++);
    res.render('author', {
      user: req.user,
      future: onlyFuture,
      types: Object.entries(typeMap)
        .filter(([key, value]) => !value.properties || !value.properties.noEdit)
        .sort(([key1, value1],[key2, value2]) => key1.localeCompare(key2))
        .map(([key, value]) => {
          return {
            code: key,
            name: value.name,
            properties: value.properties
          };
      }),
      puzzles: puzzles
        .filter(puzzle => !onlyFuture || typeof puzzle.contest=="undefined" || puzzle.contest.puzzleDate > new Date())
        .map(puzzle => {
          return {
            code: puzzle.code,
            type: typeMap[puzzle.type].name,
            dimension: puzzle.dimension,
            tag: puzzle.tag,
            daily: puzzle.daily,
            puzzleDate: puzzle.daily?puzzle.daily:(typeof puzzle.contest=="undefined"?"":puzzle.contest.puzzleDate),
            time: util.timeToString(timesMap[puzzle.code]),
            published: puzzle.published
          };
      }),
      dailyQueue: Object.entries(typePuzzleCount)
        .map(([key, value]) => {
        return {
          code: key,
          name: value.name,
          count: value.puzzleCount
        };
      })
    });
    profiler.log('authorPuzzleList', processStart);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
