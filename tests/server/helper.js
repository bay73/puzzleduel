// Environment for the server tests: the application is started with temporary databases
// in memory (mongodb-memory-server), requests are sent by supertest without listening on a port.
//
// Usage in a test file (node:test):
//   const server = require('./helper');
//   before(server.start);  after(server.stop);  beforeEach(server.clearData);
//
// The tests should be run from the root of the project (npm run test:server),
// because the server reads views, locales and checkers by relative paths.
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;
let app = null;

// Starts the databases and loads the application. Should be called before any server module is loaded.
async function start() {
  mongod = await MongoMemoryServer.create();
  // Addresses of the temporary databases. Without them config/keys.js refuses to work in the test mode,
  // so the tests can't be connected to the real databases by mistake.
  process.env.NODE_ENV = 'test';
  process.env.MONGO_DATA_URI = mongod.getUri('test_data');
  process.env.MONGO_LOG_URI = mongod.getUri('test_log');
  process.env.MONGO_AUTH_URI = mongod.getUri('test_auth');
  process.env.COOCKIE_SECRET = 'secret for tests';
  app = require('../../app');
  const { dataDb, logDb } = require('../../config/db').connectDBs();
  await Promise.all([dataDb.asPromise(), logDb.asPromise()]);
  // One more check that the tests work with the temporary databases only.
  for (const db of [dataDb, logDb]) {
    if (db.host != '127.0.0.1' && db.host != 'localhost') {
      throw new Error('Tests are connected to the database at ' + db.host);
    }
  }
}

// Closes all connections and stops the databases.
async function stop() {
  const { dataDb, logDb } = require('../../config/db').connectDBs();
  await dataDb.close();
  await logDb.close();
  await require('../../config/auth').sessionConfig.store.close();
  await mongod.stop();
}

// Removes all data, sessions and cached values. Should be called before every test.
async function clearData() {
  const { dataDb, logDb } = require('../../config/db').connectDBs();
  for (const db of [dataDb, logDb]) {
    for (const model of Object.values(db.models)) {
      await model.deleteMany({});
    }
  }
  require('../../utils/cache').resetCache();
}

// Client which keeps cookies between requests, i.e. works as a browser of one user.
function client() {
  return require('supertest').agent(app);
}

async function createUser(properties) {
  const User = require('../../models/User');
  const bcrypt = require('bcryptjs');
  const data = Object.assign({name: 'solver', email: 'solver@example.com', password: 'password'}, properties);
  const user = new User(Object.assign({}, data, {password: await bcrypt.hash(data.password, 4)}));
  await user.save();
  return user;
}

// Creates a user and returns the client which is logged in as this user.
async function loginAs(properties) {
  const data = Object.assign({name: 'solver', email: 'solver@example.com', password: 'password'}, properties);
  const user = await createUser(data);
  const agent = client();
  const response = await agent.post('/users/login').type('form').send({email: data.email, password: data.password});
  if (response.status != 302 || response.headers.location != '/') {
    throw new Error('Login failed: ' + response.status + ' ' + response.headers.location);
  }
  agent.user = user;
  return agent;
}

// Creates a puzzle. By default it is the daily puzzle published an hour ago: it is visible for everybody
// and competitive (solving time is stored, user should be logged in).
// Clues of the puzzle are given as an object, like in the checker tests.
async function createPuzzle(properties) {
  const Puzzle = require('../../models/Puzzle');
  const data = Object.assign({
    code: 'puzzle1',
    type: 'akari',
    dimension: '4x4',
    tag: 'daily',
    daily: new Date(Date.now() - 60*60*1000),
    // Every puzzle has an author, by default it is a user which doesn't take part in the test.
    author: new (require('mongoose').Types.ObjectId)(),
    clues: {},
  }, properties);
  const puzzle = new Puzzle(Object.assign({}, data, {data: JSON.stringify(data.clues)}));
  await puzzle.save();
  return puzzle;
}

module.exports = { start, stop, clearData, client, createUser, loginAs, createPuzzle };
