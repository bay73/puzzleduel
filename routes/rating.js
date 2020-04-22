const express = require('express');
const router = express.Router();

const Rating = require('../models/Rating');
const UserSolvingTime = require('../models/UserSolvingTime');
const Puzzle = require('../models/Puzzle');

router.get('/:ratingdate', async (req, res, next) => {
  try {
    var d = new Date(Date.parse(req.params.ratingdate));
    if (d.getDay() != 0) {
      d.setDate(d.getDate() - d.getDay());
      res.redirect('/rating/' + d.toISOString().split('T')[0]);
      return;
    }
    var ld = new Date();
    ld.setDate(ld.getDate() - 5);
    const ratingList = await Rating.find({date: d});
    res.render('rating', {
      user: req.user,
      ratingDate: d,
      ratingFinal: d < ld,
      ratings: ratingList.map(rating => {
        return {
          userName: rating.userName,
          value: rating.value,
          change: rating.change
        };
      })
    }); 
  } catch (e) {
    next(e);
  }
});

router.get('/', (req, res) => {
  var d = new Date();
  d.setDate(d.getDate() - 5);
  res.redirect('/rating/' + d.toISOString().split('T')[0]);
});

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
    if (rating < 0) rating = 0;
    ratings.push({userId: result.userId, userName: result.userName, value: rating});
  });
  return ratings;
}

router.get('/:ratingdate/recount', async (req, res, next) => {
  try {
    if (!req.user || req.user.role != "admin") {
      res.sendStatus(404);
      return;
    }
    var d = new Date(Date.parse(req.params.ratingdate));
    if (d.getDay() != 0) {
      d.setDate(d.getDate() - d.getDay());
    }
    await Rating.remove({date: d});
    var pd = new Date(d);
    pd.setDate(d.getDate() - 7);
    const prevRatings = await Rating.find({date: pd});
    ratingMap = {};
    prevRatings.forEach(rating => {
      ratingMap[rating.userId] = rating.toObject();
      ratingMap[rating.userId].puzzles=[];
    });
    var filter = { $and: [{daily: {$lte: d}}, {daily: {$gt: pd} }]};
    const puzzles = await Puzzle.find(filter, "code");
    for (var i=0; i<puzzles.length; i++) {
      var puzzleId = puzzles[i].code;
      var puzzleRating = await singlePuzzleRating(puzzleId);
      puzzleRating.forEach(rating => {      
        if (typeof ratingMap[rating.userId]=='undefined'){
          ratingMap[rating.userId] = {userName: rating.userName, value: 0, ratingWeek:0, missedWeek: 0, puzzles:[] };
        }
        ratingMap[rating.userId].puzzles.push(rating);
        ratingMap[rating.userId].userName = rating.userName;
      });
    }
    for (let [userId, data] of Object.entries(ratingMap)) {
      var weekValue = 0;
      var puzzlesNum = ratingMap[userId].puzzles.length;
      var oldValue = ratingMap[userId].value;
      var weeks = data.ratingWeek;
      if (puzzlesNum > 0) {
        weeks = weeks + 1;
      }
      var change = null;
      var newValue = oldValue;

      var details = {
        oldValue: oldValue,
        puzzlesNum: puzzlesNum,
        puzzles: []
      }

      if (puzzlesNum > 0) { 
        ratingMap[userId].puzzles.forEach(puzzle => {
          weekValue = weekValue + puzzle.value;
          details.puzzles.push(puzzle.value);
        });
        weekValue = weekValue / puzzlesNum;
        var diff = weekValue - oldValue;
        change = Math.pow(Math.abs(diff),0.66) * Math.sign(diff);
        if (change > 0) {
          change = change * puzzlesNum / 7;
          if (weeks < 5 ) {
            change = change * (5 - weeks);
          }
        }
        newValue = oldValue + change;
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
      rating.save();
    }
    res.redirect('/rating/' + d.toISOString().split('T')[0]);
  } catch (e) {
    next(e);
  }
});

module.exports = router;

