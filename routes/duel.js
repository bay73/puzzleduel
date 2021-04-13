const express = require('express');
const router = express.Router();

const Contest = require('../models/Contest');
const UserSolvingTime = require('../models/UserSolvingTime');
const util = require('../utils/puzzle_util');
const profiler = require('../utils/profiler');
const cache = require('../utils/cache');

router.get('/:contestid', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const contest = await cache.readContest(req.params.contestid);
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
    if (req.user) {
      var userId = req.user._id;
      var isRegistered = contest.participants.filter(participant => participant.userId.equals(userId)).length > 0;
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
      timeLeft: timeLeft,
      isUserRegistered: isRegistered
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

    if (currentPuzzleId != null && isRegistered) {
      var puzzle = Object.assign({}, await cache.readPuzzle(currentPuzzleId));
      if (puzzle) {
        var type = Object.assign({}, await cache.readPuzzleType(puzzle.type));
        if (req.getLocale() != 'en') {
          if (type.translations[req.getLocale()] && type.translations[req.getLocale()].rules) {
            type.rules = type.translations[req.getLocale()].rules;
          }
        }
        if(type) {
          puzzle.type = type;
        }
        if (puzzle.author) {
          puzzle.authorId = puzzle.author;
          puzzle.author = await cache.readUserName(puzzle.author);
        }
      }
    }

    res.render('duel', {
      user: req.user,
      contest: contestObj,
      currentPuzzle: puzzle
    })
    profiler.log('duelMainPage', processStart);
  } catch (e) {
    next(e);
  }
});

router.get('/:contestid/register', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
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
      profiler.log('duelRegister', processStart);
      return;
    }
    contest.participants.push({userId: req.user._id, userName: req.user.name})
    await contest.save();
    res.redirect('/duel/' + req.params.contestid);
    profiler.log('duelRegister', processStart);
  } catch (e) {
    next(e);
  }
});

router.get('/:contestid/unregister', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
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
      profiler.log('duelUnregister', processStart);
      return;
    }
    contest.participants = contest.participants.filter(user => !user.userId.equals(req.user._id))
    await contest.save();
    res.redirect('/duel/' + req.params.contestid);
    profiler.log('duelUnregister', processStart);
  } catch (e) {
    next(e);
  }
});

router.get('/:contestid/opponent', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const contest = await cache.readContest(req.params.contestid);
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
          contest.puzzles[round].results.forEach(result => {
            if (result.userId.equals(opponentId)) {
              opponent.time = util.timeToString(result.time);
            }
          });
        } else {
          opponent = {skip: true};
        }
      }
    }

    res.render('duel_opponent', {
      layout: "empty_layout",
      opponent: opponent
    })
    profiler.log('duelOpponentData', processStart);
  } catch (e) {
    next(e);
  }
});

router.get('/:contestid/standing', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const contest = await cache.readContest(req.params.contestid);
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
        if (puzzle.revealDate < new Date()) {
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
    const ratingList = await cache.readRating(ratingDate);
    var userRatings = {}
    ratingList.forEach(rating => userRatings[rating.userId] = rating.value);
    var typeMap = await cache.readPuzzleTypes();

    var puzzleMap = {}
    await Promise.all(contest.puzzles.map(async (puzzle) => {
      puzzleMap[puzzle.puzzleId] = await cache.readPuzzle(puzzle.puzzleId)
    }));

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
        tiebreakScore: result.tiebreakScore,
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
          tiebreakScore: 0,
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
          type: typeMap[puz.type].name,
          dimension: puz.dimension,
          revealDate: puzzle.revealDate
        };
      }),
      userData: userData
    })
    profiler.log('duelStanding', processStart);
  } catch (e) {
    next(e);
  }
});

router.get('/:contestid/results/:puzzlenum', async (req, res, next) => {
  try {
    const processStart = new Date().getTime();
    const relaxSeconds = 10;
    const contest = await cache.readContest(req.params.contestid);
    if (!contest) {
      res.sendStatus(404);
      return;
    }
    var roundNum = req.params.puzzlenum - 1;
    if (typeof contest.seedData=="undefined" || typeof contest.seedData[roundNum]=="undefined") {
      res.sendStatus(404);
      return;
    }
    var pairs = contest.seedData[roundNum];
    if (typeof contest.puzzles[roundNum]=="undefined" || typeof contest.puzzles[roundNum].results=="undefined") {
      res.sendStatus(404);
      return;
    }
    var puzzleId = contest.puzzles[roundNum].puzzleId;
    var acceptTime = new Date(contest.puzzles[roundNum].closeDate.getTime() + relaxSeconds*1000);
    var scores = contest.puzzles[roundNum].results;
    var userScores = {};
    scores.forEach(score => {
      userScores[score.userId.toString()] = score.score;
    });
    const times = await UserSolvingTime.find({
      puzzleId: puzzleId,
      solvingTime: {$exists: true},
      $or: [
        {hidden: false},
        {hidden: {$exists: false}}
      ]
    });
    var userSolvingTime = {};
    times.forEach(time => {
      if (time.date < acceptTime) {
        userSolvingTime[time.userId.toString()] = time.solvingTime;
      }
    });
    var users = {};
    contest.participants.forEach(participant => {
      users[participant.userId.toString()] = participant.userName;
    });
    var isUsed = {};
    var pairResults = [];
    Object.entries(pairs).forEach(([user1, user2]) => {
      if (!isUsed[user1]) {
        isUsed[user1] = true;
        isUsed[user2] = true;
        pairResults.push({
          user1: user1,
          user1Name: users[user1],
          user1Time: util.timeToString(userSolvingTime[user1]),
          user1Score: userScores[user1],
          user2: user2,
          user2Name: users[user2],
          user2Time: util.timeToString(userSolvingTime[user2]),
          user2Score: userScores[user2]
        });
      }
    });
    contest.puzzles[roundNum].results
    res.render('duel_round_results', {
      layout: "empty_layout",
      results: pairResults
    })
    profiler.log('duelPuzzleResults', processStart);
  } catch (e) {
    next(e);
  }
});

module.exports = router;

