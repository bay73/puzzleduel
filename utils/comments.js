const League = require('../models/League');
const PuzzleComment = require('../models/PuzzleComment');
const cache = require('./cache');

async function fillReceivers() {

   const [comments, puzzles] = await Promise.all([
      PuzzleComment.find({comment: {$ne: ""}}),
      cache.readAllPuzzles()
    ]);

    const puzzleMap = {}
    puzzles.forEach(puzzle => puzzleMap[puzzle.code]=puzzle)

    const commentMap = {}
    comments.forEach(comment => commentMap[comment._id]=comment)
    
    for (let i=0; i < comments.length; i++) {
      let comment = comments[i];
      if (!comment.receiver) {
        if (comment.replyTo) {
          comment.receiver = commentMap[comment.replyTo].userId;
        } else {
          comment.receiver = puzzleMap[comment.puzzleId].author;
        }
        console.log(comment)
        await comment.save()
      }
    }
}

module.exports.fillReceivers = fillReceivers;
