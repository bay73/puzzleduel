// Requests for puzzles which don't exist.
const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const server = require('./helper');

const CLUES = {"d1": "black", "b2": "2", "a4": "black", "d4": "0"};

before(server.start);
after(server.stop);
beforeEach(server.clearData);

test('Unknown puzzle is not found by a guest', async () => {
  const guest = server.client();

  assert.equal((await guest.get('/puzzles/nosuch')).status, 404);
  assert.equal((await guest.get('/puzzles/nosuch/start')).status, 404);
  assert.equal((await guest.post('/puzzles/nosuch/check').send({})).status, 404);
  assert.equal((await guest.post('/puzzles/nosuch/log').send({})).status, 404);
  assert.equal((await guest.get('/single/nosuch')).status, 404);
  assert.equal((await guest.get('/archive/nosuch/scores')).status, 404);
});

test('Unknown puzzle is not found by a logged in user', async () => {
  const solver = await server.loginAs();

  assert.equal((await solver.get('/puzzles/nosuch/start')).status, 404);
  assert.equal((await solver.post('/puzzles/nosuch/check').send({})).status, 404);
  assert.equal((await solver.get('/puzzles/nosuch/get')).status, 404);
  assert.equal((await solver.get('/puzzles/nosuch/log/' + solver.user._id)).status, 404);
});

test('Puzzle is available after the request for it when it did not exist', async () => {
  const guest = server.client();
  assert.equal((await guest.get('/puzzles/akari1/start')).status, 404);

  // The author saves the new puzzle (it refreshes the cached data of the puzzle).
  await server.createPuzzle({code: 'akari1', clues: CLUES, tag: 'public'});
  await require('../../utils/cache').refreshPuzzle('akari1');

  const response = await guest.get('/puzzles/akari1/start');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, CLUES);
});

test('Main page is shown when there is no daily puzzle for today', async () => {
  const guest = server.client();

  const response = await guest.get('/');
  assert.equal(response.status, 200);
});
