// Runs checkers tests from tests/*.test.js files in Node (without a browser).
//
// Usage: node tests/run_checker_tests.js [puzzle_type ...]
//
// The test files are written for tests.html and contain tests of different kinds.
// Only the tests which don't use the puzzle grid (i.e. don't use the `suite` object)
// are executed here: those are the tests which call the checker of the puzzle type.
// The checker is taken from puzzle_types/<name>.js for the test file tests/<name>.test.js.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const TESTS_DIR = __dirname;
const CHECKERS_DIR = path.join(__dirname, '..', 'puzzle_types');
const UTIL_MODULES = ['util', 'sudoku_util', 'pentomino_util'];
const TEST_SUFFIX = '.test.js';

function isGridTest(fn) {
  return /\bsuite\s*\./.test(fn.toString());
}

// Prepares global functions used by the test files: assertions are taken
// from the library used in browser, the rest is replaced.
// Everything is executed in the main context (not in a separate vm context), because
// the assertions compare objects created by the tests with objects created by checkers.
const suites = [];

function prepareGlobals() {
  const libFile = path.join(TESTS_DIR, 'test_suite_lib.js');
  vm.runInThisContext(fs.readFileSync(libFile, 'utf8'), {filename: libFile});
  const ignored = () => ({});
  Object.assign(globalThis, {
    testSuite: (name, ...items) => {
      const suite = {name: name, tests: items.filter(item => item && typeof item.fn == 'function')};
      suites.push(suite);
      return suite;
    },
    test: (name, fn) => ({name: name, fn: fn}),
    before: ignored,
    after: ignored,
    beforeSuite: ignored,
    afterSuite: ignored,
  });
}

function checkAllCheckersLoad() {
  const errors = [];
  fs.readdirSync(CHECKERS_DIR).filter(file => file.endsWith('.js')).sort().forEach(file => {
    try {
      const checker = require(path.join(CHECKERS_DIR, file));
      if (!UTIL_MODULES.includes(path.basename(file, '.js')) && typeof checker.check != 'function') {
        errors.push(file + ': check function is not exported');
      }
    } catch (error) {
      errors.push(file + ': ' + error);
    }
  });
  return errors;
}

function runTestFile(typeCode) {
  const testFile = path.join(TESTS_DIR, typeCode + TEST_SUFFIX);
  suites.length = 0;
  vm.runInThisContext(fs.readFileSync(testFile, 'utf8'), {filename: testFile});
  const result = {typeCode: typeCode, passed: 0, failed: []};
  suites.forEach(suite => {
    result.name = suite.name;
    const tests = suite.tests.filter(test => !isGridTest(test.fn));
    if (tests.length == 0) {
      return;
    }
    globalThis.Checker = require(path.join(CHECKERS_DIR, typeCode + '.js'));
    tests.forEach(test => {
      try {
        test.fn({});
        result.passed++;
      } catch (error) {
        result.failed.push({name: test.name, error: error && error.stack ? error.stack : String(error)});
      }
    });
  });
  return result;
}

function main() {
  prepareGlobals();
  let typeCodes = process.argv.slice(2);
  let failedCount = 0;
  if (typeCodes.length == 0) {
    typeCodes = fs.readdirSync(TESTS_DIR)
      .filter(file => file.endsWith(TEST_SUFFIX))
      .map(file => file.slice(0, -TEST_SUFFIX.length))
      .sort();
    const loadErrors = checkAllCheckersLoad();
    if (loadErrors.length > 0) {
      console.log('Checkers which can not be loaded:');
      loadErrors.forEach(error => console.log('  ' + error));
      failedCount += loadErrors.length;
    }
  }

  let passedCount = 0;
  const withoutTests = [];
  typeCodes.forEach(typeCode => {
    let result;
    try {
      result = runTestFile(typeCode);
    } catch (error) {
      console.log(typeCode + ' FAILED TO RUN\n    ' + (error && error.stack ? error.stack : error));
      failedCount++;
      return;
    }
    if (result.passed == 0 && result.failed.length == 0) {
      withoutTests.push(typeCode);
      return;
    }
    passedCount += result.passed;
    failedCount += result.failed.length;
    console.log(result.name + ' (' + typeCode + '): passed ' + result.passed + ', failed ' + result.failed.length);
    result.failed.forEach(failure => console.log('  ' + failure.name + ' FAILED\n    ' + failure.error));
  });

  if (withoutTests.length > 0) {
    console.log('\nTest files without checker tests (' + withoutTests.length + '): ' + withoutTests.join(', '));
  }
  console.log('\nFAILED: ' + failedCount + ' PASSED: ' + passedCount);
  if (failedCount > 0 || passedCount == 0) {
    process.exitCode = 1;
  }
}

main();
