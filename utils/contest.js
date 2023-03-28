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
  if (scoring.method == "log") {
    var complexityFn = function(medianTime) {
//      return medianTime * Math.log(medianTime / scoring.complexityRate) / Math.log(scoring.complexityPower);
      return medianTime * Math.pow(medianTime / scoring.complexityRate, scoring.complexityPower);
    }
    var scoreFn = function(time, complexity) {
      return Math.log(1 + complexity / time) / Math.log(scoring.scoringPower);
    }
  } else {
    var complexityFn = function(medianTime) {
      return medianTime * Math.pow(medianTime / scoring.complexityRate, scoring.complexityPower);
    }
    var scoreFn = function(time, complexity) {
      return Math.pow(complexity / time, scoring.scoringPower);
    }
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
  var complexity = complexityFn(median);
  times.forEach(time => {
    var result = time.toObject();
    var score = scoreFn(result.solvingTime + median * result.errCount, complexity);
    score = Math.round(score*10)/10;
    results.push({userId: result.userId, userName: result.userName, score: score, time: result.solvingTime, errCount: result.errCount});
  });
  return {
    results: results, 
    details: {
      bestTime: best, 
      medianTime: median,
      complexity: complexity,
      bestScore: scoreFn(best, complexity),
      medianScore: scoreFn(median, complexity)
    }
  };
}

async function recountContest(contestId) {
  const contest = await Contest.findOne({code: contestId});
  if (!contest) {
    console.log("Contest " + contestId + " is not found!")
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
        contest.puzzles[i].results.push({userId: result.userId, score: result.score, time: result.time, errors: result.errCount});
        if (typeof userTotals[result.userId]=='undefined'){
          userTotals[result.userId] = {userName: result.userName, score: 0, solvedCount: 0, totalTime: 0, totalErr: 0 };
        }
        userTotals[result.userId].score += result.score;
        userTotals[result.userId].solvedCount++;
        userTotals[result.userId].totalTime += result.time;
        userTotals[result.userId].totalErr += result.errCount;
      });
    }
  }
  console.log("Results for " + Object.keys(userTotals).length + " user found!")
  contest.results = [];
  for (let [userId, value] of Object.entries(userTotals)) {
    contest.results.push({userId: userId, userName: value.userName, score: Math.round(value.score*10)/10, solvedCount: value.solvedCount, totalTime: value.totalTime, errCount: value.totalErr});
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

async function rescheduleDailyContest(contestId) {
  const contest = await Contest.findOne({code: contestId});
  if (!contest) {
    return false;
  }
  console.log('contest.start',contest.start);
  if (contest.start <= new Date()) {
    return false;
  }
  let puzzles = [];
  for(var i=0; i<contest.puzzles.length; i++) {
    puzzle = contest.puzzles[i];
    if (puzzle.puzzleId) {
      var puzzleStorage = await Puzzle.findOne({code: puzzle.puzzleId});
      if (puzzleStorage) {
        if (typeof puzzleStorage.contest=="undefined" || puzzleStorage.contest.contestId == contestId) {
          puzzleStorage.contest = {contestId: contestId, puzzleDate: puzzleStorage.daily};
          await puzzleStorage.save();
        }
      }
    }
    puzzles.push({id: puzzle.puzzleId, date: puzzleStorage.daily});
  }
  puzzles.sort((p1, p2)=>(p1.date - p2.date));
  let num = 0;
  for(var i=0; i<contest.puzzles.length; i++) {
    num++;
    puzzle = contest.puzzles[i];
    puzzle.num = num;
    puzzle.puzzleId = puzzles[i].id;
    puzzle.revealDate = puzzles[i].date;
  }
  console.log(puzzles);
  contest.markModified('puzzles');
  await contest.save();
  return true;
}

async function rescheduleOneTimeContest(contestId) {
  const contest = await Contest.findOne({code: contestId});
  if (!contest) {
    return false;
  }
  console.log('contest.start',contest.start);
  if (contest.start <= new Date()) {
    return false;
  }
  for(var i=0; i<contest.puzzles.length; i++) {
    puzzle = contest.puzzles[i];
    if (puzzle.puzzleId) {
      var puzzleStorage = await Puzzle.findOne({code: puzzle.puzzleId});
      if (puzzleStorage) {
        if (typeof puzzleStorage.daily != "undefined") {
          throw "Daily puzzle " + puzzle.puzzleId + " included into contest!";
        }
        if (typeof puzzleStorage.contest=="undefined" || puzzleStorage.contest.contestId == contestId) {
          puzzleStorage.tag = "contest";
          puzzleStorage.contest = {contestId: contestId, puzzleDate: contest.start};
          await puzzleStorage.save();
        }
      }
    }
    puzzle.revealDate = contest.start;
  }
  console.log(contest.puzzles);
  contest.markModified('puzzles');
  await contest.save();
  return true;
}

async function rescheduleDailyShadowContest(contestId) {
  const contest = await Contest.findOne({code: contestId});
  if (!contest) {
    return false;
  }
  console.log('contest.start',contest.start);
  if (contest.start <= new Date()) {
    return false;
  }
  let nextDate = contest.start;
  for(var i=0; i<contest.puzzles.length; i++) {
    puzzle = contest.puzzles[i];
    puzzle.revealDate = new Date(nextDate);
    nextDate.setDate(nextDate.getDate() + 1);
    if (puzzle.puzzleId) {
      var puzzleStorage = await Puzzle.findOne({code: puzzle.puzzleId});
      if (puzzleStorage) {
        if (typeof puzzleStorage.daily != "undefined") {
          throw "Daily puzzle " + puzzle.puzzleId + " included into contest!";
        }
        if (typeof puzzleStorage.contest=="undefined" || puzzleStorage.contest.contestId == contestId) {
          puzzleStorage.tag = "contest";
          puzzleStorage.contest = {contestId: contestId, puzzleDate: puzzle.revealDate};
          await puzzleStorage.save();
        }
      }
    }
  }
  console.log(contest.puzzles);
  contest.markModified('puzzles');
  await contest.save();
  return true;
}

module.exports.recountContest = recountContest;
module.exports.reschedulePuzzles = reschedulePuzzles;
module.exports.rescheduleDailyContest = rescheduleDailyContest;
module.exports.rescheduleOneTimeContest = rescheduleOneTimeContest;
module.exports.rescheduleDailyShadowContest = rescheduleDailyShadowContest;

