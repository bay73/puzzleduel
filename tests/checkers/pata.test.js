// Puzzle 4x4 and its solution (# is a black cell, clue in c2 is 1_2, i.e. groups of 1 and 2 white cells):
//   . # . .        a1 b1 c1 d1
//   # # 1_2 #      a2 b2 c2 d2
//   . # . #        a3 b3 c3 d3
//   1 # # #        a4 b4 c4 d4
checkerTestSuite("pata", "Pata",

test('Correct solution',(suite) => {
  let clues = {"c2": "1_2", "a4": "1"};
  let data = {"b1": "black", "a2": "black", "b2": "black", "d2": "black", "b3": "black", "d3": "black", "b4": "black", "c4": "black", "d4": "black"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Black square 2x2',(suite) => {
  let clues = {"c2": "1_2", "a4": "1"};
  // Extra black cell a1 creates the square a1-b1-a2-b2.
  let data = {"a1": "black", "b1": "black", "a2": "black", "b2": "black", "d2": "black", "b3": "black", "d3": "black", "b4": "black", "c4": "black", "d4": "black"};

  assert("Black square response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "No 2x2 black squares are allowed", errors: ["a1", "b1", "a2", "b2"]});
}),

test('Black area is not connected',(suite) => {
  let clues = {"c2": "1_2", "a4": "1"};
  // Without b3 the black cells b1, a2 and b2 are separated from the others.
  let data = {"b1": "black", "a2": "black", "b2": "black", "d2": "black", "d3": "black", "b4": "black", "c4": "black", "d4": "black"};

  assert("Not connected response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Black area should be connected"});
}),

test('Wrong groups of white cells around the clue',(suite) => {
  let clues = {"c2": "1_2", "a4": "1"};
  // Extra black cell c1: white cells around c2 are d1 and c3 - two groups of one cell.
  let data = {"b1": "black", "c1": "black", "a2": "black", "b2": "black", "d2": "black", "b3": "black", "d3": "black", "b4": "black", "c4": "black", "d4": "black"};

  assert("Wrong clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["c2"]});
}),

test('Clue 0 without white cells around',(suite) => {
  // Puzzle 2x2: all three cells around the clue in a1 are black.
  //   0 #
  //   # #
  let clues = {"a1": "0"};
  let data = {"b1": "black", "a2": "black", "b2": "black"};

  assert("Clue 0 response").that(Checker.check("2x2", clues, data)).isEqualTo({status: "OK"});
}),

test('Clue 0 with a white cell around',(suite) => {
  // The cell a2 is white, so there is a group of one white cell around the clue.
  //   0 #
  //   . #
  let clues = {"a1": "0"};
  let data = {"b1": "black", "b2": "black"};

  assert("Wrong clue 0 response").that(Checker.check("2x2", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["a1"]});
}),

test('Non-zero clue without white cells around',(suite) => {
  //   1 #
  //   # #
  let clues = {"a1": "1"};
  let data = {"b1": "black", "a2": "black", "b2": "black"};

  assert("Wrong clue 1 response").that(Checker.check("2x2", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["a1"]});
}),

);
