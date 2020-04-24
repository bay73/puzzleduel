const express = require('express');
const router = express.Router();

const Contest = require('../models/Contest');
const UserSolvingTime = require('../models/UserSolvingTime');

router.get('/:contestid', async (req, res, next) => {
  try {
    const contest = await Contest.findOne({code: req.params.contestid});
    if (!contest || contest.start > new Date()) {
      res.sendStatus(404);
      return;
    }
    res.render('contest', {user: req.user, contest:contest.toObject()}) 
  } catch (e) {
    next(e);
  }
});

async function recountPuzzle(puzzle) {
  var puzzleId = puzzle.toObject().puzzleId;
  var results = [];
  const times = await UserSolvingTime.find({
    puzzleId: puzzleId,
    $or: [
      {hidden: false},
      {hidden: {$exists: false}}
    ]
  }).sort("solvingTime");
  if (times.length == 0) {
    return {};
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
  var complexity = median * Math.pow(median / 8000, 0.33);
  times.forEach(time => {
    var result = time.toObject();
    var score = complexity / result.solvingTime;
    if (result.errCount > 0 ) {
      score = score / (result.errCount + 1);
    }
    score = Math.round(score*10)/10;
    results.push({userId: result.userId, userName: result.userName, score: score});
  });
  return {
    results: results, 
    details: {
      bestTime: best, 
      medianTime: median,
      complexity: complexity,
      bestScore: complexity/best,
      medianScore: complexity/median
    }
  };
}

router.get('/:contestid/recount', async (req, res, next) => {
  try {
    if (!req.user || req.user.role != "admin") {
      res.sendStatus(404);
      return;
    }
    const contest = await Contest.findOne({code: req.params.contestid});
    if (!contest) {
      res.sendStatus(404);
      return;
    }
    var userTotals = {};
    for (var i=0; i<contest.puzzles.length; i++) {
      if (contest.puzzles[i].revealDate > new Date()) continue;
      var results = await recountPuzzle(contest.puzzles[i]);
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
    res.redirect('/contest/' + req.params.contestid);
  } catch (e) {
    next(e);
  }
});

module.exports = router;

