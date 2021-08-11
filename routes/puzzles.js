const express = require('express');
const router = express.Router();
// Puzzle model
const Puzzle = require('../models/Puzzle');
// UserActionLog model
const UserActionLog = require('../models/UserActionLog');
// UserSolvingTime model
const UserSolvingTime = require('../models/UserSolvingTime');
const PuzzleComment = require('../models/PuzzleComment');
const profiler = require('../utils/profiler');
const cache = require('../utils/cache');

const type_cheker = {};

type_cheker["tapa_classic"] = require('../puzzle_types/tapa_classic')
type_cheker["cave_classic"] = require('../puzzle_types/cave_classic')
type_cheker["yin_yang_classic"] = require('../puzzle_types/yin_yang_classic')
type_cheker["minesweeper_classic"] = require('../puzzle_types/minesweeper_classic')
type_cheker["queens"] = require('../puzzle_types/queens')
type_cheker["akari"] = require('../puzzle_types/akari')
type_cheker["starbattle"] = require('../puzzle_types/starbattle')
type_cheker["nurikabe"] = require('../puzzle_types/nurikabe')
type_cheker["clouds"] = require('../puzzle_types/clouds')
type_cheker["easy_as_coral"] = require('../puzzle_types/easy_as_coral')
type_cheker["snake_simple"] = require('../puzzle_types/snake_simple')
type_cheker["snake_dutch"] = require('../puzzle_types/snake_dutch')
type_cheker["snake_belarusian"] = require('../puzzle_types/snake_belarusian')
type_cheker["snake_max"] = require('../puzzle_types/snake_max')
type_cheker["snake_scope"] = require('../puzzle_types/snake_scope')
type_cheker["point_a_star"] = require('../puzzle_types/point_a_star')
type_cheker["paint_by_max"] = require('../puzzle_types/paint_by_max')
type_cheker["paint_battenberg"] = require('../puzzle_types/paint_battenberg')
type_cheker["ripple_effect"] = require('../puzzle_types/ripple_effect')
type_cheker["suguru"] = require('../puzzle_types/suguru')
type_cheker["fuzuli"] = require('../puzzle_types/fuzuli')
type_cheker["easy_as_abc"] = require('../puzzle_types/easy_as_abc')
type_cheker["doubleblock"] = require('../puzzle_types/doubleblock')
type_cheker["skyscrapers"] = require('../puzzle_types/skyscrapers')
type_cheker["magic_snail"] = require('../puzzle_types/magic_snail')
type_cheker["sudoku_classic"] = require('../puzzle_types/sudoku_classic')
type_cheker["sudoku_antiknight"] = require('../puzzle_types/sudoku_antiknight')
type_cheker["sudoku_notouch"] = require('../puzzle_types/sudoku_notouch')
type_cheker["sudoku_x_sums"] = require('../puzzle_types/sudoku_x_sums')
type_cheker["sudoku_skyscrapers"] = require('../puzzle_types/sudoku_skyscrapers')
type_cheker["sudoku_odd_even_big_small"] = require('../puzzle_types/sudoku_odd_even_big_small')
type_cheker["sudoku_diagonal"] = require('../puzzle_types/sudoku_diagonal')
type_cheker["sudoku_antidiagonal"] = require('../puzzle_types/sudoku_antidiagonal')
type_cheker["sudoku_square_number"] = require('../puzzle_types/sudoku_square_number')
type_cheker["sudoku_irregular"] = require('../puzzle_types/sudoku_irregular')
type_cheker["sudoku_fortress"] = require('../puzzle_types/sudoku_fortress')
type_cheker["sudoku_even_odd"] = require('../puzzle_types/sudoku_even_odd')
type_cheker["sudoku_odd"] = require('../puzzle_types/sudoku_odd')
type_cheker["sudoku_consecutive"] = require('../puzzle_types/sudoku_consecutive')
type_cheker["every_second_turn"] = require('../puzzle_types/every_second_turn')
type_cheker["every_second_straight"] = require('../puzzle_types/every_second_straight')
type_cheker["simple_loop"] = require('../puzzle_types/simple_loop')
type_cheker["loop_minesweeper"] = require('../puzzle_types/loop_minesweeper')
type_cheker["chat_room"] = require('../puzzle_types/chat_room')
type_cheker["masyu"] = require('../puzzle_types/masyu')
type_cheker["gaps"] = require('../puzzle_types/gaps')
type_cheker["hexa_fence"] = require('../puzzle_types/hexa_fence')
type_cheker["hexa_islands"] = require('../puzzle_types/hexa_islands')
type_cheker["hexa_paint"] = require('../puzzle_types/hexa_paint')
type_cheker["hexa_minesweeper"] = require('../puzzle_types/hexa_minesweeper')
type_cheker["hitori"] = require('../puzzle_types/hitori')
type_cheker["lits"] = require('../puzzle_types/lits')
type_cheker["heyawake"] = require('../puzzle_types/heyawake')
type_cheker["lighthouses"] = require('../puzzle_types/lighthouses')
type_cheker["fence"] = require('../puzzle_types/fence')
type_cheker["passage"] = require('../puzzle_types/passage')
type_cheker["maxi_loop"] = require('../puzzle_types/maxi_loop')
type_cheker["alternate_loop"] = require('../puzzle_types/alternate_loop')
type_cheker["abc_division"] = require('../puzzle_types/abc_division')
type_cheker["spiral_galaxies"] = require('../puzzle_types/spiral_galaxies')
type_cheker["shikaku"] = require('../puzzle_types/shikaku')
type_cheker["foseruzu"] = require('../puzzle_types/foseruzu')
type_cheker["neighbors"] = require('../puzzle_types/neighbors')
type_cheker["kropki"] = require('../puzzle_types/kropki')
type_cheker["black_white"] = require('../puzzle_types/black_white')
type_cheker["double_back"] = require('../puzzle_types/double_back')
type_cheker["chaos"] = require('../puzzle_types/chaos')
type_cheker["kuromasu"] = require('../puzzle_types/kuromasu')
type_cheker["top_heavy"] = require('../puzzle_types/top_heavy')
type_cheker["country_road"] = require('../puzzle_types/country_road')
type_cheker["slalom"] = require('../puzzle_types/slalom')
type_cheker["tetro_scope"] = require('../puzzle_types/tetro_scope')
type_cheker["pentomino_touch"] = require('../puzzle_types/pentomino_touch')
type_cheker["araf"] = require('../puzzle_types/araf')
type_cheker["battleships_minesweeper"] = require('../puzzle_types/battleships_minesweeper')
type_cheker["battleships_knight"] = require('../puzzle_types/battleships_knight')
type_cheker["russian_loop"] = require('../puzzle_types/russian_loop')

async function logAction(user, puzzleId, action, ipInfo, data) {
  const newUserActionLog = new UserActionLog({
    userId: user._id,
    puzzleId: puzzleId,
    action: action,
    ipInfo: ipInfo
  });
  if (data) {
    newUserActionLog.data = data;
  }
  await newUserActionLog.save();
  const time = await UserSolvingTime.findOne({userId: user._id, puzzleId: puzzleId});
  if (time != null) {
    return;
  }
  var newUserSolvingTime = new UserSolvingTime({
    userId: user._id,
    userName: user.name,
    puzzleId: puzzleId,
    errCount: 0
  });
  await newUserSolvingTime.save();
}

async function writeSolvingTime(user, puzzleId, hidden, clientTime) {
  const time = await UserSolvingTime.findOne({userId: user._id, puzzleId: puzzleId});
  if (time != null && time.solvingTime != null) {
    return;
  }
  const logs = await UserActionLog.find({userId: user._id, puzzleId: puzzleId}).sort('date');
  var startTime = null;
  var solveTime = null;
  var errCount = 0;
  logs.forEach(log => {
    if (!startTime && log.action == "start") {
      startTime = log.date;
    }
    if (!solveTime && log.action == "solved") {
      solveTime = log.date;
    }
    if (!solveTime && log.action == "submitted") {
      errCount++;
    }
  });
  if (!solveTime) solveTime = new Date();
  if (!startTime || solveTime < startTime) {
    return;
  }
  if (time != null) {
    var newUserSolvingTime = time;
  } else {
    var newUserSolvingTime = new UserSolvingTime({
      userId: user._id,
      userName: user.name,
      puzzleId: puzzleId,
      solvingTime: solveTime - startTime,
      serverTime: solveTime - startTime,
      clientTime: clientTime,
      errCount: errCount
    });
  }
  newUserSolvingTime.userName = user.name;
  newUserSolvingTime.solvingTime = solveTime - startTime;
  newUserSolvingTime.serverTime = solveTime - startTime;
  newUserSolvingTime.clientTime = clientTime;
  newUserSolvingTime.errCount = errCount;
  newUserSolvingTime.date = new Date();
  if (hidden) {
    newUserSolvingTime.hidden = true;
  }
  await newUserSolvingTime.save();
}

// Read puzzle header
router.get('/:puzzleid', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const puzzle = await cache.readPuzzle(req.params.puzzleid);
    if (!puzzle) {
      res.sendStatus(404);
      profiler.log('puzzleHeaderFailed', processStart);
      return;
    }
    var returnObj = puzzle.toObject();
    type = await cache.readPuzzleType(returnObj.type);
    if(type) {
      returnObj.type = type.toObject();
    }
    res.json(returnObj);
    profiler.log('puzzleHeader', processStart);
  } catch (e) {
    next(e);
  }
});

// Read puzzle data
router.get('/:puzzleid/start', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const puzzle = await cache.readPuzzle(req.params.puzzleid);
    if (!puzzle) {
      res.sendStatus(404);
      profiler.log('puzzleStartFailed', processStart);
      return;
    }
    if (puzzle.hidden) {
      if (!req.user) {
        res.sendStatus(404);
        profiler.log('puzzleStartFailed', processStart);
        return;
      }
      if (!puzzle.author.equals(req.user._id) && req.user.role != 'test' && !req.user.isTester) {
        res.status(404).send(res.__('Puzzle is not available yet'));
        profiler.log('puzzleStartFailed', processStart);
        return;
      }
    }
    if (puzzle.needLogging) {
      if (!req.user) {
        res.status(403).send(res.__('This puzzle is competitive and you should log in to solve it! ' +
                             'Check our <a href="/archive">archive</a> to try puzzles without registration'));
        profiler.log('puzzleStartFailed', processStart);
        return;
      }
      if (req.user.role == "blocked") {
        res.status(403).send('Your account is blocked. Please contact the side admin');
        profiler.log('puzzleStartFailed', processStart);
        return;
      }
      if (req.user.role == "admin") {
        res.status(403).send('Admin account cannot solve contest puzzles');
        profiler.log('puzzleStartFailed', processStart);
        return;
      }
      if (req.user.role != "test") {
        await logAction(req.user, req.params.puzzleid, "start", req.ipInfo);
      }
    }
    res.json(JSON.parse(puzzle.data));
    profiler.log('puzzleStart', processStart);
  } catch (e) {
    next(e);
  }
});

// Read puzzle data
router.get('/:puzzleid/get', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const puzzle = await cache.readPuzzle(req.params.puzzleid);
    if (!puzzle) {
      res.sendStatus(404);
      profiler.log('puzzleReadFailed', processStart);
      return;
    }
    if (!puzzle.author || !puzzle.author.equals(req.user._id)) {
      res.sendStatus(404);
      profiler.log('puzzleReadFailed', processStart);
      return;
    }
    res.json(JSON.parse(puzzle.data));
    profiler.log('puzzleRead', processStart);
  } catch (e) {
    next(e);
  }
});

// Check puzzle solution
router.post('/:puzzleid/check', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const puzzle = await cache.readPuzzle(req.params.puzzleid);
    if (!puzzle) {
      res.sendStatus(404);
      profiler.log('puzzleSubmitFailed', processStart);
      return;
    }
    var result = type_cheker[puzzle.type].check(puzzle.dimension, JSON.parse(puzzle.data), req.body);
    if (puzzle.needLogging) {
      if (!req.user) {
        res.status(403).send(res.__('You should log in to solve this puzzle!'));
        profiler.log('puzzleSubmitFailed', processStart);
        return;
      }
      if (req.user.role != "test") {
        await logAction(
          req.user,
          req.params.puzzleid,
          result.status == "OK" ? "solved" : "submitted",
          req.ipInfo,
          result.status == "OK" ? JSON.stringify(req.body) : null
        );
        var hidden = puzzle.author.equals(req.user._id);
        if (result.status == "OK") {
          await writeSolvingTime(req.user, req.params.puzzleid, hidden, req.body.time);
        }
      }
    }
    result.status = res.__(result.status);
    if (req.user) {
      const comment = await PuzzleComment.findOne({userId: req.user._id, puzzleId: req.params.puzzleid});
      if (comment != null) {
        result.rating = comment.rating;
        result.comment = comment.comment;
      }
    }
    res.json(result);
    profiler.log('puzzleSubmit', processStart);
  } catch (e) {
    next(e);
  }
});

// Save puzzle data
router.post('/:puzzleid/edit', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const puzzle = await Puzzle.findOne({code: req.params.puzzleid});
    if (!puzzle) {
      res.sendStatus(404);
      profiler.log('puzzleEditFailed', processStart);
      return;
    }
    var puzzleObj = puzzle.toObject();
    if (!puzzleObj.author || !puzzleObj.author.equals(req.user._id)) {
      res.sendStatus(404);
      profiler.log('puzzleEditFailed', processStart);
      return;
    }
    if (puzzle.published) {
      res.status(403).send(res.__('Puzzle is already published, changes are not allowed!'));
      profiler.log('puzzleEditFailed', processStart);
      return;
    }
    var tag = req.body["tag"];
    var difficulty = req.body["difficulty"];
    var data = req.body;
    delete data["tag"];
    delete data["difficulty"];
    var newData = JSON.stringify(data);
    puzzle.tag = tag;
    puzzle.difficulty = difficulty;
    if (puzzle.data != newData) {
      puzzle.data = newData;
      await Promise.all([
        UserSolvingTime.deleteMany({puzzleId: puzzle.code}),
        UserActionLog.deleteMany({puzzleId: puzzle.code}),
        puzzle.save()
      ]);
    } else {
      await puzzle.save();
    }
    cache.refreshPuzzle(puzzle.code);
    res.json({status: "OK"});
    profiler.log('puzzleEdit', processStart);
  } catch (e) {
    next(e);
  }
});

// Save rating and comment
router.post('/:puzzleid/comment', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    let rating = parseInt(req.body.rating);
    let commentText = req.body.comment;
    if (rating > 0 || commentText.length > 0) {
      const puzzle = await cache.readPuzzle(req.params.puzzleid);
      if (!req.user) {
        res.status(403).send(res.__('You should log in to rate the puzzle!'));
        profiler.log('puzzleCommentFailed', processStart);
        return;
      }
      if (!puzzle) {
        res.sendStatus(404);
        profiler.log('puzzleCommentFailed', processStart);
        return;
      }
      if (puzzle.author.equals(req.user._id)) {
        res.status(403).send(res.__('Author can not rate own puzzles!'));;
        profiler.log('puzzleEditFailed', processStart);
        return;
      }
      const comment = await PuzzleComment.findOne({userId: req.user._id, puzzleId: req.params.puzzleid});
      if (comment != null) {
        var newComment = comment;
      } else {
        var newComment = new PuzzleComment({
        userId: req.user._id,
        userName: req.user.name,
        puzzleId: req.params.puzzleid
        });
      }
      newComment.userName = req.user.name;
      newComment.rating = rating;
      newComment.comment = commentText;
      newComment.save();
    }
    res.json(null);
    profiler.log('puzzleComment', processStart);
  } catch (e) {
    next(e);
  }
});

// Read all comments
router.get('/:puzzleid/comments', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const comments = await PuzzleComment.find({puzzleId: req.params.puzzleid});
    let showAll = req.user && req.user.role == "admin";
    res.render('puzzle_comments', {
      layout: "empty_layout",
      showAll: showAll,
      comments: comments
        .filter(comment => {
          return comment.comment.length > 0 || showAll
        })
        .map(comment => {
          return {
            userName: showAll?comment.userName:"",
            rating: showAll?comment.rating:null,
            comment: comment.comment
          }
      })
    })
    profiler.log('puzzleComment', processStart);
  } catch (e) {
    next(e);
  }
});

// Delete puzzle
router.post('/:puzzleid/delete', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const puzzle = await Puzzle.findOne({code: req.params.puzzleid});
    if (!puzzle) {
      res.sendStatus(404);
      profiler.log('puzzleDeleteFailed', processStart);
      return;
    }
    var puzzleObj = puzzle.toObject();
    if (!puzzleObj.author || !puzzleObj.author.equals(req.user._id)) {
      res.sendStatus(404);
      profiler.log('puzzleDeleteFailed', processStart);
      return;
    }
    if (puzzle.tag == 'daily') {
      if (puzzle.daily) {
        res.status(403).send(res.__('Puzzle is already planned for publishing, deletion is not allowed!'));
        profiler.log('puzzleDeleteFailed', processStart);
        return;
      }
    } else if (puzzle.tag && puzzle.tag != 'temporary') {
      res.status(403).send(res.__('Puzzle is already used, deletion is not allowed!'));
      profiler.log('puzzleDeleteFailed', processStart);
      return;
    }
    await UserSolvingTime.deleteMany({puzzleId: puzzle.code});
    await UserActionLog.deleteMany({puzzleId: puzzle.code});
    await puzzle.delete();
    res.json({status: "OK"});
    profiler.log('puzzleDelete', processStart);
  } catch (e) {
    next(e);
  }
});

module.exports = router;

