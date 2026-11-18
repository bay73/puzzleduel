const Rating = require('../models/Rating');
const UserSolvingTime = require('../models/UserSolvingTime');
const Puzzle = require('../models/Puzzle');
const User = require('../models/User');

const { puzzleMedianTime, singlePuzzlePerformance, weekRating } = require('./calc/rating');

async function singlePuzzleUserRatings(puzzleId) {
  const times = await UserSolvingTime.find({
    puzzleId: puzzleId,
    solvingTime: {$exists: true},
    $or: [
      {hidden: false},
      {hidden: {$exists: false}}
    ]
  }).sort("solvingTime");
  if (times.length == 0) {
    return [];
  }
  var median = puzzleMedianTime(times)
  const notFinished = await UserSolvingTime.find({
    puzzleId: puzzleId,
    solvingTime: {$exists: false},
    $or: [
      {hidden: false},
      {hidden: {$exists: false}}
    ]
  }, "userId");
  ratings = [];
  times.forEach(time => {
    var result = time.toObject();
    var rating = singlePuzzlePerformance(result, median);
    if (rating < 1) rating = 1;
    ratings.push({userId: result.userId, value: rating, finished: true});
  });
  notFinished.forEach(rec => {
    ratings.push({userId: rec.userId, value: 0, finished: false});
  });
  return ratings;
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

  var filter = { $and: [{daily: {$lt: d}}, {daily: {$gte: pd}}, {daily: {$lt: new Date()}} ]};
  const puzzles = await Puzzle.find(filter, "code tag daily type").sort({daily: 1});
  for (var i=0; i<puzzles.length; i++) {
    var puzzleId = puzzles[i].code;
    var puzzleRatings = await singlePuzzleUserRatings(puzzleId);
    puzzleRatings.forEach(rating => {
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
      rating.type = puzzles[i].type;
      ratingMap[rating.userId].userName = userMap[rating.userId];
      ratingMap[rating.userId].puzzles.push(rating);
    });
  }
  for (let [userId, data] of Object.entries(ratingMap)) {
    var finishedPuzzlesNum = ratingMap[userId].puzzles.filter(puzzle=>puzzle.finished).length;
    var startedPuzzlesNum = ratingMap[userId].puzzles.length;
    var oldValue = ratingMap[userId].value;
    var totalStarted = ratingMap[userId].totalStarted + startedPuzzlesNum;
    var totalSolved = ratingMap[userId].totalSolved + finishedPuzzlesNum;
    var week = weekRating(oldValue, data.ratingWeek, ratingMap[userId].puzzles.map(puzzle => puzzle.value));
    var weeks = week.weeks;
    var change = week.change;
    var newValue = week.newValue;
    var details = {
      oldValue: oldValue,
      puzzlesNum: startedPuzzlesNum,
      puzzles: ratingMap[userId].puzzles.map((puzzle, index) => {
        return {date: puzzle.puzzleDate, type: puzzle.type, value: puzzle.value, change: week.puzzleChanges[index]};
      }),
      weekValue: week.weekValue
    }

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
      missedWeek: startedPuzzlesNum==0 ? (data.missedWeek+1) : 0,
      details: details
    });
    await rating.save();
  }
};

module.exports.computeRating = computeRating
module.exports.puzzleMedianTime = puzzleMedianTime
module.exports.singlePuzzlePerformance = singlePuzzlePerformance

