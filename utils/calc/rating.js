// Computation of the user rating. The functions here don't use the database.

// Median solving time of the puzzle, times should be sorted by the solving time.
// Only the results without errors are used if there are any.
function puzzleMedianTime(times) {
  if (times.length == 0) {
    return null;
  }
  var success = times.filter(time => !time.errCount);
  if (success.length==0) {
    success = times;
  }
  if (success.length%2==0) {
    var median = (success[success.length/2].solvingTime + success[success.length/2-1].solvingTime)/2;
  } else {
    var median = success[(success.length-1)/2].solvingTime;
  }
  return median
}

// Performance of the solver for a single puzzle: 2000 for the median time,
// 500 less for every doubling of the time, every error costs as one more median time.
function singlePuzzlePerformance(result, median) {
  if (result.solvingTime) {
    let score = 2000 - 500*Math.log2(result.solvingTime / median + result.errCount);
    if (score < 0) {
      return 0;
    }
    return score;
  } else {
    return 0;
  }
}

function normDiff(diff) {
  return Math.pow(Math.abs(diff),0.66) * Math.sign(diff);
}

// Change of the rating after one week.
//   oldValue - rating before the week,
//   ratingWeek - number of the weeks in which the user took part before,
//   puzzleValues - performances for the puzzles started in this week.
// Returns the new rating, its change, the average performance of the week, the new number of weeks
// and the part of the change which is attributed to every puzzle.
function weekRating(oldValue, ratingWeek, puzzleValues) {
  var startedPuzzlesNum = puzzleValues.length;
  var weeks = ratingWeek;
  var weekValue = 0;
  var change = null;
  var newValue = oldValue;
  var puzzleChanges = [];
  if (startedPuzzlesNum > 0) {
    weeks = weeks + 1;
    var weekSum = 0;
    var puzzleDiffSum = 0;
    var newbie = 1;
    if (weeks < 5 ) {
      newbie = 5 - weeks;
    }
    puzzleValues.forEach(value => {
      weekSum = weekSum + value;
      puzzleDiffSum = puzzleDiffSum + newbie * normDiff(value - oldValue) / 7;
    });
    weekValue = weekSum / startedPuzzlesNum;
    change = normDiff(weekValue - oldValue);
    change = change * startedPuzzlesNum / 7;
    if (change > 0) {
      change = change * newbie;
    }
    newValue = oldValue + change;
    var coeff = (change - puzzleDiffSum) / startedPuzzlesNum;
    puzzleValues.forEach(value => {
      puzzleChanges.push(newbie * normDiff(value - oldValue) / 7 + coeff);
    });
  }
  return {newValue: newValue, change: change, weekValue: weekValue, weeks: weeks, puzzleChanges: puzzleChanges};
}

module.exports = { puzzleMedianTime, singlePuzzlePerformance, normDiff, weekRating };
