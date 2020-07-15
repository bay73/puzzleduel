const Rating = require('../models/Rating');
const UserSolvingTime = require('../models/UserSolvingTime');
const UserActionLog = require('../models/UserActionLog');
const Puzzle = require('../models/Puzzle');
const User = require('../models/User');

async function singlePuzzleRating(puzzleId) {
  const times = await UserSolvingTime.find({
    puzzleId: puzzleId,
    $or: [
      {hidden: false},
      {hidden: {$exists: false}}
    ]
  }).sort("solvingTime");
  if (times.length == 0) {
    return [];
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
  const finished = await UserActionLog.find({puzzleId: puzzleId, action: "solved"}, "userId").distinct("userId");
  const notFinished = await UserActionLog.find({puzzleId: puzzleId, userId: {$nin: finished}}, "userId").distinct("userId");
  ratings = [];
  times.forEach(time => {
    var result = time.toObject();
    var rating = 2000 - 500*Math.log2(result.solvingTime / median + result.errCount);
    if (rating < 1) rating = 1;
    ratings.push({userId: result.userId, value: rating, finished: true});
  });
  notFinished.forEach(userId => {
    ratings.push({userId: userId, value: 0, finished: false});
  });
  return ratings;
}

function normDiff(diff) {
  return Math.pow(Math.abs(diff),0.66) * Math.sign(diff);
}

async function computeRating(computeDate) {
  var d = new Date(Date.parse(computeDate));
  if (d.getUTCDay() != 0) {
    d.setDate(d.getDate() - d.getUTCDay());
  }
  d.setUTCHours(0,0,0,0);
  console.log("ComputeRating at",d);
  await Rating.deleteMany({date: d});
  var pd = new Date(d);
  pd.setDate(d.getDate() - 7);
  const prevRatings = await Rating.find({date: pd});
  ratingMap = {};
  prevRatings.forEach(rating => {
    ratingMap[rating.userId] = rating.toObject();
    ratingMap[rating.userId].puzzles=[];
  });

  const users = await User.find({});
  var userMap = {};
  users.forEach(user => userMap[user._id] = user.name);

  var filter = { $and: [{daily: {$lt: d}}, {daily: {$gte: pd} }]};
  const puzzles = await Puzzle.find(filter, "code tag daily").sort({daily: 1});
  for (var i=0; i<puzzles.length; i++) {
    var puzzleId = puzzles[i].code;
    var puzzleRating = await singlePuzzleRating(puzzleId);
    puzzleRating.forEach(rating => {
      if (typeof ratingMap[rating.userId]=='undefined'){
        ratingMap[rating.userId] = {
          userName: userMap[rating.userId],
          value: 0,
          ratingWeek: 0,
          missedWeek: 0,
          totalStarted: 0,
          totalSolved: 0,
          puzzles:[],
        };
      }
      rating.puzzleDate = puzzles[i].daily;
      ratingMap[rating.userId].userName = userMap[rating.userId];
      ratingMap[rating.userId].puzzles.push(rating);
    });
  }
  for (let [userId, data] of Object.entries(ratingMap)) {
    var weekValue = 0;
    var finishedPuzzlesNum = ratingMap[userId].puzzles.filter(puzzle=>puzzle.finished).length;
    var oldValue = ratingMap[userId].value;
    var totalStarted = ratingMap[userId].totalStarted + ratingMap[userId].puzzles.length;
    var totalSolved = ratingMap[userId].totalSolved + finishedPuzzlesNum;
    var weeks = data.ratingWeek;
    var change = null;
    var newValue = oldValue;
    var details = {
      oldValue: oldValue,
      puzzlesNum: finishedPuzzlesNum,
      puzzles: []
    }
    if (finishedPuzzlesNum > 0) {
      weeks = weeks + 1;
      var weekSum = 0;
      var puzzleDiffSum = 0;
      var newbie = 1;
      if (weeks < 5 ) {
        newbie = 5 - weeks;
      }
      ratingMap[userId].puzzles.filter(puzzle=>puzzle.finished).forEach(puzzle => {
        weekSum = weekSum + puzzle.value;
        puzzleDiffSum = puzzleDiffSum + newbie * normDiff(puzzle.value - oldValue) / 7;
      });
      weekValue = weekSum / finishedPuzzlesNum;
      change = normDiff(weekValue - oldValue);
      change = change * finishedPuzzlesNum / 7;
      if (change > 0) {
        change = change * newbie;
      }
      newValue = oldValue + change;
      var coeff = (change - puzzleDiffSum) / finishedPuzzlesNum;
      ratingMap[userId].puzzles.filter(puzzle=>puzzle.finished).forEach(puzzle => {
        details.puzzles.push({date: puzzle.puzzleDate, value: puzzle.value, change: newbie * normDiff(puzzle.value - oldValue) / 7 + coeff});
      });
    }
    details.weekValue = weekValue;
    
    var rating = new Rating({
      date: d,
      userId: userId,
      userName: data.userName,
      value: newValue,
      totalStarted: totalStarted,
      totalSolved: totalSolved,
      change: change,
      solved: finishedPuzzlesNum,
      ratingWeek: weeks,
      missedWeek: finishedPuzzlesNum==0 ? (data.missedWeek+1) : 0,
      details: details
    });
    await rating.save();
  }
};

module.exports = computeRating;

