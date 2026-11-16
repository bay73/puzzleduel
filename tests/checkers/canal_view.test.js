// Puzzle 4x4 (# is a given black cell, x is a cross) and its solution (# is a black cell):
//   # . . 3      # # # .
//   . 3 . .      # . # .
//   . x . .      # . # #
//   . . 5 .      # # . .
checkerTestSuite("canal_view", "Canal view",

test('Correct solution',(suite) => {
  let clues = {"a1": "black", "d1": "3", "b2": "3", "b3": "cross", "c4": "5"};
  let data = {"b1": "black", "c1": "black", "a2": "black", "c2": "black", "a3": "black", "c3": "black", "d3": "black", "a4": "black", "b4": "black"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Black area is not connected',(suite) => {
  let clues = {"a1": "black", "d1": "3", "b2": "3", "b3": "cross", "c4": "5"};
  // Cell a3 is not black, so a4 and b4 are separated from the others.
  let data = {"b1": "black", "c1": "black", "a2": "black", "c2": "black", "c3": "black", "d3": "black", "a4": "black", "b4": "black"};

  assert("Not connected response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Black area should be connected"});
}),

test('Black square 2x2',(suite) => {
  let clues = {"a1": "black", "d1": "3", "b2": "3", "b3": "cross", "c4": "5"};
  // Extra black cell d2 forms square c2-d2-c3-d3.
  let data = {"b1": "black", "c1": "black", "a2": "black", "c2": "black", "d2": "black", "a3": "black", "c3": "black", "d3": "black", "a4": "black", "b4": "black"};

  assert("Square 2x2 response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "No 2x2 black squares are allowed", errors: ["c2", "d2", "c3", "d3"]});
}),

test('Wrong number of black cells seen from the clue',(suite) => {
  let clues = {"a1": "black", "d1": "3", "b2": "3", "b3": "cross", "c4": "5"};
  // Cell b4 is not black: only three black cells (c3, c2, c1) are seen from c4.
  let data = {"b1": "black", "c1": "black", "a2": "black", "c2": "black", "a3": "black", "c3": "black", "d3": "black", "a4": "black"};

  assert("Wrong clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["c4"]});
}),

);
