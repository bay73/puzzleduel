const express = require('express');
const router = express.Router();

const PuzzleSet = require('../models/PuzzleSet');
const Puzzle = require('../models/Puzzle');
const util = require('../utils/puzzle_util');


router.get('/:setid', async (req, res, next) => {
  try {
    const set = await PuzzleSet.findOne({code: req.params.setid});
    if (!set) {
      res.sendStatus(404);
      return;
    }
    if (set.tag.includes("hidden") && !set.author.equals(req.user._id)) {
      res.sendStatus(404);
      return;
    }
    var typeMap = await util.typeNameMap();
    var userMap = await util.userNameMap();
    var puzzleMap = {};
    const puzzles = await Puzzle.find();
    puzzles.forEach(puzzle => {puzzleMap[puzzle.code] = puzzle.toObject();});
    var setObj = {code: set.code, name: set.name, description: set.description, authorId: set.author, author: userMap[set.author]};
    var locale = req.getLocale();
    if (locale != 'en' && set.translations) {
      if (set.translations[locale] && set.translations[locale].name) {
        setObj.name = set.translations[locale].name;
      }
      if (set.translations[locale] && set.translations[locale].description) {
        setObj.description = set.translations[locale].description;
      }
    }
    var puzzleList = set.puzzles
      .map(puzzle => {
        puzzleObj = puzzleMap[puzzle.puzzleId];
        return {
          num: puzzle.puzzleNum,
          code: puzzle.puzzleId,
          type: typeMap[puzzleObj.type],
          dimension: puzzleObj.dimension,
          difficulty: puzzleObj.difficulty,
        };
      });
    res.render('puzzleset', {user: req.user, set: setObj, puzzles: puzzleList})
  } catch (e) {
    next(e);
  }
});

router.get('/:contestid/recount', async (req, res, next) => {
  try {
    if (!req.user || req.user.role != "admin") {
      res.sendStatus(404);
      return;
    }
    var recountResult = await recountContest(req.params.contestid)
    if (!recountResult) {
      res.sendStatus(404);
      return;
    }
    res.redirect('/contest/' + req.params.contestid + "/results");
  } catch (e) {
    next(e);
  }
});

module.exports = router;

