// Puzzle 4x4 (G is a shaded cell without number) and its solution (# is a shaded cell):
//   1 . . .      # . . .
//   . . 2 .      . . # .
//   . . . .      . # . .
//   . . . G      . . . #
checkerTestSuite("aquapelago", "Aquapelago",

test('Correct solution',(suite) => {
  let clues = {"a1": "1", "c2": "2", "d4": "grey"};
  let data = {"b3": "1"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('White area is not connected',(suite) => {
  let clues = {"a1": "1", "c2": "2", "d4": "grey"};
  // Shaded cells a3 and b4 cut off the corner a4.
  let data = {"a3": "1", "b4": "1"};

  assert("Not connected response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "White area should be connected"});
}),

test('Shaded cells share an edge',(suite) => {
  let clues = {"a1": "1", "c2": "2", "d4": "grey"};
  // Extra shaded cell b1 is next to the clue cell a1.
  let data = {"b3": "1", "b1": "1"};

  assert("Touching cells response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Blackened cells shouldn't sharing an edge", errors: ["a1", "b1"]});
}),

test('White square 2x2',(suite) => {
  let clues = {"a1": "1", "c2": "2", "d4": "grey"};
  // Cell a3 is shaded instead of b3, cells b3-c3-b4-c4 are all white.
  let data = {"a3": "1"};

  assert("Square 2x2 response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "No 2x2 squares are allowed", errors: ["b3", "c3", "b4", "c4"]});
}),

test('Wrong size of the group',(suite) => {
  // The group c2-b3 consists of two cells, but the clue requires three.
  let clues = {"a1": "1", "c2": "3", "d4": "grey"};
  let data = {"b3": "1"};

  assert("Wrong clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["c2", "b3"]});
}),

);
