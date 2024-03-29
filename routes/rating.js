const express = require('express');
const router = express.Router();

const Rating = require('../models/Rating');
const computeRating = require('../utils/rating');
const profiler = require('../utils/profiler');
const cache = require('../utils/cache');

router.use(require('./common.js'));

router.get('/:ratingdate', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    var d = new Date(Date.parse(req.params.ratingdate));
    if (d.getUTCDay() != 0) {
      d.setDate(d.getDate() - d.getUTCDay());
      res.redirect('/rating/' + d.toISOString().split('T')[0]);
      return;
    }
    var ld = new Date();
    ld.setDate(ld.getDate() - 4);
    const [ratingList, userLeagues] = await Promise.all([
      cache.readRating(d),
      cache.readUserLeagues()
    ]);
    res.render('rating', {
      user: req.user,
      ratingDate: d,
      ratingFinal: d <= ld,
      ratings: ratingList.filter(rating => rating.value > 0 && rating.missedWeek < 6).map(rating => {
        var details = "";
        rating.details.puzzles.forEach(puzzle => {
          details += puzzle.date.toISOString().split('T')[0] + ": " + Math.round(puzzle.change) + "\n";
        });
        return {
          userId: rating.userId,
          userName: rating.userName,
          userLeague: userLeagues[rating.userId],
          value: rating.value,
          change: rating.change,
          totalStarted: rating.totalStarted,
          totalSolved: rating.totalSolved,
          missedWeek: rating.missedWeek,
          details: details
        };
      }),
      sortColumn: req.query.sort || "rating"
    }); 
    profiler.log('ratingList', processStart);
  } catch (e) {
    next(e);
  }
});

router.get('/', (req, res) => {
  var d = new Date();
  d.setDate(d.getDate() - 4);
  res.redirect('/rating/' + d.toISOString().split('T')[0]);
});

router.get('/:ratingdate/recount', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    if (!req.user || req.user.role != "admin") {
      res.sendStatus(404);
      return;
    }
    var d = new Date(Date.parse(req.params.ratingdate));
    if (d.getUTCDay() != 0) {
      d.setDate(d.getDate() - d.getUTCDay());
    }
    await computeRating(d);
    res.redirect('/rating/' + d.toISOString().split('T')[0]);
    profiler.log('ratingRecount', processStart);
  } catch (e) {
    next(e);
  }
});

module.exports = router;

