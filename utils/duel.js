const Contest = require('../models/Contest');
const UserSolvingTime = require('../models/UserSolvingTime');
const Puzzle = require('../models/Puzzle');
const mongoose = require('mongoose');


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

async function recountPuzzle(puzzle, pairs, acceptTime) {
  var puzzleId = puzzle.toObject().puzzleId;
  var results = [];
  var userTime = {};
  const times = await UserSolvingTime.find({
    puzzleId: puzzleId,
    solvingTime: {$exists: true},
    $or: [
      {hidden: false},
      {hidden: {$exists: false}}
    ]
  }).sort("solvingTime");
  if (times.length == 0) {
    return {
      results: [],
      details: {
        bestTime: null,
        medianTime: null,
        complexity: null,
        bestScore: null,
        medianScore: null
      }
    };
  }
  times.forEach(time => {
    var result = time.toObject();
    if (result.date < acceptTime) {
      userTime[result.userId] = result.solvingTime;
      var score = 2;
      if (pairs) {
        var opponent = pairs[result.userId];
        if (opponent && userTime[opponent] < result.solvingTime) {
          score = 1;
        }
      }
      results.push({userId: result.userId, userName: result.userName, score: score, time: result.solvingTime});
    }
  });
  return {
    results: results, 
    details: {}
  };
}

async function refreshResult(contestId) {
  console.log('refreshResult');
  const relaxSeconds = 10;
  const contest = await Contest.findOne({code: contestId});
  if (!contest) {
    return false;
  }
  var userTotals = {};
  contest.participants.forEach(participant => {
    userTotals[participant.userId.toString()] = {userName: participant.userName, score: 0, time: 0, started: false };
  });
  for (var i=0; i<contest.puzzles.length; i++) {
    if (contest.puzzles[i].revealDate > new Date()) continue;
    var results = await recountPuzzle(contest.puzzles[i], contest.seedData[i], new Date(contest.puzzles[i].closeDate.getTime() + relaxSeconds*1000));
    contest.puzzles[i].results = [];
    contest.puzzles[i].details = results.details;
    if (typeof results.results != 'undefined') {
      results.results.forEach(result => {
        if (typeof userTotals[result.userId.toString()] != 'undefined') {
          contest.puzzles[i].results.push({userId: result.userId, score: result.score, time: result.time});
          userTotals[result.userId.toString()].score += result.score;
          userTotals[result.userId.toString()].time += result.time;
          userTotals[result.userId.toString()].started = true;
        }
      });
    }
  }
  contest.markModified('puzzles');
  contest.results = [];
  for (let [userId, value] of Object.entries(userTotals)) {
    var buchholz = 0;
    if (typeof contest.seedData != 'undefined'){
      contest.seedData.forEach(seeds => {
        if (seeds[userId] && typeof userTotals[seeds[userId]] != 'undefined') {
          buchholz += userTotals[seeds[userId]].score;
        }
      })
    }
    contest.results.push({
      userId: userId,
      userName: value.userName,
      score: value.score,
      tiebreakScore: buchholz,
      time: value.time,
      started: value.started
    });
  }
  await contest.save();
  return true;
}

async function initialSeed(contestId, reseed) {
  console.log('initialSeed');
  const contest = await Contest.findOne({code: contestId});
  if (!contest) {
    return false;
  }
  if (typeof contest.seedData != 'undefined' && typeof contest.seedData[0] != 'undefined' && !reseed) {
    return true;
  }
  const randomizedParticipants = shuffle(contest.participants);
  var pairs = {};
  for (var i = 0; i<randomizedParticipants.length; i++) {
    if (i%2==0) {
      if (i==randomizedParticipants.length-1) {
        pairs[randomizedParticipants[i].userId.toString()] = "";
      } else {
        pairs[randomizedParticipants[i].userId.toString()] = randomizedParticipants[i+1].userId.toString();
      }
    } else {
      pairs[randomizedParticipants[i].userId.toString()] = randomizedParticipants[i-1].userId.toString();
    }
  }
  if (typeof contest.seedData=='undefined') {
    contest.seedData = [];
  }
  console.log(pairs);
  contest.seedData[0] = pairs;
  contest.markModified('seedData');
  await contest.save();
}

async function seed(contestId, round, reseed) {
  console.log('seed');
  const contest = await Contest.findOne({code: contestId});
  if (!contest) {
    return false;
  }
  var roundIndex = round - 1;
  if (typeof contest.seedData[roundIndex] != 'undefined' && !reseed) {
    return true;
  }
  function resultCompare(r1, r2) {
    if (r1.score != r2.score) return r2.score - r1.score;
    if (r1.tiebreakScore != r2.tiebreakScore) return r1.tiebreakScore - r2.tiebreakScore;
    return r1.time - r2.time;
  }
  const participants = contest.results.sort(resultCompare);
  function checkAlreadyPaired(user1, user2) {
    for(var i=0; i<roundIndex; i++) {
      if (typeof contest.seedData[i] != 'undefined') {
        if (contest.seedData[i][user1.toString()]==user2.toString()) {
          return true;
        }
      }
    }
    return false;
  }
  function checkAlreadyMissed(user) {
    for(var i=0; i<roundIndex; i++) {
      if (typeof contest.seedData[i] != 'undefined') {
        if (contest.seedData[i][user.toString()]=="") {
          return true;
        }
      }
    }
    return false;
  }
  var pairs = {};
  function findNext(index) {
    if (index==participants.length) {
      return true;
    }
    var userId = participants[index].userId;
    if (pairs[userId.toString()]) {
      if (findNext(index+1)) {
        return true;
      }
    } else {
      if (Object.keys(pairs).length==participants.length-1){
        if (checkAlreadyMissed(userId) && participants[index].started) {
          return false;
        }
        pairs[userId.toString()] = "";
        return true;
      }
      for (var i=index+1;i<participants.length;i++){
        var otherUserId = participants[i].userId;
        if (!pairs[otherUserId.toString()]) {
          if (!checkAlreadyPaired(userId, otherUserId) || (!participants[index].started && !participants[i].started)) {
            pairs[userId.toString()] = otherUserId.toString();
            pairs[otherUserId.toString()] = userId.toString();
            if (findNext(index+1)) {
              return true;
            }
            delete pairs[userId.toString()];
            delete pairs[otherUserId.toString()];
          }
        }
      }
    }
    return false;
  }
  if (!findNext(0)) {
    throw "Couldn't build pairs";
  }
  if (typeof contest.seedData=='undefined') {
    contest.seedData = [];
  }
  console.log(pairs);
  contest.seedData[roundIndex] = pairs;
  contest.markModified('seedData');
  await contest.save();
}

async function recountContest(contestId) {
  console.log('recountContest');
  const contest = await Contest.findOne({code: contestId});
  if (!contest) {
    return false;
  }
  if (contest.start > new Date(new Date().getTime() + 3600000)){
    console.log('recountContest too early', contest.start);
    return false;
  }
  if (contest.start > new Date()){
    var status = 'registration';
  } else if (contest.finish > new Date()){
    var status = 'going';
  } else {
    var status = 'finished';
  }
  if (status == 'finished') {
    console.log('recountContest too late', contest.finish);
    return false;
  }
  var puzzleStatus = "";
  var round = 0;
  if (status == 'going') {
    var nextTime = contest.start;
    contest.puzzles.forEach(puzzle => {
      if (nextTime < new Date() && puzzle.revealDate > new Date()) {
        puzzleStatus = "waiting";
        round = puzzle.puzzleNum;
        nextTime = puzzle.revealDate;
      }
      if (nextTime < new Date() && puzzle.closeDate > new Date()) {
        puzzleStatus = "solving";
        round = puzzle.puzzleNum;
        nextTime = puzzle.closeDate;
      }
    })
  }
  console.log(status, puzzleStatus, round);
  if (status == 'registration') {
    return true;
  }
  if (status != 'finished') {
    await refreshResult(contestId);
  }
  if (puzzleStatus == 'waiting') {
    if (round == 1) {
      await initialSeed(contestId, false);
    } else {
      await seed(contestId, round, true);
    }
  }
  return true;
}

async function rescheduleDuel(contestId) {
  var pauseMinutes = 1;
  var roundMinutes = 5;
  const contest = await Contest.findOne({code: contestId});
  if (!contest) {
    return false;
  }
  console.log('contest.start',contest.start);
  if (contest.start <= new Date()) {
    return false;
  }
  var num = 0;
  var time = contest.start;
  for(var i=0; i<contest.puzzles.length; i++) {
    puzzle = contest.puzzles[i];
    num++;
    puzzle.puzzleNum = num;
    time = new Date(time.getTime() + pauseMinutes*60000);
    puzzle.revealDate = time;
    time = new Date(time.getTime() + roundMinutes*60000);
    puzzle.closeDate = time;
    var puzzleStorage = await Puzzle.findOne({code: puzzle.puzzleId});
    if (typeof puzzleStorage.contest=="undefined" || puzzleStorage.contest.contestId == contestId) {
      puzzleStorage.contest = {contestId: contestId, puzzleDate: puzzle.revealDate};
      puzzleStorage.tag = 'contest';
//      puzzleStorage.author = mongoose.Types.ObjectId('5e7d1b5dbf549427b8cad9d8');
      await puzzleStorage.save();
    }
  }
  contest.markModified('puzzles');
  contest.finish = new Date(time.getTime() + pauseMinutes*60000);
  contest.seedData = undefined;
  await contest.save();
  return true;
}

module.exports.recountContest = recountContest;
module.exports.rescheduleDuel = rescheduleDuel;

