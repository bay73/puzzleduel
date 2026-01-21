const express = require('express');
const router = express.Router();
const profiler = require('../utils/profiler');
const cache = require('../utils/cache');
const util = require('../utils/puzzle_util');
const Puzzle = require('../models/Puzzle');

router.use(require('./common.js'));

// Solving time for a single puzzle
router.get('/:type',
  async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const [typesMap, rawType, puzzles] = await Promise.all([
      cache.readPuzzleTypes(),
      cache.readPuzzleType(req.params.type),
      Puzzle.find({type: req.params.type}, "code dimension hidden type daily tag contest rating difficulty")
    ]);
    const type = util.puzzleTypeToPresent(rawType, req.getLocale());

    let best = puzzles.filter(puzzle => !puzzle.hidden && !puzzle.needLogging).sort((p1, p2) => p2.rating.rating - p1.rating.rating).slice(0, 5);
    let hardest = puzzles.filter(puzzle => !puzzle.hidden && !puzzle.needLogging).sort((p1, p2) => p2.difficulty - p1.difficulty).slice(0, 5);
    let example = puzzles.filter(puzzle => puzzle.code==type.example.puzzleId)[0];
    
    res.render('type', {
      user: req.user,
      type: {
        code: type.code,
        name: type.name,
        description: type.description,
        rules: util.processTags(type.rules, example.dimension),
        exampleId: type.example.puzzleId,
        variations: type.variations?.map(code => {return {code: code, name: typesMap[code].name}}) ?? [],
      },
      bestPuzzles: best,
      hardestPuzzles: hardest,
    });
    profiler.log('typePage', processStart);
  } catch (e) {
    next(e)
  }
});

module.exports = router;