const express = require('express');
const router = express.Router();

const Rating = require('../models/Rating');
const computeRating = require('../utils/rating');

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
    await computeRating(d);
    res.redirect('/rating/' + d.toISOString().split('T')[0]);
  } catch (e) {
    next(e);
  }
});

module.exports = router;

