const express = require('express');
const router = express.Router();

const Contest = require('../models/Contest');
const Puzzle = require('../models/Puzzle');
const UserSolvingTime = require('../models/UserSolvingTime');
const Rating = require('../models/Rating');
const util = require('../utils/puzzle_util');

router.get('/:contestid', async (req, res, next) => {
  try {
    const contest = await Contest.findOne({code: req.params.contestid});
    if (!contest) {
      res.sendStatus(404);
      return;
    }
    if (contest.start > new Date()){
      var status = 'registration';
    } else if (contest.finish < new Date()){
      var status = 'going';
    } else {
      var status = 'finished';
    }
    if (contest.start > new Date()){
      var ratingDate = new Date();
    } else {
      var ratingDate = contest.start;
    }
    ratingDate.setDate(ratingDate.getDate() - ratingDate.getUTCDay());
    ratingDate.setUTCHours(0);
    ratingDate.setUTCMinutes(0);
    ratingDate.setUTCSeconds(0);
    ratingDate.setUTCMilliseconds(0);
    const ratingList = await Rating.find({date: ratingDate});
    var userRatings = {}
    ratingList.forEach(rating => userRatings[rating.userId] = rating.value);
    var contestObj = {code: contest.code, name: contest.name, description: contest.description, logo: contest.logo, status: status};
    if (contestObj.status == 'registration') {
      var users = contest.participants.map(participant => {return {id: participant.userId, name: participant.userName, score: 0, rating: userRatings[participant.userId]|0};});
    } else {
      var users = contest.results.map(participant => {return {id: participant.userId, name: participant.userName, score: participant.score, rating: userRatings[participant.userId]|0};});
    }
    userData = {};
    if (req.user) {
      var userId = req.user._id;
      userData.isRegistered = users.filter(user => user.id.equals(userId)).length > 0
    }
    var locale = req.getLocale();
    if (locale != 'en' && contest.translations) {
      if (contest.translations[locale] && contest.translations[locale].name) {
        contestObj.name = contest.translations[locale].name;
      }
      if (contest.translations[locale] && contest.translations[locale].description) {
        contestObj.description = contest.translations[locale].description;
      }
    }
    var puzzleObj = null;
    res.render('duel', {user: req.user, contest: contestObj, users: users, currentPuzzle: puzzleObj, userData: userData})
  } catch (e) {
    next(e);
  }
});

router.get('/:contestid/register', async (req, res, next) => {
  try {
    if (!req.user) {
      res.redirect('/duel/' + req.params.contestid);
      return;
    }
    const contest = await Contest.findOne({code: req.params.contestid});
    if (!contest) {
      res.sendStatus(404);
      return;
    }
    if (contest.start < new Date()){
      res.redirect('/duel/' + req.params.contestid);
    }
    var alreadyRegister = contest.participants.filter(user => user.userId.equals(req.user._id)).length > 0;
    if (alreadyRegister){
      res.redirect('/duel/' + req.params.contestid);
      return;
    }
    contest.participants.push({userId: req.user._id, userName: req.user.name})
    await contest.save();
    res.redirect('/duel/' + req.params.contestid);
  } catch (e) {
    next(e);
  }
});

router.get('/:contestid/unregister', async (req, res, next) => {
  try {
    if (!req.user) {
      res.redirect('/duel/' + req.params.contestid);
      return;
    }
    const contest = await Contest.findOne({code: req.params.contestid});
    if (!contest) {
      res.sendStatus(404);
      return;
    }
    if (contest.start < new Date()){
      res.redirect('/duel/' + req.params.contestid);
    }
    var alreadyRegister = contest.participants.filter(user => user.userId.equals(req.user._id)).length > 0;
    if (!alreadyRegister){
      res.redirect('/duel/' + req.params.contestid);
      return;
    }
    contest.participants = contest.participants.filter(user => !user.userId.equals(req.user._id))
    await contest.save();
    res.redirect('/duel/' + req.params.contestid);
  } catch (e) {
    next(e);
  }
});

module.exports = router;

