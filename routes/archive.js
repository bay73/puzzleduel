const express = require('express');
const router = express.Router();
const Puzzle = require('../models/Puzzle');
const PuzzleType = require('../models/PuzzleType');
const UserSolvingTime = require('../models/UserSolvingTime');
const util = require('../utils/puzzle_util');

const ensureAuthenticated = require('../config/auth').ensureAuthenticated;

// List of daily puzzles
router.get(['/','/daily'],
  async (req, res, next) => {
  try {
    var timesMap = await util.bestSolvingTimeMap(false);
    var typeMap = await util.typeNameMap();

    var filter = {daily: {$lte: new Date()} };
    if (req.user && req.user.role == "test") {
      filter = {};
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
          time: util.timeToString(timesMap[puzzle.code])
        };
      })
    });
  } catch (e) {
    next(e)
  }
});

// List of all old puzzles
router.get('/types', async (req, res, next) => {
  try {
    var typeMap = await util.typeDataMap();

    const puzzles = await Puzzle.find({}, "-data").sort({daily: -1});
    res.render('by_type', {
      user: req.user,
      puzzles: puzzles
        .filter(puzzle => !puzzle.needLogging)
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
  } catch (e) {
    next(e)
  }
});

// List of example puzzles
router.get('/examples', async (req, res, next) => {
  try {
    var typeMap = await util.typeDataMap();

    const puzzles = await Puzzle.find({tag: "example" }, "-data");
    res.render('examples', {
      user: req.user,
      puzzles: puzzles.map(puzzle => {
        return {
          code: puzzle.code,
          category: typeMap[puzzle.type].category,
          type: typeMap[puzzle.type].name,
          dimension: puzzle.dimension,
        };
      })
    });
  } catch (e) {
    next(e)
  }
});

// Solving time for a single puzzle
router.get(['/:puzzleid/scores','/:puzzleid/times'],
  async (req, res, next) => {
  try {
    var date = Date.parse(req.params.puzzleid);
    var filter = {code: req.params.puzzleid};
    if (date) {
      filter = {daily: date};
    }
    puzzle = await Puzzle.findOne(filter, "-data");
    if (!puzzle || puzzle.hiddenScore) {
      res.sendStatus(404);
      return;
    }
    var puzzleType = puzzle.type;
    const type = await PuzzleType.findOne({code: puzzle.type}, "name");
    if (type) {
      puzzleType = type.name;
    }

    const times = await UserSolvingTime.find({puzzleId: puzzle.code, solvingTime: {$exists: true}}).sort("solvingTime");
    const notFinished = await UserSolvingTime.find({puzzleId: puzzle.code, solvingTime: {$exists: false}}, "userName").distinct("userName");;
    res.render('times', {
      user: req.user,
      puzzle: {
        code: puzzle.code,
        type: puzzleType,
        dimension: puzzle.dimension,
        daily: puzzle.daily,
      },
      times: times
        .filter(time => typeof time.hidden=="undefined" || time.hidden==false)
        .map(time => {
          return {
            userName: time.userName,
            time: util.timeToString(time.solvingTime),
            errors: time.errCount
          };
        }),
      notFinished: notFinished
    });
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
    if (!req.user || req.user.role != "author") {
      res.sendStatus(404);
      return;
    }

    var typeMap = await util.typeDataMap();
    var timesMap = await util.bestSolvingTimeMap(true);

    var filter = {author: req.user._id};

    if (req.query.future) {
      filter = {
        author: req.user._id,
        $or: [
          {daily: {$gt: new Date()}},
          {daily: {$exists: false}}
        ]
      }
    }
    const puzzles = await Puzzle.find(filter, "-data").sort({daily: -1});
    var typePuzzleCount = Object.entries(typeMap).reduce((map, [key, value]) => {
      map[key] = {name: value.name, puzzleCount: 0};
      return map;
    }, {});
    const futurePuzzles = await Puzzle.find({tag: "daily", $or: [{daily: {$gt: new Date()}}, {daily: {$exists: false}}]}, "-data").sort({daily: -1});
    futurePuzzles.forEach(puzzle => typePuzzleCount[puzzle.type].puzzleCount++);
    res.render('author', {
      user: req.user,
      future: req.query.future,
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
      puzzles: puzzles.map(puzzle => {
        return {
          code: puzzle.code,
          type: typeMap[puzzle.type].name,
          dimension: puzzle.dimension,
          tag: puzzle.tag,
          daily: puzzle.daily,
          time: util.timeToString(timesMap[puzzle.code]),
          published: puzzle.published
        };
      }),
      dailyQueue: Object.entries(typePuzzleCount).map(([key, value]) => {
        return {
          code: key,
          name: value.name,
          count: value.puzzleCount
        };
      })
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
