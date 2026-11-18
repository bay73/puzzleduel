// Solving of a competitive puzzle: start, wrong submission, correct submission.
const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const server = require('./helper');

// Akari puzzle 4x4 and its solution from tests/checkers/akari.test.js.
const CLUES = {"d1": "black", "b2": "2", "a4": "black", "d4": "0"};
const SOLUTION = {"b1": "bulb", "a2": "bulb", "d2": "bulb", "c3": "bulb", "b4": "bulb"};
const WRONG_SOLUTION = {"b1": "bulb", "a2": "bulb", "d2": "bulb", "c3": "bulb"};

before(server.start);
after(server.stop);
beforeEach(server.clearData);

test('Solver gets the puzzle, submits a wrong and then the correct solution', async () => {
  const UserSolvingTime = require('../../models/UserSolvingTime');
  const UserActionLog = require('../../models/UserActionLog');
  await server.createPuzzle({code: 'akari1', clues: CLUES});
  const solver = await server.loginAs({name: 'Alice', email: 'alice@example.com'});

  // Start of solving returns the clues and creates the record of the solver without the time.
  let response = await solver.get('/puzzles/akari1/start');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, CLUES);
  let time = await UserSolvingTime.findOne({puzzleId: 'akari1'});
  assert.equal(time.userName, 'Alice');
  assert.equal(time.solvingTime, undefined);

  // Wrong solution: the answer of the checker is returned, the puzzle is still not solved.
  response = await solver.post('/puzzles/akari1/check').send(WRONG_SOLUTION);
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {status: 'All white cells should be illuminated', errors: ['b4']});
  time = await UserSolvingTime.findOne({puzzleId: 'akari1'});
  assert.equal(time.solvingTime, undefined);

  // Correct solution: the time is stored with one error.
  response = await solver.post('/puzzles/akari1/check').send(SOLUTION);
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {status: 'OK'});
  time = await UserSolvingTime.findOne({puzzleId: 'akari1'});
  assert.ok(time.userId.equals(solver.user._id));
  assert.equal(time.errCount, 1);
  assert.equal(typeof time.solvingTime, 'number');
  assert.ok(time.solvingTime >= 0);
  assert.equal(time.hidden, undefined);

  // All the actions are logged.
  const actions = (await UserActionLog.find({puzzleId: 'akari1'}).sort('date')).map(log => log.action);
  assert.deepEqual(actions, ['start', 'submitted', 'solved']);
});

test('Solving time is not changed by the next correct submission', async () => {
  const UserSolvingTime = require('../../models/UserSolvingTime');
  await server.createPuzzle({code: 'akari1', clues: CLUES});
  const solver = await server.loginAs();

  await solver.get('/puzzles/akari1/start');
  await solver.post('/puzzles/akari1/check').send(SOLUTION);
  const first = await UserSolvingTime.findOne({puzzleId: 'akari1'});

  await solver.post('/puzzles/akari1/check').send(WRONG_SOLUTION);
  await solver.post('/puzzles/akari1/check').send(SOLUTION);
  const second = await UserSolvingTime.findOne({puzzleId: 'akari1'});

  assert.equal(second.solvingTime, first.solvingTime);
  assert.equal(second.errCount, 0);
});

test('Competitive puzzle can not be solved without login', async () => {
  const UserSolvingTime = require('../../models/UserSolvingTime');
  await server.createPuzzle({code: 'akari1', clues: CLUES});
  const guest = server.client();

  let response = await guest.get('/puzzles/akari1/start');
  assert.equal(response.status, 403);

  response = await guest.post('/puzzles/akari1/check').send(SOLUTION);
  assert.equal(response.status, 403);
  assert.equal(await UserSolvingTime.countDocuments({}), 0);
});

test('Public puzzle is checked for a guest and the result is not stored', async () => {
  const UserSolvingTime = require('../../models/UserSolvingTime');
  await server.createPuzzle({code: 'akari1', clues: CLUES, tag: 'public'});
  const guest = server.client();

  let response = await guest.get('/puzzles/akari1/start');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, CLUES);

  response = await guest.post('/puzzles/akari1/check').send(WRONG_SOLUTION);
  assert.deepEqual(response.body, {status: 'All white cells should be illuminated', errors: ['b4']});

  response = await guest.post('/puzzles/akari1/check').send(SOLUTION);
  assert.deepEqual(response.body, {status: 'OK'});
  assert.equal(await UserSolvingTime.countDocuments({}), 0);
});

test('Puzzle which is not published yet is not available', async () => {
  // Daily puzzle of tomorrow.
  await server.createPuzzle({code: 'akari1', clues: CLUES, daily: new Date(Date.now() + 24*60*60*1000)});
  const solver = await server.loginAs();

  const response = await solver.get('/puzzles/akari1/start');
  assert.equal(response.status, 404);
});

test('Result of the author of the puzzle is hidden', async () => {
  const UserSolvingTime = require('../../models/UserSolvingTime');
  const author = await server.loginAs({name: 'Author', email: 'author@example.com'});
  await server.createPuzzle({code: 'akari1', clues: CLUES, author: author.user._id});

  await author.get('/puzzles/akari1/start');
  const response = await author.post('/puzzles/akari1/check').send(SOLUTION);
  assert.deepEqual(response.body, {status: 'OK'});

  const time = await UserSolvingTime.findOne({puzzleId: 'akari1'});
  assert.equal(time.hidden, true);
});
