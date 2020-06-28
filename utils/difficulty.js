const UserSolvingTime = require('../models/UserSolvingTime');
const Puzzle = require('../models/Puzzle');

async function singlePuzzleDifficulty(puzzleId) {
  const times = await UserSolvingTime.find({
    puzzleId: puzzleId,
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

async function computeDifficulty() {
  const puzzles = await Puzzle.find();
  for (var i=0; i<puzzles.length; i++) {
    var puzzleId = puzzles[i].code;
    var difficulty = await singlePuzzleDifficulty(puzzleId);
    if (difficulty != null) {
      puzzles[i].difficulty = difficulty;
      await puzzles[i].save();
    }
  }
};

module.exports = computeDifficulty;

