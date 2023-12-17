const express = require('express');
const router = express.Router();
const cache = require('../utils/cache');
const PuzzleComment = require('../models/PuzzleComment');


router.use(require('./common.js'));

router.get('/', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();

    if (!req.user) {
      res.sendStatus(404);
      profiler.log('mailboxFailed', processStart);
      return;
    }

    const [comments, typeMap, allPuzzles] = await Promise.all([
      PuzzleComment.find({receiver: req.user._id}).sort({date: -1}).limit(50),
      cache.readPuzzleTypes(),
      cache.readAllPuzzles()
    ]);

    const puzzleMap = {}
    allPuzzles.forEach(puzzle => puzzleMap[puzzle.code]=puzzle)

    res.render('mailbox', {
      user: req.user,
      comments: comments.map(comment => {
        const puzzle = puzzleMap[comment.puzzleId]
        return {
          puzzleId: comment.puzzleId,
          puzzleType: puzzle ? typeMap[puzzle.type].name : "",
          puzzleDimension: puzzle ? puzzle.dimension : "",
          commentText: comment.comment,
          commentDate: comment.date
        };
      })
    });

    profiler.log('mailbox', processStart);
  } catch (e) {
    next(e)
  }
});

module.exports = router;


