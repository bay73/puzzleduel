const express = require('express');
const router = express.Router();
// Puzzle model
const Puzzle = require('../models/Puzzle');
// PuzzleType model
const PuzzleType = require('../models/PuzzleType');
// UserActionLog model
const UserActionLog = require('../models/UserActionLog');
// UserSolvingTime model
const UserSolvingTime = require('../models/UserSolvingTime');

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
type_cheker["snake_max"] = require('../puzzle_types/snake_max')
type_cheker["point_a_star"] = require('../puzzle_types/point_a_star')
type_cheker["paint_by_max"] = require('../puzzle_types/paint_by_max')
type_cheker["paint_battenberg"] = require('../puzzle_types/paint_battenberg')
type_cheker["ripple_effect"] = require('../puzzle_types/ripple_effect')
type_cheker["fuzuli"] = require('../puzzle_types/fuzuli')
type_cheker["easy_as_abc"] = require('../puzzle_types/easy_as_abc')
type_cheker["doubleblock"] = require('../puzzle_types/doubleblock')
type_cheker["skyscrapers"] = require('../puzzle_types/skyscrapers')
type_cheker["sudoku_classic"] = require('../puzzle_types/sudoku_classic')
type_cheker["sudoku_antiknight"] = require('../puzzle_types/sudoku_antiknight')
type_cheker["sudoku_notouch"] = require('../puzzle_types/sudoku_notouch')
type_cheker["sudoku_x_sums"] = require('../puzzle_types/sudoku_x_sums')
type_cheker["sudoku_skyscrapers"] = require('../puzzle_types/sudoku_skyscrapers')
type_cheker["sudoku_odd_even_big_small"] = require('../puzzle_types/sudoku_odd_even_big_small')
type_cheker["sudoku_diagonal"] = require('../puzzle_types/sudoku_diagonal')
type_cheker["sudoku_antidiagonal"] = require('../puzzle_types/sudoku_antidiagonal')
type_cheker["sudoku_square_number"] = require('../puzzle_types/sudoku_square_number')
type_cheker["every_second_turn"] = require('../puzzle_types/every_second_turn')
type_cheker["simple_loop"] = require('../puzzle_types/simple_loop')
type_cheker["loop_minesweeper"] = require('../puzzle_types/loop_minesweeper')
type_cheker["chat_room"] = require('../puzzle_types/chat_room')
type_cheker["masyu"] = require('../puzzle_types/masyu')

function logAction(user, puzzleId, action, ipInfo, data) {
  const newUserActionLog = new UserActionLog({
    userId: user._id,
    puzzleId: puzzleId,
    action: action,
    ipInfo: ipInfo
  });
  if (data) {
    newUserActionLog.data = data;
  }
  newUserActionLog.save();
}

async function writeSilvingTime(user, puzzleId, hidden) {
  const time = await UserSolvingTime.findOne({userId: user._id, puzzleId: puzzleId});
  if (time != null) {
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
  if (! startTime || solveTime < startTime) {
    return;
  }
  const newUserSolvingTime = new UserSolvingTime({
    userId: user._id,
    userName: user.name,
    puzzleId: puzzleId,
    solvingTime: solveTime - startTime,
    errCount: errCount
  });
  if (hidden) {
    newUserSolvingTime.hidden = true;
  }
  newUserSolvingTime.save();
}

// Read puzzle header
router.get('/:puzzleid', async (req, res, next) => {
  try {
    const puzzle = await Puzzle.findOne({code: req.params.puzzleid}, "-_id -data -code");
    if (!puzzle) {
      res.sendStatus(404);
      return;
    }
    var returnObj = puzzle.toObject();
    type = await PuzzleType.findOne({ code: returnObj.type }, "-_id -code -puzzleJs -puzzleObj");
    if(type) {
      returnObj.type = type.toObject();
    }
    res.json(returnObj);
  } catch (e) {
    next(e);
  }
});

// Read puzzle data
router.get('/:puzzleid/start', async (req, res, next) => {
  try {
    const puzzle = await Puzzle.findOne({code: req.params.puzzleid}, 'data tag daily author');
    if (!puzzle) {
      res.sendStatus(404);
      return;
    }
    if (puzzle.hidden) {
      if (!req.user) {
        res.sendStatus(404);
        return;
      }
      if (!puzzle.author.equals(req.user._id) && req.user.role != 'test') {
        res.sendStatus(404);
        return;
      }
    }
    if (puzzle.needLogging) {
      if (!req.user) {
        res.status(403).send(res.__('This puzzle is competitive and you should log in to solve it! ' +
                             'Check our <a href="/archive">archive</a> to try puzzles without registration'));
        return;
      }
      if (req.user.role == "blocked") {
        res.status(403).send('Your account is blocked. Please contact the side admin');
        return;
      }
      if (req.user.role == "admin") {
        res.status(403).send('Admin account cannot solve contest puzzles');
        return;
      }
      if (req.user.role != "test") {
        logAction(req.user, req.params.puzzleid, "start", req.ipInfo);
      }
    }
    res.json(JSON.parse(puzzle.data));
  } catch (e) {
    next(e);
  }
});

// Read puzzle data
router.get('/:puzzleid/get', async (req, res, next) => {
  try {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const puzzle = await Puzzle.findOne({code: req.params.puzzleid}, 'data daily tag author');
    if (!puzzle) {
      res.sendStatus(404);
      return;
    }
    var puzzleObj = puzzle.toObject();
    if (!puzzleObj.author || !puzzleObj.author.equals(req.user._id)) {
      res.sendStatus(404);
      return;
    }
    res.json(JSON.parse(puzzle.data));
  } catch (e) {
    next(e);
  }
});

// Check puzzle solution
router.post('/:puzzleid/check', async (req, res, next) => {
  try {
    const puzzle = await Puzzle.findOne({code: req.params.puzzleid});
    if (!puzzle) {
      res.sendStatus(404);
      return;
    }
    var result = type_cheker[puzzle.type].check(puzzle.dimension, JSON.parse(puzzle.data), req.body);
    if (puzzle.needLogging) {
      if (!req.user) {
        res.status(403).send(res.__('You should log in to solve this puzzle!'));
        return;
      }
      if (req.user.role != "test") {
        logAction(
          req.user,
          req.params.puzzleid,
          result.status == "OK" ? "solved" : "submitted",
          req.ipInfo,
          result.status == "OK" ? JSON.stringify(req.body) : null
        );
        var hidden = puzzle.author.equals(req.user._id);
        if (result.status == "OK") {
          writeSilvingTime(req.user, req.params.puzzleid, hidden);
        }
      }
    }
    result.status = res.__(result.status);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

// Check puzzle solution
router.post('/:puzzleid/edit', async (req, res, next) => {
  try {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const puzzle = await Puzzle.findOne({code: req.params.puzzleid});
    if (!puzzle) {
      res.sendStatus(404);
      return;
    }
    if (!puzzle) {
      res.sendStatus(404);
      return;
    }
    var puzzleObj = puzzle.toObject();
    if (!puzzleObj.author || !puzzleObj.author.equals(req.user._id)) {
      res.sendStatus(404);
      return;
    }
    if (puzzle.published) {
      res.status(403).send(res.__('Puzzle is already published, changes are not allowed!'));
      return;
    }
    var tag = req.body["tag"];
    var data = req.body;
    delete data["tag"];
    var newData = JSON.stringify(data);
    if (puzzle.data != newData) {
      await UserSolvingTime.deleteMany({puzzleId: puzzle.code});
      await UserActionLog.deleteMany({puzzleId: puzzle.code});
    }
    puzzle.data = newData;
    puzzle.tag = tag;
    await puzzle.save();
    res.json({status: "OK"});
  } catch (e) {
    next(e);
  }
});

module.exports = router;

