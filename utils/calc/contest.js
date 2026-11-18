// Scoring of a contest puzzle. The functions here don't use the database.

// Scores of the solvers of one puzzle.
//   times - results of the solvers ({userId, userName, solvingTime, errCount}) sorted by the solving time,
//   scoring - scoring settings of the contest ({method, complexityRate, complexityPower, scoringPower}).
// Returns the scores of the solvers and the details of the puzzle (best and median time and their scores).
function puzzleScores(times, scoring) {
  var results = [];
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
  if (scoring.method == "log") {
    var complexityFn = function(medianTime) {
      return Math.log(medianTime / scoring.complexityRate) / Math.log(scoring.complexityPower);
    }
    var scoreFn = function(time, complexity) {
      let median = Math.pow(Math.E, complexity * Math.log(scoring.complexityPower)) * scoring.complexityRate;
      return (0.1 + Math.log(1 + median / time)) * Math.log(median / scoring.complexityRate);
    }
  } else {
    var complexityFn = function(medianTime) {
      return medianTime * Math.pow(medianTime / scoring.complexityRate, scoring.complexityPower);
    }
    var scoreFn = function(time, complexity) {
      return Math.pow(complexity / time, scoring.scoringPower);
    }
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
  var complexity = complexityFn(median);
  times.forEach(result => {
    var score = scoreFn(result.solvingTime + median * result.errCount, complexity);
    score = Math.round(score*10)/10;
    results.push({userId: result.userId, userName: result.userName, score: score, time: result.solvingTime, errCount: result.errCount});
  });
  return {
    results: results,
    details: {
      bestTime: best,
      medianTime: median,
      complexity: complexity,
      bestScore: scoreFn(best, complexity),
      medianScore: scoreFn(median, complexity)
    }
  };
}

module.exports = { puzzleScores };
