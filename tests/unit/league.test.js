// Results of the leagues (utils/calc/league.js).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { participantResult, compareResults, takePlaces } = require('../../utils/calc/league');

const ALICE = {userId: 'a', userName: 'Alice'};

function result(userId, solvedCount, totalSolvedCount, totalTime) {
  return {userId: userId, userName: 'User ' + userId, solvedCount, totalSolvedCount, totalTime};
}

test('Participant without results', () => {
  assert.deepEqual(
    participantResult(ALICE, [], []),
    {userId: 'a', userName: 'Alice', solvedCount: 0, totalSolvedCount: 0, totalTime: 0});
});

test('Solved puzzles and the total time are counted', () => {
  let times = [
    {solvingTime: 60000, errCount: 0, userName: 'Alice'},
    {solvingTime: 90000, errCount: 0, userName: 'Alice'},
  ];
  assert.deepEqual(
    participantResult(ALICE, times, []),
    {userId: 'a', userName: 'Alice', solvedCount: 2, totalSolvedCount: 2, totalTime: 150000});
});

test('Puzzle solved with errors is not counted as solved clean', () => {
  let times = [
    {solvingTime: 60000, errCount: 0, userName: 'Alice'},
    {solvingTime: 90000, errCount: 2, userName: 'Alice'},
  ];
  assert.deepEqual(
    participantResult(ALICE, times, []),
    {userId: 'a', userName: 'Alice', solvedCount: 1, totalSolvedCount: 2, totalTime: 150000});
});

test('Puzzles which are started only and hidden results are ignored', () => {
  let times = [
    {errCount: 0, userName: 'Alice'},
    {solvingTime: 0, errCount: 0, userName: 'Alice'},
    {solvingTime: 70000, errCount: 0, hidden: true, userName: 'Alice'},
    {solvingTime: 60000, errCount: 0, hidden: false, userName: 'Alice'},
  ];
  assert.deepEqual(
    participantResult(ALICE, times, []),
    {userId: 'a', userName: 'Alice', solvedCount: 1, totalSolvedCount: 1, totalTime: 60000});
});

test('Name of the participant is taken from the last result', () => {
  let times = [
    {solvingTime: 60000, errCount: 0, userName: 'Alice'},
    {solvingTime: 60000, errCount: 0, userName: 'Alice Smith'},
    {solvingTime: 60000, errCount: 0},
    {errCount: 0, userName: 'Not solved'},
  ];
  assert.equal(participantResult(ALICE, times, []).userName, 'Alice Smith');
});

test('Author gets the puzzle as solved in the median time', () => {
  let times = [{solvingTime: 60000, errCount: 1, userName: 'Alice'}];
  assert.deepEqual(
    participantResult(ALICE, times, [120000, 45000]),
    {userId: 'a', userName: 'Alice', solvedCount: 2, totalSolvedCount: 3, totalTime: 225000});
});

test('Participants are ordered by clean solved puzzles, then by all solved puzzles, then by time', () => {
  let list = [
    result('slow', 3, 3, 900000),
    result('errors', 2, 4, 100000),
    result('best', 4, 4, 990000),
    result('fast', 3, 3, 300000),
    result('nothing', 0, 0, 0),
    result('one more', 3, 4, 950000),
  ];
  assert.deepEqual(
    list.sort(compareResults).map(item => item.userId),
    ['best', 'one more', 'fast', 'slow', 'errors', 'nothing']);
  assert.equal(compareResults(list[0], list[0]), 0);
});

test('Places of the league', () => {
  let results = [result('c', 1, 1, 100), result('a', 3, 3, 100), result('d', 0, 0, 0), result('b', 2, 2, 100)];
  assert.deepEqual(takePlaces(results.slice(), 0, 2, false), [{userId: 'a', userName: 'User a'}, {userId: 'b', userName: 'User b'}]);
  assert.deepEqual(takePlaces(results.slice(), 1, 3, false).map(item => item.userId), ['b', 'c']);
  // Till the end of the league.
  assert.deepEqual(takePlaces(results.slice(), 2, undefined, false).map(item => item.userId), ['c', 'd']);
  assert.deepEqual(takePlaces(results.slice(), 0, 10, false).map(item => item.userId), ['a', 'b', 'c', 'd']);
  assert.deepEqual(takePlaces(results.slice(), 4, undefined, false), []);
  assert.deepEqual(takePlaces([], 0, 3, false), []);
});

test('Participants without solved puzzles can be excluded', () => {
  let results = [result('c', 0, 1, 100), result('a', 3, 3, 100), result('d', 0, 0, 0), result('e', 0, 0, 0)];
  assert.deepEqual(takePlaces(results.slice(), 1, undefined, true).map(item => item.userId), ['c']);
  assert.deepEqual(takePlaces(results.slice(), 1, undefined, false).map(item => item.userId), ['c', 'd', 'e']);
});

test('Every participant of the league gets exactly one place', () => {
  let results = [];
  for (let i = 0; i < 20; i++) {
    results.push(result('u' + i, (i * 7) % 5, 5, 1000 + (i * 13) % 20));
  }
  // The same borders as in the leagues: promoted, staying and relegated participants.
  let all = takePlaces(results.slice(), 0, 3, false)
    .concat(takePlaces(results.slice(), 3, 15, false))
    .concat(takePlaces(results.slice(), 15, undefined, false))
    .map(item => item.userId);
  assert.equal(all.length, 20);
  assert.equal(new Set(all).size, 20);
});
