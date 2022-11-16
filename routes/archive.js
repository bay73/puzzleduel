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
    var filter = {daily: {$lte: new Date()} };
    if (req.user && req.user.role == "test") {
      filter = {};
    }
    if (req.user) {
      var userTimesPromise = util.userSolvingTimeMap(req.user._id, false);
    } else {
      var userTimesPromise = Promise.resolve({});
    }

    const [userTimesMap, timesMap, typeMap, puzzles] = await Promise.all([
      userTimesPromise,
      util.bestSolvingTimeMap(false),
      cache.readPuzzleTypes(),
      Puzzle.find(filter, "-data").sort({daily: -1})
    ]);

    res.render('archive', {
      user: req.user,
      puzzles: puzzles.map(puzzle => {
        return {
          code: puzzle.code,
          type: typeMap[puzzle.type].name,
          dimension: puzzle.dimension,
          daily: puzzle.daily,
          competitive: puzzle.needLogging,
          userTime: userTimesMap[puzzle.code]?util.timeToString(userTimesMap[puzzle.code].time):"",
          userErr: userTimesMap[puzzle.code]?userTimesMap[puzzle.code].errors:0,
          difficulty: puzzle.difficulty,
          rating: puzzle.needLogging?null:puzzle.rating,
          time: util.timeToString(timesMap[puzzle.code])
        };
      })
    });
    profiler.log('archiveDaily', processStart);
  } catch (e) {
    next(e)
  }
});

// List of puzzles for testing
router.get(['/','/tester'],
  async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    if (!req.user || !req.user.isTester) {
      res.sendStatus(404);
      return;
    }
    let from = new Date();
    from.setDate(from.getDate() + 1);
    let to = new Date();
    to.setDate(to.getDate() + 6);
    var filter = {$or: [{daily: {$gte: from, $lte: to} }, {'contest.puzzleDate': {$gte: from, $lte: to} }] };
    if (req.user) {
      var userTimesPromise = util.userSolvingTimeMap(req.user._id, true);
    }

    const [userTimesMap, typeMap, puzzles] = await Promise.all([
      userTimesPromise,
      cache.readPuzzleTypes(),
      Puzzle.find(filter, "-data")
    ]);

    res.render('tester', {
      user: req.user,
      puzzles: puzzles.map(puzzle => {
        return {
          code: puzzle.code,
          type: typeMap[puzzle.type].name,
          dimension: puzzle.dimension,
          userTime: userTimesMap[puzzle.code]?util.timeToString(userTimesMap[puzzle.code].time):""
        };
      })
    });
    profiler.log('tester', processStart);
  } catch (e) {
    next(e)
  }
});

// List of all old puzzles
router.get('/types', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const [typeMap, puzzles] = await Promise.all([
      cache.readPuzzleTypes(),
      Puzzle.find({}, "-data")
    ]);
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


// List of the best puzzles
router.get(['/best','/best/:category'], async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const [typeMap, puzzles, userMap] = await Promise.all([
      cache.readPuzzleTypes(),
      Puzzle.find({}, "-data"),
      util.userNameMap()
    ]);
    const categories = [];
    Object.entries(typeMap).forEach(([key,type]) => {if(!categories.includes(type.category)) categories.push(type.category)});
    res.render('best_puzzles', {
      user: req.user,
      listtype: "best",
      category: req.params.category,
      categories: categories,
      puzzles: puzzles
        .filter(puzzle => typeof puzzle.rating!="undefined" && puzzle.rating.rating > 0)
        .filter(puzzle => !puzzle.needLogging)
        .filter(puzzle => !util.isHiddenType(typeMap[puzzle.type]))
        .filter(puzzle => typeof req.params.category=="undefined" || typeMap[puzzle.type].category.substr(3)==req.params.category)
        .filter(puzzle => puzzle.rating.count > 10)
        .sort((p1, p2) => (p2.rating.rating==p1.rating.rating?p2.rating.count - p1.rating.count:p2.rating.rating - p1.rating.rating))
        .slice(0,50)
        .map(puzzle => {
        return {
          code: puzzle.code,
          category: typeMap[puzzle.type].category,
          type: typeMap[puzzle.type].name,
          dimension: puzzle.dimension,
          difficulty: puzzle.difficulty,
          rating: puzzle.rating,
          author: userMap[puzzle.author]
        };
      })
    });
    profiler.log('archiveBest', processStart);
  } catch (e) {
    next(e)
  }
});

// List of non rated puzzles
router.get(['/nonrated','/nonrated/:category'], async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const [typeMap, puzzles, userMap] = await Promise.all([
      cache.readPuzzleTypes(),
      Puzzle.find({}, "-data"),
      util.userNameMap()
    ]);
    const categories = [];
    Object.entries(typeMap).forEach(([key,type]) => {if(!categories.includes(type.category)) categories.push(type.category)});
    res.render('best_puzzles', {
      user: req.user,
      listtype: "non_rated",
      category: req.params.category,
      categories: categories,
      puzzles: puzzles
        .filter(puzzle => typeof puzzle.rating.rating == "undefined" || puzzle.rating.rating <= 0 || puzzle.rating.count <= 10)
        .filter(puzzle => !puzzle.needLogging)
        .filter(puzzle => !util.isHiddenType(typeMap[puzzle.type]))
        .filter(puzzle => typeof req.params.category=="undefined" || typeMap[puzzle.type].category.substr(3)==req.params.category)
        .sort((p1, p2) => (p2.rating.rating==p1.rating.rating?p2.rating.count - p1.rating.count:p2.rating.rating - p1.rating.rating))
        .slice(0,50)
        .map(puzzle => {
        return {
          code: puzzle.code,
          category: typeMap[puzzle.type].category,
          type: typeMap[puzzle.type].name,
          dimension: puzzle.dimension,
          difficulty: puzzle.difficulty,
          rating: puzzle.rating,
          author: userMap[puzzle.author]
        };
      })
    });
    profiler.log('archiveBest', processStart);
  } catch (e) {
    next(e)
  }
});

// List of all old puzzles by author
router.get('/types/author/:authorid', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const [typeMap, author, puzzles] = await Promise.all([
      cache.readPuzzleTypes(),
      cache.readUserName(req.params.authorid),
      Puzzle.find({author: req.params.authorid}, "-data").sort({daily: -1})
    ]);

    res.render('by_type', {
      user: req.user,
      author: author,
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
    const [typeMap, puzzles] = await Promise.all([
      cache.readPuzzleTypes(),
      Puzzle.find({tag: "example" }, "-data")
    ]);
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
    let isAdmin = req.user && req.user.role == "admin";
    if (!puzzle || (puzzle.hiddenScore && !isAdmin)) {
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
    var today = new Date();
    today.setDate(today.getDate()-30);
    var replayAvailable = puzzle.publishDate > today;

    res.render('times', {
      user: req.user,
      puzzle: {
        code: puzzle.code,
        type: puzzleType,
        dimension: puzzle.dimension,
        daily: puzzle.daily,
        needLogging: puzzle.needLogging,
        canReplay: replayAvailable && !puzzle.needLogging,
        rating: puzzle.needLogging?null:puzzle.rating,
        difficulty: puzzle.needLogging?null:puzzle.difficulty
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

// Replay solution for a single puzzle and user
router.get('/:puzzleid/replay/:userid', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    var puzzle = await cache.readPuzzle(req.params.puzzleid);
    if (!puzzle) {
      res.sendStatus(404);
      return;
    }
    const [puzzleObj, solverName] = await Promise.all([
      util.puzzleToPresent(puzzle, req.getLocale()),
      cache.readUserName(req.params.userid)
    ]);
    res.render('single_replay', {
      user: req.user,
      loguserid: req.params.userid,
      logusername: solverName,
      puzzle: puzzleObj
    });
    profiler.log('archiveLog', processStart);
  } catch (e) {
    next(e)
  }
});

// Author puzzle list
router.get('/author', ensureAuthenticated, async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    if (!req.user || req.user.role != "author") {
      res.sendStatus(404);
      return;
    }
    var publishFilter = req.query.publish;
    if (typeof publishFilter=="undefined") {
      if (req.query.future=="true") {
        publishFilter = "false";
      }
      if (req.query.future=="false") {
        publishFilter = "all";
      }
    }
    if (typeof publishFilter=="undefined") {
      publishFilter = "false";
    }

    var typeMap = await cache.readPuzzleTypes();
    var timesMap = await util.bestSolvingTimeMap(true);

    var filter = {author: req.user._id};
    if (publishFilter == "true") {
      filter = {
        author: req.user._id,
        $or : [
          {tag: {$eq: "example"}},
          {tag: {$eq: "public"}},
          {daily: {$lte: new Date()}},
          {'contest.puzzleDate': {$lte: new Date()}}
        ]
      }
    }
    if (publishFilter == "false") {
      filter = {
        author: req.user._id,
        $or : [
          {$and: [
            {tag: {$eq: "contest"}},
            {'contest.puzzleDate': {$gt: new Date()}}
          ]},
          {$and: [
            {tag: {$eq: "daily"}},
            {$or: [
              {daily: {$gt: new Date()}},
              {daily: {$exists: false}},
            ]},
          ]},
          {tag: {$eq: "temporary"}},
        ],
      }
    }
    const puzzles = await Puzzle.find(filter, "-data").sort({daily: -1});
    var typePuzzleCount = Object.entries(typeMap).reduce((map, [key, value]) => {
      map[key] = {name: value.name, puzzleCount: 0, newCount: 0, lastDate: null, properties: value.properties};
      return map;
    }, {});
    const allPuzzles = await Puzzle.find({tag: "daily"}, "-data");
    allPuzzles.forEach(puzzle => {
      typePuzzleCount[puzzle.type].puzzleCount++;
      if (puzzle.daily) {
        if (puzzle.daily < Date.now()) {
          typePuzzleCount[puzzle.type].lastDate = Math.max(typePuzzleCount[puzzle.type].lastDate, puzzle.daily);
        } else {
          typePuzzleCount[puzzle.type].lastDate = Math.max(typePuzzleCount[puzzle.type].lastDate, Date.now());
        }
      } else {
        typePuzzleCount[puzzle.type].newCount++;
      }
    });
    res.render('author', {
      user: req.user,
      publish: publishFilter,
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
        .map(puzzle => {
          return {
            code: puzzle.code,
            type: typeMap[puzzle.type].name,
            dimension: puzzle.dimension,
            tag: puzzle.tag,
            daily: puzzle.daily,
            puzzleDate: puzzle.daily?puzzle.daily:(typeof puzzle.contest=="undefined"?"":puzzle.contest.puzzleDate),
            time: util.timeToString(timesMap[puzzle.code]),
            published: puzzle.published,
            rating: puzzle.rating
          };
      }),
      typesRating: Object.entries(typePuzzleCount)
        .map(([key, value]) => {
        return {
          code: key,
          name: value.name,
          rating: Math.round(((Date.now() - value.lastDate)/(1000*60*60*24) + 50) / (10 + 3*Math.min(value.newCount, 5) + Math.min(value.puzzleCount, 10 )))
        };
      })
    });
    profiler.log('authorPuzzleList', processStart);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
