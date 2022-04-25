yingYangCheckerTestSuite = testSuite("Yin yang solution checker",

beforeSuite((suite, cb)=> {
  module = {};
  requirejs(['puzzle_types/util.js'], function() {
    window.util=Util;
    requirejs(['puzzle_types/yin_yang_classic.js'], function() {
      cb();
    });
  });
}),

after((suite)=> {
  Snap(suite.GRID_SELECTOR).clear();
}),

test('Correct solution',(suite) => {
  let clues = {"a1": "white_circle", "b2": "white_circle", "c3": "white_circle", "d1": "white_circle"};
  let data = {"a2": "black_circle", "a3": "black_circle", "a4": "black_circle", "b1": "white_circle", "b3": "white_circle", "b4": "black_circle", "c1": "white_circle", "c2": "black_circle", "c4": "black_circle", "d2": "black_circle", "d3": "black_circle", "d4": "black_circle"}

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Incorrect white 2x2',(suite) => {
  let clues = {"a1": "white_circle", "b2": "white_circle", "c3": "white_circle", "d1": "white_circle"};
  let data = {"a2": "white_circle", "a3": "black_circle", "a4": "black_circle", "b1": "white_circle", "b3": "white_circle", "b4": "black_circle", "c1": "white_circle", "c2": "black_circle", "c4": "black_circle", "d2": "black_circle", "d3": "black_circle", "d4": "black_circle"}

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"No 2x2 squares are allowed","errors":["a1","b1","a2","b2"]});
}),

test('Non-connected black',(suite) => {
  let clues = {"a1": "white_circle", "b2": "white_circle", "c3": "white_circle", "d1": "white_circle"};
  let data = {"a2": "black_circle", "a3": "black_circle", "a4": "black_circle", "b1": "white_circle", "b3": "white_circle", "b4": "black_circle", "c1": "white_circle", "c2": "black_circle", "c4": "black_circle", "d2": "black_circle", "d3": "white_circle", "d4": "black_circle"}

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Area of one color should be connected"});
}),

test('Ignore clue obverride',(suite) => {
  let clues = {"a1": "white_circle", "b2": "white_circle", "c3": "white_circle", "d1": "white_circle"};
  let data = {"a2": "black_circle", "a3": "black_circle", "a4": "black_circle", "b1": "white_circle", "b2": "black_circle", "b3": "white_circle", "b4": "black_circle", "c1": "white_circle", "c2": "white_circle", "c4": "black_circle", "d2": "black_circle", "d3": "black_circle", "d4": "black_circle"}

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"No 2x2 squares are allowed","errors":["b1","c1","b2","c2"]});
}),

// end "Puzzle checkers" test suite
);

