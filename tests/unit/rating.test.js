// Computation of the user rating (utils/calc/rating.js).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { puzzleMedianTime, singlePuzzlePerformance, normDiff, weekRating } = require('../../utils/calc/rating');

function close(actual, expected, message) {
  assert.ok(Math.abs(actual - expected) < 1e-9, (message || 'Value') + ': ' + actual + ' instead of ' + expected);
}

function times(...list) {
  return list.map(item => typeof item == 'number' ? {solvingTime: item, errCount: 0} : {solvingTime: item[0], errCount: item[1]});
}

test('Median time is null when nobody solved the puzzle', () => {
  assert.equal(puzzleMedianTime([]), null);
});

test('Median time for odd number of solvers is the time of the middle one', () => {
  assert.equal(puzzleMedianTime(times(10)), 10);
  assert.equal(puzzleMedianTime(times(10, 20, 90)), 20);
});

test('Median time for even number of solvers is the average of two middle ones', () => {
  assert.equal(puzzleMedianTime(times(10, 20)), 15);
  assert.equal(puzzleMedianTime(times(10, 20, 50, 90)), 35);
});

test('Median time ignores the solvers with errors', () => {
  assert.equal(puzzleMedianTime(times(10, [15, 1], 20, [30, 2], 90)), 20);
  assert.equal(puzzleMedianTime(times([5, 1], 10, 20)), 15);
});

test('Median time uses all solvers if everybody made an error', () => {
  assert.equal(puzzleMedianTime(times([10, 1], [20, 3], [90, 1])), 20);
});

test('Performance is 2000 for the median time and changes by 500 for every doubling of the time', () => {
  assert.equal(singlePuzzlePerformance({solvingTime: 60000, errCount: 0}, 60000), 2000);
  assert.equal(singlePuzzlePerformance({solvingTime: 120000, errCount: 0}, 60000), 1500);
  assert.equal(singlePuzzlePerformance({solvingTime: 240000, errCount: 0}, 60000), 1000);
  assert.equal(singlePuzzlePerformance({solvingTime: 30000, errCount: 0}, 60000), 2500);
});

test('Every error costs as one more median time', () => {
  assert.equal(singlePuzzlePerformance({solvingTime: 60000, errCount: 1}, 60000), 1500);
  assert.equal(singlePuzzlePerformance({solvingTime: 60000, errCount: 3}, 60000), 1000);
  assert.equal(
    singlePuzzlePerformance({solvingTime: 60000, errCount: 1}, 60000),
    singlePuzzlePerformance({solvingTime: 120000, errCount: 0}, 60000));
});

test('Performance is never negative', () => {
  assert.equal(singlePuzzlePerformance({solvingTime: 16 * 60000, errCount: 0}, 60000), 0);
  assert.equal(singlePuzzlePerformance({solvingTime: 100 * 60000, errCount: 0}, 60000), 0);
  assert.equal(singlePuzzlePerformance({solvingTime: 60000, errCount: 50}, 60000), 0);
});

test('Performance is 0 for the puzzle which was started but not solved', () => {
  assert.equal(singlePuzzlePerformance({errCount: 0}, 60000), 0);
  assert.equal(singlePuzzlePerformance({solvingTime: null, errCount: 2}, 60000), 0);
});

test('Normalized difference keeps the sign and reduces big differences', () => {
  assert.equal(normDiff(0), 0);
  assert.equal(normDiff(1), 1);
  assert.equal(normDiff(-1), -1);
  close(normDiff(100), Math.pow(100, 0.66));
  close(normDiff(-100), -Math.pow(100, 0.66));
  assert.ok(normDiff(1000) < 100);
  assert.ok(normDiff(1000) > normDiff(999));
});

test('Rating is not changed in the week without started puzzles', () => {
  assert.deepEqual(
    weekRating(1234.5, 7, []),
    {newValue: 1234.5, change: null, weekValue: 0, weeks: 7, puzzleChanges: []});
});

test('Rating of experienced user moves to the average performance of the week', () => {
  // 7 puzzles is the full week: the change is the normalized difference.
  let week = weekRating(1500, 10, [1600, 1600, 1600, 1600, 1600, 1600, 1600]);
  assert.equal(week.weeks, 11);
  assert.equal(week.weekValue, 1600);
  close(week.change, Math.pow(100, 0.66));
  close(week.newValue, 1500 + Math.pow(100, 0.66));

  week = weekRating(1500, 10, [1400, 1400, 1400, 1400, 1400, 1400, 1400]);
  close(week.change, -Math.pow(100, 0.66));
  close(week.newValue, 1500 - Math.pow(100, 0.66));
});

test('Change of the rating is proportional to the number of started puzzles', () => {
  let full = weekRating(1500, 10, [1600, 1600, 1600, 1600, 1600, 1600, 1600]);
  let one = weekRating(1500, 10, [1600]);
  let three = weekRating(1500, 10, [1600, 1600, 1600]);
  close(one.change, full.change / 7);
  close(three.change, full.change * 3 / 7);
});

test('Rating is not changed if the performance is equal to the rating', () => {
  let week = weekRating(1500, 10, [1400, 1600]);
  assert.equal(week.weekValue, 1500);
  assert.equal(week.change, 0);
  assert.equal(week.newValue, 1500);
  // Good and bad puzzles compensate each other.
  close(week.puzzleChanges[0], -Math.pow(100, 0.66) / 7);
  close(week.puzzleChanges[1], Math.pow(100, 0.66) / 7);
});

test('Puzzle which was not solved counts as zero performance', () => {
  let week = weekRating(1500, 10, [2000, 0]);
  assert.equal(week.weekValue, 1000);
  close(week.change, -Math.pow(500, 0.66) * 2 / 7);
});

test('Growth of the rating is accelerated in the first four weeks', () => {
  let values = [1600, 1600, 1600, 1600, 1600, 1600, 1600];
  let base = Math.pow(100, 0.66);
  close(weekRating(1500, 0, values).change, 4 * base, 'First week');
  close(weekRating(1500, 1, values).change, 3 * base, 'Second week');
  close(weekRating(1500, 2, values).change, 2 * base, 'Third week');
  close(weekRating(1500, 3, values).change, base, 'Fourth week');
  close(weekRating(1500, 4, values).change, base, 'Fifth week');
  assert.equal(weekRating(1500, 0, values).weeks, 1);
});

test('Fall of the rating is not accelerated for new users', () => {
  let values = [1400, 1400, 1400, 1400, 1400, 1400, 1400];
  close(weekRating(1500, 0, values).change, -Math.pow(100, 0.66));
  close(weekRating(1500, 2, values).change, -Math.pow(100, 0.66));
});

test('First week of a new user', () => {
  // Two puzzles: twice faster and twice slower than the median.
  let week = weekRating(0, 0, [2500, 1500]);
  assert.equal(week.weekValue, 2000);
  close(week.change, 4 * Math.pow(2000, 0.66) * 2 / 7);
  close(week.newValue, week.change);
  assert.ok(week.puzzleChanges[0] > week.puzzleChanges[1]);
});

test('Changes for the puzzles give the change of the rating in total', () => {
  for (const [oldValue, ratingWeek, values] of [
    [0, 0, [2500, 1500]],
    [1500, 2, [1900, 0, 1200]],
    [1800, 10, [2100, 1700, 0, 1950, 1500]],
    [2000, 1, [1000]],
    [1500, 30, [1400, 1600]],
  ]) {
    let week = weekRating(oldValue, ratingWeek, values);
    assert.equal(week.puzzleChanges.length, values.length);
    close(week.puzzleChanges.reduce((sum, change) => sum + change, 0), week.change, 'Sum of the changes');
    // Better performance gives a bigger change.
    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < values.length; j++) {
        if (values[i] > values[j]) {
          assert.ok(week.puzzleChanges[i] > week.puzzleChanges[j]);
        }
      }
    }
  }
});
