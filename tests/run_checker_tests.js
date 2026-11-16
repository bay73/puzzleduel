// Runs checkers tests (tests/checkers/<type>.test.js) in Node, without a browser.
//
// Usage: node tests/run_checker_tests.js [puzzle_type ...]
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const TESTS_DIR = path.join(__dirname, 'checkers');
const CHECKERS_DIR = path.join(__dirname, '..', 'puzzle_types');
const UTIL_MODULES = ['util', 'sudoku_util', 'pentomino_util'];

// List of names (without extension) of the files in the directory.
function listNames(dir, suffix) {
  return fs.readdirSync(dir)
    .filter(file => file.endsWith(suffix))
    .map(file => file.slice(0, -suffix.length))
    .sort();
}

// Test files are written for browser, so they are executed as scripts sharing global functions.
function runScript(file) {
  vm.runInThisContext(fs.readFileSync(file, 'utf8'), {filename: file});
}

let passedCount = 0;
let failedCount = 0;

function fail(message) {
  console.log(message);
  failedCount++;
}

// Assertions are taken from the library used in browser, the suite is executed right away.
runScript(path.join(__dirname, 'test_suite_lib.js'));
globalThis.test = (name, fn) => ({name: name, fn: fn});
globalThis.checkerTestSuite = (typeCode, name, ...tests) => {
  globalThis.Checker = require(path.join(CHECKERS_DIR, typeCode + '.js'));
  const failures = [];
  tests.forEach(test => {
    try {
      test.fn();
    } catch (error) {
      failures.push('  ' + test.name + ' FAILED\n    ' + (error && error.stack ? error.stack : error));
    }
  });
  passedCount += tests.length - failures.length;
  console.log(name + ' (' + typeCode + '): passed ' + (tests.length - failures.length) + ', failed ' + failures.length);
  failures.forEach(fail);
};

const checkers = listNames(CHECKERS_DIR, '.js').filter(typeCode => !UTIL_MODULES.includes(typeCode));
const tested = listNames(TESTS_DIR, '.test.js');
const requested = process.argv.slice(2);

(requested.length > 0 ? requested : tested).forEach(typeCode => {
  try {
    runScript(path.join(TESTS_DIR, typeCode + '.test.js'));
  } catch (error) {
    fail(typeCode + ' FAILED TO RUN\n    ' + (error && error.stack ? error.stack : error));
  }
});

if (requested.length == 0) {
  // Every checker should have tests, and the tests should be shown at tests.html.
  const browserList = fs.readFileSync(path.join(__dirname, 'all_tests.js'), 'utf8');
  checkers.filter(typeCode => !tested.includes(typeCode))
    .forEach(typeCode => fail('No tests for puzzle_types/' + typeCode + '.js'));
  tested.filter(typeCode => !browserList.includes('"' + typeCode + '"'))
    .forEach(typeCode => fail('tests/checkers/' + typeCode + '.test.js is not listed in tests/all_tests.js'));
}

console.log('\nFAILED: ' + failedCount + ' PASSED: ' + passedCount);
if (failedCount > 0 || passedCount == 0) {
  process.exitCode = 1;
}
