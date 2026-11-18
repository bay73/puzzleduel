// Scoring and pairing of duels (Swiss system). The functions here don't use the database.

// Scores of one round. Every solver gets 2 points, but only 1 point if the opponent solved the puzzle faster.
//   times - results of the solvers ({userId, userName, solvingTime, date}) sorted by the solving time,
//   pairs - map from the user id to the id of the opponent in this round (may be undefined),
//   acceptTime - results submitted after this time are not counted.
function roundScores(times, pairs, acceptTime) {
  var results = [];
  var userTime = {};
  times.forEach(result => {
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
  return results;
}

// Tie-break score of the user: sum of the scores of all the opponents.
//   seedData - list of the pairs of every round,
//   userTotals - map from the user id to the totals of the user ({score}).
function buchholz(userId, seedData, userTotals) {
  var buchholz = 0;
  if (typeof seedData != 'undefined'){
    seedData.forEach(seeds => {
      if (seeds[userId] && typeof userTotals[seeds[userId]] != 'undefined') {
        buchholz += userTotals[seeds[userId]].score;
      }
    })
  }
  return buchholz;
}

// Pairs of the first round: participants are paired in the given order,
// the last one stays without opponent ("") if the number of participants is odd.
function initialPairs(userIds) {
  var pairs = {};
  for (var i = 0; i<userIds.length; i++) {
    if (i%2==0) {
      if (i==userIds.length-1) {
        pairs[userIds[i]] = "";
      } else {
        pairs[userIds[i]] = userIds[i+1];
      }
    } else {
      pairs[userIds[i]] = userIds[i-1];
    }
  }
  return pairs;
}

// Order of the participants for pairing: by score, then by tie-break score, then by time.
function compareResults(r1, r2) {
  if (r1.score != r2.score) return r2.score - r1.score;
  if (r1.tiebreakScore != r2.tiebreakScore) return r1.tiebreakScore - r2.tiebreakScore;
  return r1.time - r2.time;
}

// Pairs of the next round. Participants with close results are paired, two participants can't meet twice
// (except those who did not start), and nobody who started stays without opponent twice.
//   participants - current results ({userId, started}) sorted by compareResults,
//   seedData - list of the pairs of the previous rounds,
//   roundIndex - zero-based number of the round to pair.
// Returns the map from the user id to the opponent id ("" - no opponent), or null if the pairs can't be built.
function swissPairs(participants, seedData, roundIndex) {
  function checkAlreadyPaired(user1, user2) {
    for(var i=0; i<roundIndex; i++) {
      if (typeof seedData[i] != 'undefined') {
        if (seedData[i][user1.toString()]==user2.toString()) {
          return true;
        }
      }
    }
    return false;
  }
  function checkAlreadyMissed(user) {
    for(var i=0; i<roundIndex; i++) {
      if (typeof seedData[i] != 'undefined') {
        if (seedData[i][user.toString()]=="") {
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
    return null;
  }
  return pairs;
}

module.exports = { roundScores, buchholz, initialPairs, compareResults, swissPairs };
