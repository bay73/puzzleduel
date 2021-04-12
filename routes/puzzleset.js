const express = require('express');
const router = express.Router();
const uniqid = require('uniqid');

const PuzzleSet = require('../models/PuzzleSet');
const Puzzle = require('../models/Puzzle');
const util = require('../utils/puzzle_util');
const profiler = require('../utils/profiler');

router.get('/', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const userMap = await util.userNameMap();
    const sets = await PuzzleSet.find({});
    res.render('puzzlesets', {
      user: req.user,
      sets: sets.map(set => {
          return {
            code: set.code,
            name: set.name,
            authorId: set.author,
            author: userMap[set.author],
            puzzleCount: set.puzzles.length,
          };
      })
    })
    profiler.log('setList', processStart);
  } catch (e) {
    next(e);
  }
});

router.get('/create', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    if (!req.user || req.user.role != "author") {
      res.sendStatus(404);
      return;
    }
    var setid = uniqid();
    var set = new PuzzleSet({
      code: setid,
      name: "New puzzle set",
      author: req.user._id,
      tag: "public",
    });
    await set.save();
    res.redirect("/puzzleset/" + setid + "/show/0");
    profiler.log('setCreate', processStart);
 } catch (e) {
    next(e);
  }
});

router.get('/:setid', async (req, res, next) => {
  res.redirect('/puzzleset/' + req.params.setid + '/show/0');
});

router.get('/:setid/show/:puzzleid', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const set = await PuzzleSet.findOne({code: req.params.setid});
    if (!set) {
      res.sendStatus(404);
      profiler.log('setShowFailed', processStart);
      return;
    }
    if (set.tag.includes("hidden")) {
      if (!req.user || !set.author.equals(req.user._id)) {
        res.sendStatus(404);
        profiler.log('setShowFailed', processStart);
        return;
      }
    }
    var typeMap = await util.typeDataMap();
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
          type: typeMap[puzzleObj.type].name,
          dimension: puzzleObj.dimension,
          difficulty: puzzleObj.difficulty,
        };
      });
    if (req.params.puzzleid && req.params.puzzleid != '0') {
      var puzzle = await Puzzle.findOne({code: req.params.puzzleid}, "-data");
      if (!puzzle) {
        res.sendStatus(404);
        profiler.log('setShowFailed', processStart);
        return;
      }
      var showPuzzleObj = await util.puzzleToObj(puzzle, req.getLocale());
    }
    res.render('puzzleset', {user: req.user, set: setObj, puzzles: puzzleList, puzzle: showPuzzleObj})
    profiler.log('setShow', processStart);
  } catch (e) {
    next(e);
  }
});

router.get('/:setid/single/:puzzleid', async (req, res, next) => {
  res.redirect('/single/' + req.params.puzzleid);
});

router.post('/:setid/edit', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const set = await PuzzleSet.findOne({code: req.params.setid});
    if (!set) {
      res.sendStatus(404);
      return;
    }
    if (!req.user || !set.author.equals(req.user._id)) {
      res.sendStatus(404);
      return;
    }
    var locale = req.getLocale();
    if (locale == 'en') {
      set.name = req.body.name;
      set.description = req.body.description;
    } else {
      var translations = set.translations;
      if (!translations) {
        translations = {};
      }
      if (!translations[locale]) {
        translations[locale] = {};
      }
      translations[locale].name = req.body.name;
      translations[locale].description = req.body.description;
      set.translations = translations;
      set.markModified("translations");
    }
    await set.save();
    res.redirect('/puzzleset/' + req.params.setid);
    profiler.log('setEdit', processStart);
  } catch (e) {
    next(e);
  }
});

router.post('/:setid/delete', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const set = await PuzzleSet.findOne({code: req.params.setid});
    if (!set) {
      res.sendStatus(404);
      return;
    }
    if (!req.user || !set.author.equals(req.user._id)) {
      res.sendStatus(404);
      return;
    }
    await set.delete();
    res.json({status: "OK"});
    profiler.log('setDelete', processStart);
  } catch (e) {
    next(e);
  }
});

router.get('/:setid/add/:puzzleid', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const set = await PuzzleSet.findOne({code: req.params.setid});
    if (!set) {
      res.sendStatus(404);
      return;
    }
    if (!req.user || !set.author.equals(req.user._id)) {
      res.sendStatus(404);
      return;
    }
    if (set.puzzles.filter(puzzle=>puzzle.puzzleId==req.params.puzzleid).length == 0) {
      const puzzle = await Puzzle.findOne({code: req.params.puzzleid});
      if (puzzle) {
        if (set.puzzles.length==0) {
          var nextNum = 1;
        } else {
          var nextNum = Math.max(...set.puzzles.map(puzzle => puzzle.puzzleNum)) + 1;
        }
        set.puzzles.push({puzzleNum: nextNum, puzzleId: puzzle.code})
        await set.save();
      }
    }
    res.redirect('/puzzleset/' + req.params.setid);
    profiler.log('setAddPuzzle', processStart);
  } catch (e) {
    next(e);
  }
});

router.get('/:setid/up/:puzzleid', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const set = await PuzzleSet.findOne({code: req.params.setid});
    if (!set) {
      res.sendStatus(404);
      return;
    }
    if (!req.user || !set.author.equals(req.user._id)) {
      res.sendStatus(404);
      return;
    }
    if (set.puzzles.filter(puzzle=>puzzle.puzzleId==req.params.puzzleid).length != 0) {
      var num = set.puzzles.filter(puzzle=>puzzle.puzzleId==req.params.puzzleid)[0].puzzleNum;
      var prevNum = num - 1;
      if (set.puzzles.filter(puzzle => puzzle.puzzleNum==prevNum).length != 0) {
        set.puzzles.filter(puzzle => puzzle.puzzleNum==prevNum)[0].puzzleNum = num;
        set.puzzles.filter(puzzle=>puzzle.puzzleId==req.params.puzzleid)[0].puzzleNum = prevNum;
        await set.save();
      }
    }
    res.redirect('/puzzleset/' + req.params.setid);
    profiler.log('setMovePuzzle', processStart);
  } catch (e) {
    next(e);
  }
});

router.get('/:setid/delete/:puzzleid', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const set = await PuzzleSet.findOne({code: req.params.setid});
    if (!set) {
      res.sendStatus(404);
      return;
    }
    if (!req.user || !set.author.equals(req.user._id)) {
      res.sendStatus(404);
      return;
    }
    if (set.puzzles.filter(puzzle=>puzzle.puzzleId==req.params.puzzleid).length != 0) {
      var num = set.puzzles.filter(puzzle=>puzzle.puzzleId==req.params.puzzleid)[0].puzzleNum;
      for( var i = 0; i < set.puzzles.length; i++){
        if ( set.puzzles[i].puzzleId == req.params.puzzleid) {
          set.puzzles.splice(i, 1);
          i--;
        }
        if (set.puzzles[i].puzzleNum > num) {
          set.puzzles[i].puzzleNum--;
        }
      }
      await set.save();
    }
    res.redirect('/puzzleset/' + req.params.setid);
    profiler.log('setDeletePuzzle', processStart);
  } catch (e) {
    next(e);
  }
});

module.exports = router;

