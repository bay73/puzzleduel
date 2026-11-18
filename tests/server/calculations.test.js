// Recounting of ratings, contests, duels and leagues with the data in the database.
// The formulas are tested in tests/unit, here we check that the right data is taken from the database
// and the results are stored.
const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const server = require('./helper');

before(server.start);
after(server.stop);
beforeEach(server.clearData);

const MINUTE = 60000;

function close(actual, expected, message) {
  assert.ok(Math.abs(actual - expected) < 1e-6, (message || 'Value') + ': ' + actual + ' instead of ' + expected);
}

async function createUsers(...names) {
  const users = {};
  for (const name of names) {
    users[name] = await server.createUser({name: name, email: name.toLowerCase() + '@example.com'});
  }
  return users;
}

function addTime(puzzleId, user, solvingTime, errCount, properties) {
  const UserSolvingTime = require('../../models/UserSolvingTime');
  return new UserSolvingTime(Object.assign({
    userId: user._id, userName: user.name, puzzleId: puzzleId, solvingTime: solvingTime, errCount: errCount,
    date: new Date('2026-01-05T12:00:00Z'),
  }, properties)).save();
}

// Two daily puzzles of the first week of 2026 (Monday and Tuesday).
// p1: Alice 1:00, Bob 2:00, Carol 4:00 with an error, Eve's result is hidden.
// p2: Bob 0:50, Alice 1:40, Dave started and did not solve.
async function createWeek() {
  const users = await createUsers('Alice', 'Bob', 'Carol', 'Dave', 'Eve');
  await server.createPuzzle({code: 'p1', daily: new Date('2026-01-05T00:00:00Z')});
  await server.createPuzzle({code: 'p2', daily: new Date('2026-01-06T00:00:00Z')});
  await addTime('p1', users.Alice, 60000, 0);
  await addTime('p1', users.Bob, 120000, 0);
  await addTime('p1', users.Carol, 240000, 1);
  await addTime('p1', users.Eve, 10000, 0, {hidden: true});
  await addTime('p2', users.Alice, 100000, 0);
  await addTime('p2', users.Bob, 50000, 0);
  await addTime('p2', users.Dave, undefined, 0);
  return users;
}

test('Rating is computed for the puzzles of the week', async () => {
  const Rating = require('../../models/Rating');
  const { computeRating } = require('../../utils/rating');
  await createWeek();

  // Any day of the week gives the rating for the previous Sunday.
  await computeRating('2026-01-13T10:00:00Z');

  const ratings = await Rating.find({}).sort({userName: 1}).lean();
  assert.deepEqual(ratings.map(rating => rating.userName), ['Alice', 'Bob', 'Carol', 'Dave']);
  ratings.forEach(rating => assert.equal(rating.date.toISOString(), '2026-01-11T00:00:00.000Z'));
  const [alice, bob, carol, dave] = ratings;

  // Medians are 1:30 and 1:15. Performances of Alice are 2000 + 500*log2(1.5) and 2000 - 500*log2(4/3).
  const better = 2000 + 500 * Math.log2(1.5);
  const worse = 2000 - 500 * Math.log2(4 / 3);
  assert.deepEqual(alice.details.puzzles.map(puzzle => puzzle.date.toISOString().substring(0, 10)), ['2026-01-05', '2026-01-06']);
  assert.deepEqual(alice.details.puzzles.map(puzzle => puzzle.type), ['akari', 'akari']);
  close(alice.details.puzzles[0].value, better);
  close(alice.details.puzzles[1].value, worse);
  close(bob.details.puzzles[0].value, worse);
  close(bob.details.puzzles[1].value, better);
  // Two puzzles of seven in the first week of the user.
  const expected = 4 * Math.pow((better + worse) / 2, 0.66) * 2 / 7;
  for (const rating of [alice, bob]) {
    close(rating.details.weekValue, (better + worse) / 2);
    close(rating.value, expected);
    close(rating.change, expected);
    close(rating.details.puzzles[0].change + rating.details.puzzles[1].change, expected);
    assert.deepEqual(
      [rating.solved, rating.ratingWeek, rating.missedWeek, rating.totalStarted, rating.totalSolved],
      [2, 1, 0, 2, 2]);
  }
  // One error costs as the median time: 2000 - 500*log2(240/90 + 1).
  close(carol.details.puzzles[0].value, 2000 - 500 * Math.log2(240 / 90 + 1));
  close(carol.value, 4 * Math.pow(carol.details.puzzles[0].value, 0.66) / 7);
  assert.deepEqual([carol.solved, carol.totalStarted, carol.totalSolved], [1, 1, 1]);
  // Started puzzle which is not solved.
  assert.deepEqual(
    [dave.value, dave.change, dave.solved, dave.ratingWeek, dave.totalStarted, dave.totalSolved],
    [0, 0, 0, 1, 1, 0]);
});

test('Rating is kept in the week without puzzles', async () => {
  const Rating = require('../../models/Rating');
  const { computeRating } = require('../../utils/rating');
  await createWeek();

  await computeRating('2026-01-11T10:00:00Z');
  await computeRating('2026-01-18T10:00:00Z');
  // Recount of the same week replaces the ratings.
  await computeRating('2026-01-18T10:00:00Z');

  const first = await Rating.find({date: new Date('2026-01-11T00:00:00Z')}).sort({userName: 1}).lean();
  const second = await Rating.find({date: new Date('2026-01-18T00:00:00Z')}).sort({userName: 1}).lean();
  assert.equal(first.length, 4);
  assert.equal(second.length, 4);
  for (let i = 0; i < 4; i++) {
    assert.equal(second[i].userName, first[i].userName);
    assert.equal(second[i].value, first[i].value);
    assert.equal(second[i].change, null);
    assert.deepEqual(
      [second[i].solved, second[i].ratingWeek, second[i].missedWeek, second[i].totalStarted, second[i].totalSolved],
      [0, 1, 1, first[i].totalStarted, first[i].totalSolved]);
    assert.deepEqual(second[i].details.puzzles, []);
  }
});

async function createContest(scoring) {
  const Contest = require('../../models/Contest');
  await new Contest({
    code: 'contest1', name: 'Contest', scoring: scoring, start: new Date('2026-01-05T00:00:00Z'),
    puzzles: [
      {puzzleNum: 1, puzzleId: 'p1', revealDate: new Date('2026-01-05T00:00:00Z')},
      {puzzleNum: 2, puzzleId: 'p2', revealDate: new Date('2026-01-06T00:00:00Z')},
      // The puzzle which is not revealed yet.
      {puzzleNum: 3, puzzleId: 'p3', revealDate: new Date(Date.now() + 60 * MINUTE)},
    ],
  }).save();
}

function contestSummary(contest) {
  const names = {};
  contest.results.forEach(result => names[result.userId] = result.userName);
  return {
    results: contest.results
      .map(result => [result.userName, result.score, result.solvedCount, result.totalTime, result.errCount])
      .sort((r1, r2) => r1[0].localeCompare(r2[0])),
    puzzles: contest.puzzles.map(puzzle => puzzle.results.map(result => [names[result.userId], result.score, result.time, result.errors])),
  };
}

test('Contest with power scoring is recounted', async () => {
  const Contest = require('../../models/Contest');
  const { recountContest } = require('../../utils/contest');
  const users = await createWeek();
  await addTime('p3', users.Alice, 60000, 0);
  await createContest({method: 'power', complexityRate: 60000, complexityPower: 0.5, scoringPower: 0.5});

  assert.equal(await recountContest('contest1'), true);

  const contest = await Contest.findOne({code: 'contest1'}).lean();
  assert.deepEqual(contestSummary(contest), {
    results: [['Alice', 2.3, 2, 160000, 0], ['Bob', 2.3, 2, 170000, 0], ['Carol', 0.6, 1, 240000, 1]],
    puzzles: [
      [['Alice', 1.4, 60000, 0], ['Bob', 1, 120000, 0], ['Carol', 0.6, 240000, 1]],
      [['Bob', 1.3, 50000, 0], ['Alice', 0.9, 100000, 0]],
      [],
    ],
  });
  assert.equal(contest.puzzles[0].details.bestTime, 60000);
  assert.equal(contest.puzzles[0].details.medianTime, 90000);
  close(contest.puzzles[0].details.complexity, 90000 * Math.sqrt(1.5));
  assert.equal(contest.puzzles[1].details.medianTime, 75000);
  assert.equal(contest.puzzles[2].details, undefined);
});

test('Contest with log scoring is recounted', async () => {
  const Contest = require('../../models/Contest');
  const { recountContest } = require('../../utils/contest');
  await createWeek();
  await createContest({method: 'log', complexityRate: 30000, complexityPower: 2});

  assert.equal(await recountContest('contest1'), true);

  const contest = await Contest.findOne({code: 'contest1'}).lean();
  assert.deepEqual(contestSummary(contest), {
    results: [['Alice', 1.7, 2, 160000, 0], ['Bob', 1.6, 2, 170000, 0], ['Carol', 0.4, 1, 240000, 1]],
    puzzles: [
      [['Alice', 1.1, 60000, 0], ['Bob', 0.7, 120000, 0], ['Carol', 0.4, 240000, 1]],
      [['Bob', 0.9, 50000, 0], ['Alice', 0.6, 100000, 0]],
      [],
    ],
  });
  close(contest.puzzles[0].details.complexity, Math.log2(3));
});

test('Unknown contest is not recounted', async () => {
  assert.equal(await require('../../utils/contest').recountContest('unknown'), false);
  assert.equal(await require('../../utils/duel').recountContest('unknown'), false);
});

test('Duel: results of the round are counted and the next round is paired', async () => {
  const Contest = require('../../models/Contest');
  const { recountContest } = require('../../utils/duel');
  const users = await createUsers('Alice', 'Bob', 'Carol', 'Dave', 'Eve');
  const id = name => users[name]._id.toString();
  const now = Date.now();
  const firstRound = {};
  firstRound[id('Alice')] = id('Bob');
  firstRound[id('Bob')] = id('Alice');
  firstRound[id('Carol')] = id('Dave');
  firstRound[id('Dave')] = id('Carol');
  // The first round is closed, the second one is not started yet.
  await new Contest({
    code: 'duel1', name: 'Duel', type: 'duel', scoring: {method: 'duel'}, start: new Date(now - 10 * MINUTE), finish: new Date(now + 60 * MINUTE),
    puzzles: [
      {puzzleNum: 1, puzzleId: 'p1', revealDate: new Date(now - 9 * MINUTE), closeDate: new Date(now - 4 * MINUTE)},
      {puzzleNum: 2, puzzleId: 'p2', revealDate: new Date(now + MINUTE), closeDate: new Date(now + 6 * MINUTE)},
    ],
    participants: ['Alice', 'Bob', 'Carol', 'Dave'].map(name => ({userId: users[name]._id, userName: name})),
    seedData: [firstRound],
  }).save();
  const inTime = {date: new Date(now - 6 * MINUTE)};
  await addTime('p1', users.Alice, 60000, 0, inTime);
  await addTime('p1', users.Bob, 90000, 0, inTime);
  await addTime('p1', users.Carol, 50000, 0, inTime);
  // Dave is too late, Eve doesn't take part in the duel.
  await addTime('p1', users.Dave, 30000, 0, {date: new Date(now - 2 * MINUTE)});
  await addTime('p1', users.Eve, 20000, 0, inTime);

  assert.equal(await recountContest('duel1'), true);

  const contest = await Contest.findOne({code: 'duel1'}).lean();
  const results = {};
  contest.results.forEach(result => results[result.userName] = [result.score, result.tiebreakScore, result.started]);
  assert.deepEqual(results, {
    Alice: [2, 1, true],
    Bob: [1, 2, true],
    Carol: [2, 0, true],
    Dave: [0, 2, false],
  });
  assert.deepEqual(
    contest.puzzles[0].results.map(result => [result.userId.toString(), result.score, result.time]),
    [[id('Carol'), 2, 50000], [id('Alice'), 2, 60000], [id('Bob'), 1, 90000]]);
  // Leaders are paired with each other.
  assert.equal(contest.seedData.length, 2);
  const secondRound = {};
  secondRound[id('Alice')] = id('Carol');
  secondRound[id('Carol')] = id('Alice');
  secondRound[id('Bob')] = id('Dave');
  secondRound[id('Dave')] = id('Bob');
  assert.deepEqual(contest.seedData[1], secondRound);
});

test('Duel: participants are paired before the first round', async () => {
  const Contest = require('../../models/Contest');
  const { recountContest } = require('../../utils/duel');
  const users = await createUsers('Alice', 'Bob', 'Carol');
  const now = Date.now();
  await new Contest({
    code: 'duel1', name: 'Duel', type: 'duel', scoring: {method: 'duel'}, start: new Date(now - MINUTE), finish: new Date(now + 60 * MINUTE),
    puzzles: [{puzzleNum: 1, puzzleId: 'p1', revealDate: new Date(now + MINUTE), closeDate: new Date(now + 6 * MINUTE)}],
    participants: ['Alice', 'Bob', 'Carol'].map(name => ({userId: users[name]._id, userName: name})),
    seedData: [],
  }).save();

  assert.equal(await recountContest('duel1'), true);

  const contest = await Contest.findOne({code: 'duel1'}).lean();
  const pairs = contest.seedData[0];
  const ids = Object.values(users).map(user => user._id.toString());
  assert.deepEqual(Object.keys(pairs).sort(), ids.slice().sort());
  const alone = ids.filter(id => pairs[id] === '');
  assert.equal(alone.length, 1);
  ids.filter(id => pairs[id] !== '').forEach(id => assert.equal(pairs[pairs[id]], id));
});

test('League results are recounted', async () => {
  const League = require('../../models/League');
  const { recountLeague } = require('../../utils/league');
  const users = await createUsers('Alice', 'Bob', 'Carol', 'Dave');
  await server.createPuzzle({code: 'p1', daily: new Date('2026-01-05T00:00:00Z')});
  // Carol is the author of the second puzzle.
  await server.createPuzzle({code: 'p2', daily: new Date('2026-01-06T00:00:00Z'), author: users.Carol._id, difficulty: 75000});
  // The puzzle of the next month.
  await server.createPuzzle({code: 'p3', daily: new Date('2026-02-02T00:00:00Z')});
  await addTime('p1', users.Alice, 60000, 0);
  await addTime('p2', users.Alice, 100000, 1);
  await addTime('p3', users.Alice, 100000, 0, {date: new Date('2026-02-02T12:00:00Z')});
  await addTime('p1', users.Bob, 120000, 0);
  await addTime('p2', users.Bob, undefined, 0);
  await addTime('p1', users.Carol, 240000, 0);
  await addTime('p2', users.Carol, 5000, 0, {hidden: true});
  await new League({
    code: '3bxc1wolfgm8dof', name: 'Red League',
    start: new Date('2026-01-01T00:00:00Z'), finish: new Date('2026-02-01T00:00:00Z'),
    participants: ['Alice', 'Bob', 'Carol', 'Dave'].map(name => ({userId: users[name]._id, userName: name})),
  }).save();

  await recountLeague('3bxc1wolfgm8dof', '2026-01-15T10:00:00Z');

  const league = await League.findOne({code: '3bxc1wolfgm8dof'}).lean();
  assert.deepEqual(
    league.results.map(result => [result.userName, result.solvedCount, result.totalSolvedCount, result.totalTime]),
    [['Alice', 1, 2, 160000], ['Bob', 1, 1, 120000], ['Carol', 2, 2, 315000], ['Dave', 0, 0, 0]]);
});

test('Leagues of the next month: the best are promoted and the worst are relegated', async () => {
  const League = require('../../models/League');
  const mongoose = require('mongoose');
  const { createNextMonth } = require('../../utils/league');
  const RED = '3bxc1wolfgm8dof';
  const ORANGE = '3bxc1wolfgm8dpe';
  // Dates are computed in the same way as in createNextMonth.
  const start = new Date();
  start.setMonth(start.getMonth() + 1);
  start.setUTCHours(0, 0, 0, 0);
  start.setDate(1);
  const previousStart = new Date(start);
  previousStart.setMonth(start.getMonth() - 1);
  // The more puzzles are solved, the higher is the place: red1 is the first, red20 is the last.
  const results = (prefix, count) => {
    const list = [];
    for (let i = count; i >= 1; i--) {
      list.push({userId: new mongoose.Types.ObjectId(), userName: prefix + i, solvedCount: count - i, totalSolvedCount: count - i + 1, totalTime: 1000});
    }
    return list;
  };
  for (const [code, name, prefix, count] of [[RED, 'Red League', 'red', 20], [ORANGE, 'Orange League', 'orange', 7]]) {
    const list = results(prefix, count);
    await new League({code: code, name: name, start: previousStart, finish: start, results: list,
      participants: list.map(result => ({userId: result.userId, userName: result.userName}))}).save();
  }

  await createNextMonth(start);

  const names = async code => (await League.findOne({code: code, start: start}).lean()).participants.map(item => item.userName);
  const range = (prefix, from, to) => {
    const list = [];
    for (let i = from; i <= to; i++) list.push(prefix + i);
    return list;
  };
  // 15 participants stay in the Red League, 5 best participants of the Orange League are promoted.
  assert.deepEqual(await names(RED), range('red', 1, 15).concat(range('orange', 1, 5)));
  // 5 last participants of the Red League are relegated.
  assert.deepEqual(await names(ORANGE), range('red', 16, 20).concat(range('orange', 6, 7)));
  assert.equal(await League.countDocuments({start: start}), 5);
  assert.equal(await League.countDocuments({}), 7);
});
