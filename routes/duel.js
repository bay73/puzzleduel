const express = require('express');
const router = express.Router();

const Contest = require('../models/Contest');
const Puzzle = require('../models/Puzzle');
const PuzzleType = require('../models/PuzzleType');
const User = require('../models/User');
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
    } else if (contest.finish > new Date()){
      var status = 'going';
    } else {
      var status = 'finished';
    }
    var currentPuzzleId = null;
    if (status != 'finished') {
      var nextTime = contest.start;
      var nextDuration = 0;
      var puzzleStatus = "";
      contest.puzzles.forEach(puzzle => {
        if (nextTime < new Date() && puzzle.revealDate > new Date()) {
          puzzleStatus = "waiting";
          nextTime = puzzle.revealDate;
          nextDuration = puzzle.closeDate.getTime() - puzzle.revealDate.getTime();
          currentPuzzleId = puzzle.puzzleId;
        }
        if (nextTime < new Date() && puzzle.closeDate > new Date()) {
          puzzleStatus = "solving";
          nextTime = puzzle.closeDate;
          nextDuration = 0;
          currentPuzzleId = puzzle.puzzleId;
        }
      })
      if (puzzleStatus == "" && status=="going") {
        nextTime = contest.finish;
      }
    }
    var timeLeft = null;
    if (nextTime && nextTime < new Date(new Date().getTime()+ 86400000)) {
      timeLeft = nextTime.getTime() - new Date().getTime();
    }
    var contestObj = {
      code: contest.code,
      name: contest.name,
      description: contest.description,
      logo: contest.logo,
      start: contest.start,
      finish: contest.finish,
      status: status,
      puzzleStatus: puzzleStatus,
      nextTime: nextTime,
      nextDuration: nextDuration,
      timeLeft: timeLeft
    };

    var locale = req.getLocale();
    if (locale != 'en' && contest.translations) {
      if (contest.translations[locale] && contest.translations[locale].name) {
        contestObj.name = contest.translations[locale].name;
      }
      if (contest.translations[locale] && contest.translations[locale].description) {
        contestObj.description = contest.translations[locale].description;
      }
    }

    if (currentPuzzleId != null) {
      var puzzle = await Puzzle.findOne({code: currentPuzzleId}, "-data");
      if (puzzle) {
        var puzzleObj = puzzle.toObject();
        var type = await PuzzleType.findOne({ code: puzzleObj.type });
        if (req.getLocale() != 'en') {
          if (type.translations[req.getLocale()] && type.translations[req.getLocale()].rules) {
            type.rules = type.translations[req.getLocale()].rules;
          }
        }
        if(type) {
          puzzleObj.type = type.toObject();
        }
        if (puzzleObj.author) {
          puzzleObj.authorId = puzzleObj.author;
          var author = await User.findById(puzzleObj.author, "name");
          if(author) {
            puzzleObj.author = author.name;
          }
        }
      }
    }

    res.render('duel', {
      user: req.user,
      contest: contestObj,
      currentPuzzle: puzzleObj
    })
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

router.get('/:contestid/opponent', async (req, res, next) => {
  try {
    const contest = await Contest.findOne({code: req.params.contestid});
    if (!contest) {
      res.sendStatus(404);
      return;
    }

    if (contest.start > new Date()){
      var status = 'registration';
    } else if (contest.finish > new Date()){
      var status = 'going';
    } else {
      var status = 'finished';
    }
    var opponent = {};
    if (req.user) {
      if (status == 'going') {
        var nextTime = contest.start;
        var round = null;
        contest.puzzles.forEach(puzzle => {
          if (nextTime < new Date() && puzzle.revealDate > new Date()) {
            nextTime = puzzle.revealDate;
            round = puzzle.puzzleNum - 1;
          }
          if (nextTime < new Date() && puzzle.closeDate > new Date()) {
            nextTime = puzzle.closeDate;
            round = puzzle.puzzleNum - 1;
          }
        })
      }
      var userId = req.user._id.toString();
      if (typeof contest.seedData != 'undefined' && typeof contest.seedData[round] != 'undefined') {
        var opponentId = contest.seedData[round][userId];
        if (opponentId) {
          opponentObj = contest.participants.filter(participant => participant.userId.equals(opponentId))[0];
          opponent = {name: opponentObj.userName};
        } else {
          opponent = {skip: true};
        }
      }
    }

    res.render('duel_opponent', {
      layout: "empty_layout",
      opponent: opponent
    })
  } catch (e) {
    next(e);
  }
});

router.get('/:contestid/standing', async (req, res, next) => {
  try {
    const contest = await Contest.findOne({code: req.params.contestid});
    if (!contest) {
      res.sendStatus(404);
      return;
    }

    if (contest.start > new Date()){
      var status = 'registration';
    } else if (contest.finish > new Date()){
      var status = 'going';
    } else {
      var status = 'finished';
    }
    var currentPuzzleId = null;
    var lastPuzzleNum = null;
    if (status != 'finished') {
      var nextTime = contest.start;
      var puzzleStatus = "";
      contest.puzzles.forEach(puzzle => {
        if (nextTime < new Date() && puzzle.revealDate > new Date()) {
          puzzleStatus = "waiting";
          nextTime = puzzle.revealDate;
          currentPuzzleId = puzzle.puzzleId;
        }
        if (nextTime < new Date() && puzzle.closeDate > new Date()) {
          puzzleStatus = "solving";
          nextTime = puzzle.closeDate;
          currentPuzzleId = puzzle.puzzleId;
          currentPuzzleNum = puzzle.puzzleNum;
        }
        if (puzzle.closeDate < new Date()) {
          lastPuzzleNum = puzzle.puzzleNum;
        }
      })
      if (puzzleStatus == "" && status=="going") {
        nextTime = contest.finish;
      }
    } else {
      lastPuzzleNum = contest.puzzles.length;
    }
    var contestObj = {
      code: contest.code,
      name: contest.name,
      description: contest.description,
      logo: contest.logo,
      status: status,
      lastPuzzleNum: lastPuzzleNum,
      puzzleStatus: puzzleStatus,
      nextTime: nextTime,
      timeLeft: nextTime?nextTime.getTime() - new Date().getTime():null
    };

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
    var typeMap = await util.typeNameMap();
    var puzzleMap = {};
    const puzzles = await Puzzle.find({'contest.contestId': req.params.contestid});
    puzzles.forEach(puzzle => {puzzleMap[puzzle.code] = puzzle.toObject();puzzleMap[puzzle.code].needLogging = puzzle.needLogging});

    var userNames = {};
    contest.participants.forEach(participant => {
      userNames[participant.userId.toString()] = participant.userName;
    })

    var hasResults = {};
    var detailResults = {};
    var users = [];
    contest.puzzles.forEach(puzzle => {
      if (typeof puzzle.results != 'undefined') {
        puzzle.results.forEach(result => {
          if (typeof detailResults[result.userId.toString()] == 'undefined') {
            detailResults[result.userId.toString()] = {};
          }
          detailResults[result.userId.toString()][puzzle.puzzleNum] = result.score;
        })
      }
    })
    contest.results.forEach(result => {
      hasResults[result.userId] = true;
      var seedDetails = "";
      if (typeof contest.seedData != 'undefined') {
        contest.seedData.forEach(round => {
          if (typeof round[result.userId.toString()] != 'undefined') {
            seedDetails += round[result.userId.toString()] ? userNames[round[result.userId.toString()]]:"-";
            seedDetails += "\n";
          }
        })
      }
      users.push({
        id: result.userId,
        name: result.userName,
        score: result.score,
        scoreSum: detailResults[result.userId.toString()],
        seedDetails: seedDetails,
        rating: userRatings[result.userId]|0
      });
    })
    contest.participants.forEach(participant => {
      if (!hasResults[participant.userId]) {
        users.push({
          id: participant.userId,
          name: participant.userName,
          score: 0,
          scoreSum: null,
          rating: userRatings[participant.userId]|0
        });
      }
    })
    userData = {};
    if (req.user) {
      var userId = req.user._id;
      userData.isRegistered = users.filter(user => user.id.equals(userId)).length > 0
    }

    res.render('duel_standing', {
      layout: "empty_layout",
      user: req.user,
      contest: contestObj,
      users: users,
      puzzles: contest.puzzles.map(puzzle => {
        puz = puzzleMap[puzzle.puzzleId];
        return {
          num: puzzle.puzzleNum,
          code: puzzle.puzzleId,
          type: typeMap[puz.type],
          dimension: puz.dimension,
          revealDate: puzzle.revealDate
        };
      }),
      userData: userData
    })
  } catch (e) {
    next(e);
  }
});

module.exports = router;

