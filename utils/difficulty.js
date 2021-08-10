const UserSolvingTime = require('../models/UserSolvingTime');
const PuzzleComment = require('../models/PuzzleComment');
const Puzzle = require('../models/Puzzle');

async function singlePuzzleDifficulty(puzzleId) {
  const times = await UserSolvingTime.find({
    puzzleId: puzzleId,
    solvingTime: {$exists: true},
    $or: [
      {hidden: false},
      {hidden: {$exists: false}}
    ]
  }).sort("solvingTime");
  if (times.length == 0) {
    return null;
  }
  var success = times.filter(time => !time.errCount);
  if (success.length==0) {
    success = times;
  }
  var best = success[0].solvingTime;
  if (success.length%2==0) {
    var median = (success[success.length/2].solvingTime + success[success.length/2-1].solvingTime)/2;
  } else {
    var median = success[(success.length-1)/2].solvingTime;
  }
  return median;
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

