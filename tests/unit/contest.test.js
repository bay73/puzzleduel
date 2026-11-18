// Scoring of a contest puzzle (utils/calc/contest.js).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { puzzleScores } = require('../../utils/calc/contest');

function close(actual, expected, message) {
  assert.ok(Math.abs(actual - expected) < 1e-9, (message || 'Value') + ': ' + actual + ' instead of ' + expected);
}

// Results sorted by time: number is the time without errors, [time, errors] otherwise.
function times(...list) {
  return list.map((item, index) => {
    let [solvingTime, errCount] = typeof item == 'number' ? [item, 0] : item;
    return {userId: 'user' + (index + 1), userName: 'User ' + (index + 1), solvingTime, errCount};
  });
}

function scores(result) {
  return result.results.map(item => item.score);
}

// Score is median time divided by the time of the solver.
const SIMPLE = {method: 'power', complexityRate: 60000, complexityPower: 0, scoringPower: 1};

test('Puzzle without solvers has no results', () => {
  assert.deepEqual(puzzleScores([], SIMPLE), {
    results: [],
    details: {bestTime: null, medianTime: null, complexity: null, bestScore: null, medianScore: null},
  });
  assert.deepEqual(puzzleScores([], {method: 'log', complexityRate: 30000, complexityPower: 2}).results, []);
});

test('Result contains the user, the time and the errors of every solver', () => {
  let result = puzzleScores(times(100000, [200000, 2]), SIMPLE);
  assert.deepEqual(result.results, [
    {userId: 'user1', userName: 'User 1', score: 1, time: 100000, errCount: 0},
    {userId: 'user2', userName: 'User 2', score: 0.3, time: 200000, errCount: 2},
  ]);
});

test('Power scoring: score depends on the ratio to the median time', () => {
  let result = puzzleScores(times(100000, 200000, 300000), SIMPLE);
  assert.deepEqual(result.details, {bestTime: 100000, medianTime: 200000, complexity: 200000, bestScore: 2, medianScore: 1});
  // Scores are rounded to 0.1.
  assert.deepEqual(scores(result), [2, 1, 0.7]);
});

test('Power scoring: median of even number of solvers', () => {
  let result = puzzleScores(times(100000, 200000, 400000, 800000), SIMPLE);
  assert.equal(result.details.medianTime, 300000);
  assert.deepEqual(scores(result), [3, 1.5, 0.8, 0.4]);
});

test('Power scoring: scoring power reduces the difference between solvers', () => {
  let result = puzzleScores(times(50000, 200000, 800000), Object.assign({}, SIMPLE, {scoringPower: 0.5}));
  assert.deepEqual(scores(result), [2, 1, 0.5]);
});

test('Power scoring: longer puzzles cost more', () => {
  let scoring = {method: 'power', complexityRate: 60000, complexityPower: 1, scoringPower: 1};
  // Median time is equal to the complexity rate: median solver gets 1 point.
  assert.deepEqual(scores(puzzleScores(times(30000, 60000, 120000), scoring)), [2, 1, 0.5]);
  // Median time is twice as big: median solver gets 2 points.
  let result = puzzleScores(times(60000, 120000, 240000), scoring);
  assert.equal(result.details.complexity, 240000);
  assert.deepEqual(scores(result), [4, 2, 1]);
});

test('Solvers with errors are not used for the best and the median time', () => {
  let result = puzzleScores(times([50000, 1], 100000, 200000, [250000, 1], 300000), SIMPLE);
  assert.equal(result.details.bestTime, 100000);
  assert.equal(result.details.medianTime, 200000);
});

test('Every error adds the median time to the time of the solver', () => {
  let result = puzzleScores(times(100000, 200000, [300000, 1], [300000, 3]), SIMPLE);
  // Median of the solvers without errors is 150000.
  assert.equal(result.details.medianTime, 150000);
  // 150000/(300000 + 150000) and 150000/(300000 + 3*150000)
  assert.deepEqual(scores(result), [1.5, 0.8, 0.3, 0.2]);
});

test('All solvers are used for the median if everybody made an error', () => {
  let result = puzzleScores(times([100000, 1], [200000, 1], [300000, 2]), SIMPLE);
  assert.equal(result.details.bestTime, 100000);
  assert.equal(result.details.medianTime, 200000);
  // 200000/300000, 200000/400000, 200000/700000
  assert.deepEqual(scores(result), [0.7, 0.5, 0.3]);
});

test('Power scoring with fractional powers', () => {
  let scoring = {method: 'power', complexityRate: 60000, complexityPower: 0.5, scoringPower: 0.5};
  let result = puzzleScores(times(60000, 120000, [240000, 1]), scoring);
  assert.equal(result.details.bestTime, 60000);
  assert.equal(result.details.medianTime, 90000);
  close(result.details.complexity, 90000 * Math.sqrt(1.5), 'Complexity');
  close(result.details.bestScore, Math.sqrt(1.5 * Math.sqrt(1.5)), 'Best score');
  close(result.details.medianScore, Math.sqrt(Math.sqrt(1.5)), 'Median score');
  assert.deepEqual(scores(result), [1.4, 1, 0.6]);
});

test('Log scoring: complexity is the logarithm of the median time', () => {
  let scoring = {method: 'log', complexityRate: 30000, complexityPower: 2};
  // Median time is 2 and 4 times bigger than the complexity rate.
  close(puzzleScores(times(60000), scoring).details.complexity, 1);
  close(puzzleScores(times(120000), scoring).details.complexity, 2);
  close(puzzleScores(times(60000, 120000, 240000), scoring).details.complexity, 2);
});

test('Log scoring: scores of the solvers', () => {
  let scoring = {method: 'log', complexityRate: 30000, complexityPower: 2};
  let result = puzzleScores(times(30000, 60000, 120000), scoring);
  // Score is (0.1 + ln(1 + median/time)) * ln(median/rate)
  close(result.details.medianScore, (0.1 + Math.log(2)) * Math.log(2), 'Median score');
  close(result.details.bestScore, (0.1 + Math.log(3)) * Math.log(2), 'Best score');
  // 0.83, 0.55 and (0.1 + ln 1.5) * ln 2 = 0.35
  assert.deepEqual(scores(result), [0.8, 0.5, 0.4]);
});

test('Log scoring: longer puzzles cost more', () => {
  let scoring = {method: 'log', complexityRate: 30000, complexityPower: 2};
  let short = puzzleScores(times(60000), scoring);
  let long = puzzleScores(times(240000), scoring);
  close(long.details.medianScore, 3 * short.details.medianScore);
  assert.deepEqual(scores(short), [0.5]);
  assert.deepEqual(scores(long), [1.6]);
});

test('Log scoring: errors add the median time', () => {
  let scoring = {method: 'log', complexityRate: 30000, complexityPower: 2};
  let result = puzzleScores(times(60000, 120000, [240000, 1]), scoring);
  assert.equal(result.details.medianTime, 90000);
  close(result.details.complexity, Math.log2(3), 'Complexity');
  assert.deepEqual(scores(result), [1.1, 0.7, 0.4]);
});

test('Faster solver never gets less points', () => {
  for (const scoring of [
    SIMPLE,
    {method: 'power', complexityRate: 60000, complexityPower: 0.5, scoringPower: 0.5},
    {method: 'log', complexityRate: 30000, complexityPower: 2},
  ]) {
    let list = scores(puzzleScores(times(41000, 77000, 123000, 150000, 290000, 600000, 1500000), scoring));
    for (let i = 1; i < list.length; i++) {
      assert.ok(list[i] <= list[i - 1], scoring.method + ': ' + list);
      assert.ok(list[i] >= 0);
    }
  }
});
