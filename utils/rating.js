const Rating = require('../models/Rating');
const UserSolvingTime = require('../models/UserSolvingTime');
const Puzzle = require('../models/Puzzle');

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
  ratings = [];
  times.forEach(time => {
    var result = time.toObject();
    var rating = 2000 - 500*Math.log2(result.solvingTime / median + result.errCount);
    if (rating < 1) rating = 1;
    ratings.push({userId: result.userId, userName: result.userName, value: rating});
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
  var filter = { $and: [{daily: {$lt: d}}, {daily: {$gte: pd} }]};
  const puzzles = await Puzzle.find(filter, "code daily").sort({daily: 1});
  for (var i=0; i<puzzles.length; i++) {
    var puzzleId = puzzles[i].code;
    var puzzleRating = await singlePuzzleRating(puzzleId);
    puzzleRating.forEach(rating => {
      if (typeof ratingMap[rating.userId]=='undefined'){
        ratingMap[rating.userId] = {userName: rating.userName, value: 0, ratingWeek:0, missedWeek: 0, puzzles:[] };
      }
      rating.puzzleDate = puzzles[i].daily;
      ratingMap[rating.userId].puzzles.push(rating);
      ratingMap[rating.userId].userName = rating.userName;
    });
  }
  for (let [userId, data] of Object.entries(ratingMap)) {
    var weekValue = 0;
    var puzzlesNum = ratingMap[userId].puzzles.length;
    var oldValue = ratingMap[userId].value;
    var weeks = data.ratingWeek;
    var change = null;
    var newValue = oldValue;
    var details = {
      oldValue: oldValue,
      puzzlesNum: puzzlesNum,
      puzzles: []
    }
    if (puzzlesNum > 0) {
      weeks = weeks + 1;
      var weekSum = 0;
      ratingMap[userId].puzzles.forEach(puzzle => {
        weekSum = weekSum + puzzle.value;
      });
      weekValue = weekSum / puzzlesNum;
      var diff = weekValue - oldValue;
      change = Math.pow(Math.abs(diff),0.66) * Math.sign(diff);
      change = change * puzzlesNum / 7;
      if (change > 0) {
        if (weeks < 5 ) {
          change = change * (5 - weeks);
        }
      }
      newValue = oldValue + change;
      var coeff = change / weekSum;
      var coeff = change / (weekSum - puzzlesNum*oldValue);
      ratingMap[userId].puzzles.forEach(puzzle => {
        details.puzzles.push({date: puzzle.puzzleDate, value: puzzle.value, change: (puzzle.value - oldValue) * coeff});
      });
    }
    details.weekValue = weekValue;
    
    var rating = new Rating({
      date: d,
      userId: userId,
      userName: data.userName,
      value: newValue,
      change: change,
      solved: puzzlesNum,
      ratingWeek: weeks,
      missedWeek: puzzlesNum==0 ? (data.missedWeek+1) : 0,
      details: details
    });
    await rating.save();
  }
};

module.exports = computeRating;

