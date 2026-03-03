const UserSolvingTime = require('../models/UserSolvingTime');
const PuzzleComment = require('../models/PuzzleComment');
const Puzzle = require('../models/Puzzle');
const puzzleMedianTime = require('../utils/rating').puzzleMedianTime;

async function singlePuzzleDifficulty(puzzleId) {
  const times = await UserSolvingTime.find({
    puzzleId: puzzleId,
    solvingTime: {$exists: true},
    $or: [
      {hidden: false},
      {hidden: {$exists: false}}
    ]
  }).sort("solvingTime");
  return puzzleMedianTime(times)
}

async function singlePuzzleRating(puzzleId) {
  const ratings = await PuzzleComment.find({
    puzzleId: puzzleId,
    rating: {$exists: true, $gt: 0},
  });
  if (ratings.length == 0) {
    return null;
  }
  var sum = 0;
  ratings.forEach(rating => sum+=rating.rating);
  return {
    rating: sum/ratings.length,
    count: ratings.length
  };
}

async function computeDifficulty() {
  const puzzles = await Puzzle.find();
  for (var i=0; i<puzzles.length; i++) {
    var puzzleId = puzzles[i].code;
    var difficulty = await singlePuzzleDifficulty(puzzleId);
    var rating = await singlePuzzleRating(puzzleId);
    if (rating != null) {
      puzzles[i].rating = rating;
    }
    if (difficulty != null) {
      puzzles[i].difficulty = difficulty;
    }
    if (rating != null || difficulty != null) {
      await puzzles[i].save();
    }
  }
};

module.exports = computeDifficulty;

