// Results of the leagues. The functions here don't use the database.

// Result of one participant for the month.
//   participant - {userId, userName},
//   times - solving times of the participant for the puzzles of the month ({solvingTime, errCount, hidden, userName}),
//   authoredDifficulties - difficulties (median times) of the puzzles of the month created by the participant:
//       the author gets the puzzle as solved without errors in the median time.
function participantResult(participant, times, authoredDifficulties) {
  const result = {userId: participant.userId, userName: participant.userName, solvedCount: 0, totalSolvedCount: 0, totalTime: 0};
  for (let p = 0; p < times.length; p++) {
    if (times[p].hidden != true && times[p].solvingTime > 0) {
      result.totalTime += times[p].solvingTime;
      result.totalSolvedCount++;
      result.userName = times[p].userName || result.userName;
      if (times[p].errCount == 0) {
        result.solvedCount++;
      }
    }
  }
  authoredDifficulties.forEach(difficulty => {
    result.totalTime += difficulty;
    result.totalSolvedCount++;
    result.solvedCount++;
  })
  return result;
}

// Order of the participants in the league: more puzzles solved without errors,
// then more solved puzzles, then less total time.
function compareResults(r1, r2) {
  if (r1.solvedCount != r2.solvedCount) return r2.solvedCount - r1.solvedCount;
  if (r1.totalSolvedCount != r2.totalSolvedCount) return r2.totalSolvedCount - r1.totalSolvedCount;
  return r1.totalTime - r2.totalTime;
}

// Participants who take the places from fromIndex (included) to toIndex (excluded) in the league.
// The participants without solved puzzles are skipped if excludeNotSolved is set.
function takePlaces(results, fromIndex, toIndex, excludeNotSolved) {
  return results.sort(compareResults).slice(fromIndex, toIndex)
    .filter(result => {if (excludeNotSolved) {return result.totalSolvedCount > 0} else {return true}})
    .map(result => {return {userId: result.userId, userName: result.userName}});
}

module.exports = { participantResult, compareResults, takePlaces };
