const Contest = require('../models/Contest');
const Puzzle = require('../models/Puzzle');
const UserSolvingTime = require('../models/UserSolvingTime');

async function recountPuzzle(puzzle, scoring) {
  var puzzleId = puzzle.toObject().puzzleId;
  var results = [];
  const times = await UserSolvingTime.find({
    puzzleId: puzzleId,
    solvingTime: {$exists: true},
    $or: [
      {hidden: false},
      {hidden: {$exists: false}}
    ]
  }).sort("solvingTime");
  if (times.length == 0) {
    return {
      results: [],
      details: {
        bestTime: null,
        medianTime: null,
        complexity: null,
        bestScore: null,
        medianScore: null
      }
    };
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
  var complexity = median * Math.pow(median / scoring.complexityRate, scoring.complexityPower);
  times.forEach(time => {
    var result = time.toObject();
    var score = Math.pow(complexity / (result.solvingTime + median * result.errCount), scoring.scoringPower);
//    if (result.errCount > 0 ) {
//      score = score / (result.errCount + 1);
//    }
    score = Math.round(score*10)/10;
    results.push({userId: result.userId, userName: result.userName, score: score});
  });
  return {
    results: results, 
    details: {
      bestTime: best, 
      medianTime: median,
      complexity: complexity,
      bestScore: Math.pow(complexity/best, scoring.scoringPower),
      medianScore: Math.pow(complexity/median, scoring.scoringPower)
    }
  };
}

async function recountContest(contestId) {
  const contest = await Contest.findOne({code: contestId});
  if (!contest) {
    return false;
  }
  var userTotals = {};
  for (var i=0; i<contest.puzzles.length; i++) {
    if (contest.puzzles[i].revealDate > new Date()) continue;
    var results = await recountPuzzle(contest.puzzles[i], contest.scoring);
    contest.puzzles[i].results = [];
    contest.puzzles[i].details = results.details;
    if (typeof results.results != 'undefined') {
      results.results.forEach(result => {
        contest.puzzles[i].results.push({userId: result.userId, score: result.score});
        if (typeof userTotals[result.userId]=='undefined'){
          userTotals[result.userId] = {userName: result.userName, score: 0 };
        }
        userTotals[result.userId].score += result.score;
      });
    }
  }
  contest.results = [];
  for (let [userId, value] of Object.entries(userTotals)) {
    contest.results.push({userId: userId, userName: value.userName, score: Math.round(value.score*10)/10});
  }
  await contest.save();
  return true;
}


async function reschedulePuzzles(contestId) {
  var pauseMinutes = 60*24*5;
  var roundMinutes = 60*24;
  const contest = await Contest.findOne({code: contestId});
  if (!contest) {
    return false;
  }
  console.log('contest.start',contest.start);
  if (contest.start <= new Date()) {
    return false;
  }
  var num = 0;
  var time = contest.start;
  for(var i=0; i<contest.puzzles.length; i++) {
    puzzle = contest.puzzles[i];
    num++;
    puzzle.puzzleNum = num;
    puzzle.revealDate = time;
    if (puzzle.puzzleId) {
      var puzzleStorage = await Puzzle.findOne({code: puzzle.puzzleId});
      if (puzzleStorage) {
        if (typeof puzzleStorage.contest=="undefined" || puzzleStorage.contest.contestId == contestId) {
          puzzleStorage.contest = {contestId: contestId, puzzleDate: puzzle.revealDate};
          puzzleStorage.tag = 'contest';
          await puzzleStorage.save();
        }
      }
    }
    time = new Date(time.getTime() + roundMinutes*60000);
  }
  contest.markModified('puzzles');
  contest.finish = new Date(time.getTime() + pauseMinutes*60000);
  await contest.save();
  return true;
}

module.exports.recountContest = recountContest;
module.exports.reschedulePuzzles = reschedulePuzzles;

