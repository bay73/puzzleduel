// Scoring and pairing of duels (utils/calc/duel.js).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { roundScores, buchholz, initialPairs, compareResults, swissPairs } = require('../../utils/calc/duel');

const DEADLINE = new Date('2026-01-05T12:05:00Z');
const IN_TIME = new Date('2026-01-05T12:03:00Z');
const LATE = new Date('2026-01-05T12:06:00Z');

function time(userId, solvingTime, date) {
  return {userId: userId, userName: 'User ' + userId, solvingTime: solvingTime, date: date || IN_TIME};
}

// Builds the map of opponents from the list of pairs: pairs(["A", "B"], ["C"]).
function pairs(...list) {
  let map = {};
  list.forEach(([first, second]) => {
    map[first] = second || "";
    if (second) map[second] = first;
  });
  return map;
}

function participants(...ids) {
  return ids.map(id => ({userId: id, started: true}));
}

// Checks that the pairs are consistent: everybody has exactly one opponent or stays alone.
function assertValidPairs(result, ids) {
  assert.deepEqual(Object.keys(result).sort(), ids.slice().sort());
  let alone = 0;
  ids.forEach(id => {
    if (result[id] === "") {
      alone++;
    } else {
      assert.notEqual(result[id], id);
      assert.equal(result[result[id]], id);
    }
  });
  assert.equal(alone, ids.length % 2);
}

test('Winner of the pair gets 2 points and the other one gets 1 point', () => {
  assert.deepEqual(
    roundScores([time('A', 50000), time('B', 80000)], pairs(['A', 'B']), DEADLINE),
    [
      {userId: 'A', userName: 'User A', score: 2, time: 50000},
      {userId: 'B', userName: 'User B', score: 1, time: 80000},
    ]);
});

test('Scores are computed for every pair separately', () => {
  let results = roundScores(
    [time('C', 40000), time('A', 50000), time('B', 80000), time('D', 90000)],
    pairs(['A', 'B'], ['C', 'D']), DEADLINE);
  assert.deepEqual(results.map(result => [result.userId, result.score]), [['C', 2], ['A', 2], ['B', 1], ['D', 1]]);
});

test('Solver gets 2 points if the opponent did not solve the puzzle', () => {
  let results = roundScores([time('B', 80000)], pairs(['A', 'B']), DEADLINE);
  assert.deepEqual(results.map(result => [result.userId, result.score]), [['B', 2]]);
});

test('Solver without opponent gets 2 points', () => {
  let results = roundScores([time('A', 50000), time('B', 60000), time('C', 300000)], pairs(['A', 'B'], ['C']), DEADLINE);
  assert.deepEqual(results.map(result => [result.userId, result.score]), [['A', 2], ['B', 1], ['C', 2]]);
});

test('Both solvers get 2 points for equal times', () => {
  let results = roundScores([time('A', 50000), time('B', 50000)], pairs(['A', 'B']), DEADLINE);
  assert.deepEqual(results.map(result => [result.userId, result.score]), [['A', 2], ['B', 2]]);
});

test('Results after the deadline are not counted', () => {
  let results = roundScores([time('A', 50000, LATE), time('B', 80000)], pairs(['A', 'B']), DEADLINE);
  assert.deepEqual(results.map(result => [result.userId, result.score]), [['B', 2]]);
  assert.deepEqual(roundScores([time('A', 50000, DEADLINE)], pairs(['A', 'B']), DEADLINE), []);
});

test('Everybody gets 2 points if the round has no pairs', () => {
  let results = roundScores([time('A', 50000), time('B', 80000)], undefined, DEADLINE);
  assert.deepEqual(results.map(result => [result.userId, result.score]), [['A', 2], ['B', 2]]);
});

test('Tie-break score is the sum of the scores of the opponents', () => {
  let totals = {A: {score: 5}, B: {score: 3}, C: {score: 4}, D: {score: 0}};
  let seedData = [pairs(['A', 'B'], ['C', 'D']), pairs(['A', 'C'], ['B', 'D'])];
  assert.equal(buchholz('A', seedData, totals), 7);
  assert.equal(buchholz('B', seedData, totals), 5);
  assert.equal(buchholz('C', seedData, totals), 5);
  assert.equal(buchholz('D', seedData, totals), 7);
});

test('Tie-break score ignores missed rounds and unknown opponents', () => {
  let totals = {A: {score: 5}, B: {score: 3}, C: {score: 4}};
  assert.equal(buchholz('C', [pairs(['A', 'B'], ['C']), pairs(['A', 'C'], ['B'])], totals), 5);
  assert.equal(buchholz('A', [pairs(['A', 'X'])], totals), 0);
  assert.equal(buchholz('A', undefined, totals), 0);
  assert.equal(buchholz('A', [], totals), 0);
});

test('Initial pairs for even number of participants', () => {
  assert.deepEqual(initialPairs(['A', 'B', 'C', 'D']), {A: 'B', B: 'A', C: 'D', D: 'C'});
  assert.deepEqual(initialPairs(['A', 'B']), {A: 'B', B: 'A'});
  assert.deepEqual(initialPairs([]), {});
});

test('Last participant stays without opponent for odd number of participants', () => {
  assert.deepEqual(initialPairs(['A', 'B', 'C']), {A: 'B', B: 'A', C: ''});
  assert.deepEqual(initialPairs(['A']), {A: ''});
});

test('Participants are ordered by score and then by time', () => {
  let list = [
    {userId: 'A', score: 2, tiebreakScore: 3, time: 500},
    {userId: 'B', score: 4, tiebreakScore: 3, time: 900},
    {userId: 'C', score: 4, tiebreakScore: 3, time: 700},
    {userId: 'D', score: 0, tiebreakScore: 3, time: 0},
  ];
  assert.deepEqual(list.sort(compareResults).map(result => result.userId), ['C', 'B', 'A', 'D']);
  assert.equal(compareResults(list[0], list[0]), 0);
});

test('Neighbours in the standings are paired', () => {
  let result = swissPairs(participants('A', 'B', 'C', 'D'), [pairs(['A', 'C'], ['B', 'D'])], 1);
  assert.deepEqual(result, {A: 'B', B: 'A', C: 'D', D: 'C'});
});

test('Participants do not meet twice', () => {
  let seedData = [pairs(['A', 'B'], ['C', 'D'])];
  let result = swissPairs(participants('A', 'B', 'C', 'D'), seedData, 1);
  assert.deepEqual(result, {A: 'C', C: 'A', B: 'D', D: 'B'});

  seedData.push(result);
  assert.deepEqual(swissPairs(participants('A', 'B', 'C', 'D'), seedData, 2), {A: 'D', D: 'A', B: 'C', C: 'B'});
});

test('Only the previous rounds are taken into account', () => {
  // Reseeding of the second round: its old pairs and the pairs of the next rounds are ignored.
  let seedData = [pairs(['A', 'C'], ['B', 'D']), pairs(['A', 'B'], ['C', 'D'])];
  assert.deepEqual(swissPairs(participants('A', 'B', 'C', 'D'), seedData, 1), {A: 'B', B: 'A', C: 'D', D: 'C'});
});

test('Pairs are rebuilt if the last participants have already met', () => {
  // A-D and B-C is the first choice, but then E and F are left and they have already met.
  let seedData = [pairs(['A', 'B'], ['C', 'D'], ['E', 'F']), pairs(['A', 'C'], ['B', 'E'], ['D', 'F'])];
  let result = swissPairs(participants('A', 'B', 'C', 'D', 'E', 'F'), seedData, 2);
  assert.deepEqual(result, {A: 'D', D: 'A', B: 'F', F: 'B', C: 'E', E: 'C'});
});

test('Last participant stays without opponent for odd number of participants in the next rounds', () => {
  let result = swissPairs(participants('A', 'B', 'C', 'D', 'E'), [pairs(['A', 'C'], ['B', 'D'], ['E'])], 1);
  assertValidPairs(result, ['A', 'B', 'C', 'D', 'E']);
  assert.deepEqual(result, {A: 'B', B: 'A', C: 'E', E: 'C', D: ''});
});

test('Nobody stays without opponent twice', () => {
  // A-C and B-D is the first choice, but E has already missed the first round.
  let seedData = [pairs(['A', 'B'], ['C', 'D'], ['E'])];
  let result = swissPairs(participants('A', 'B', 'C', 'D', 'E'), seedData, 1);
  assert.deepEqual(result, {A: 'C', C: 'A', B: 'E', E: 'B', D: ''});
});

test('Participant who does not solve can stay without opponent again', () => {
  let seedData = [pairs(['A', 'B'], ['C', 'D'], ['E'])];
  let list = participants('A', 'B', 'C', 'D', 'E');
  list[4].started = false;
  assert.deepEqual(swissPairs(list, seedData, 1), {A: 'C', C: 'A', B: 'D', D: 'B', E: ''});
});

test('Participants who do not solve can be paired again', () => {
  let list = [{userId: 'C', started: false}, {userId: 'D', started: false}];
  assert.deepEqual(swissPairs(list, [pairs(['C', 'D'])], 1), {C: 'D', D: 'C'});

  // A and B have already met, C and D have already met too, but C and D don't solve.
  list = participants('A', 'B', 'C', 'D');
  list[2].started = false;
  list[3].started = false;
  let seedData = [pairs(['A', 'C'], ['B', 'D']), pairs(['A', 'D'], ['B', 'C']), pairs(['A', 'B'], ['C', 'D'])];
  // Active participants have no new opponents.
  assert.equal(swissPairs(list, seedData, 3), null);
  // Without the third round A and B can be paired, C and D are paired again.
  seedData[2] = pairs(['C', 'D']);
  assert.deepEqual(swissPairs(list, seedData, 3), {A: 'B', B: 'A', C: 'D', D: 'C'});
});

test('No pairs if everybody has already met everybody', () => {
  let seedData = [pairs(['A', 'B'], ['C', 'D']), pairs(['A', 'C'], ['B', 'D']), pairs(['A', 'D'], ['B', 'C'])];
  assert.equal(swissPairs(participants('A', 'B', 'C', 'D'), seedData, 3), null);
  assert.equal(swissPairs(participants('A', 'B'), [pairs(['A', 'B'])], 1), null);
});

test('Pairs of big tournament are valid in every round', () => {
  for (const count of [8, 9, 16, 17]) {
    let ids = [];
    for (let i = 0; i < count; i++) ids.push('U' + (i < 10 ? '0' : '') + i);
    let seedData = [initialPairs(ids)];
    let met = new Set();
    let missed = new Set();
    let remember = function(round) {
      ids.forEach(id => {
        if (round[id] === "") {
          assert.ok(!missed.has(id), id + ' stays without opponent twice');
          missed.add(id);
        } else if (id < round[id]) {
          assert.ok(!met.has(id + round[id]), id + ' and ' + round[id] + ' meet twice');
          met.add(id + round[id]);
        }
      });
    };
    remember(seedData[0]);
    for (let round = 1; round < 4; round++) {
      // Standings are rotated to get different orders in the rounds.
      let order = ids.slice(round * 3).concat(ids.slice(0, round * 3));
      let result = swissPairs(participants(...order), seedData, round);
      assert.notEqual(result, null, 'Round ' + (round + 1) + ' for ' + count + ' participants');
      assertValidPairs(result, ids);
      remember(result);
      seedData.push(result);
    }
  }
});
