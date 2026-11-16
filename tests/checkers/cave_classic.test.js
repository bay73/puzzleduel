// Puzzle 4x4 (# is a given black cell, x is a cross) and its solution (# is a black cell):
//   # . . .      # # . #
//   . x 5 .      . . . #
//   3 . . .      . # . .
//   . . . 2      . # # .
checkerTestSuite("cave_classic", "Cave",

test('Correct solution',(suite) => {
  let clues = {"a1": "black", "b2": "cross", "c2": "5", "a3": "3", "d4": "2"};
  let data = {"b1": "black", "d1": "black", "d2": "black", "b3": "black", "b4": "black", "c4": "black"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('White area is not connected',(suite) => {
  let clues = {"a1": "black", "b2": "cross", "c2": "5", "a3": "3", "d4": "2"};
  // Extra black cell c3 separates d3 and d4 from other white cells.
  let data = {"b1": "black", "d1": "black", "d2": "black", "b3": "black", "c3": "black", "b4": "black", "c4": "black"};

  assert("Not connected response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "White area should be connected"});
}),

test('Black cell is not connected to the edge',(suite) => {
  let clues = {"a1": "black", "b2": "cross", "c2": "5", "a3": "3", "d4": "2"};
  // Cell b4 is not black, so b3 is surrounded by white cells.
  let data = {"b1": "black", "d1": "black", "d2": "black", "b3": "black", "c4": "black"};

  assert("Not connected to edge response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All black cells should be connected to the edge of the grid", errors: ["b3"]});
}),

test('Wrong number of cells seen from the clue',(suite) => {
  let clues = {"a1": "black", "b2": "cross", "c2": "5", "a3": "3", "d4": "2"};
  // Cell d2 is not black: six cells (c1, a2, b2, c2, d2, c3) are seen from c2.
  let data = {"b1": "black", "d1": "black", "b3": "black", "b4": "black", "c4": "black"};

  assert("Wrong clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["c2"]});
}),

);
