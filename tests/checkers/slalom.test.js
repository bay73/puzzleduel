// Puzzle 3x3 (clues are in the nodes of the grid) and its solution:
//   +---+---+---0      \ / \      a1 b1 c1
//   |   |   |   |
//   +---3---+---+      \ \ \      a2 b2 c2
//   |   |   |   |
//   +---3---+---+      / \ \      a3 b3 c3
//   |   |   |   |
//   1---+---+---+
// The clue "a1-2" is at the bottom right corner of a1, "c1-1" is at the top right corner of c1,
// "a3-3" is at the bottom left corner of a3.
checkerTestSuite("slalom", "Slalom",

test('Correct solution',(suite) => {
  let clues = {"nodes": {"a1-2": "3", "a2-2": "3", "c1-1": "0", "a3-3": "1"}};
  let data = {"a1": "\\", "b1": "/", "c1": "\\",
              "a2": "\\", "b2": "\\", "c2": "\\",
              "a3": "/", "b3": "\\", "c3": "\\"};

  assert("Correct solution response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "OK"});
}),

test('Empty cell',(suite) => {
  let clues = {"nodes": {"a1-2": "3", "a2-2": "3", "c1-1": "0", "a3-3": "1"}};
  // No line in c3.
  let data = {"a1": "\\", "b1": "/", "c1": "\\",
              "a2": "\\", "b2": "\\", "c2": "\\",
              "a3": "/", "b3": "\\"};

  assert("Empty cell response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "All cells should be filled", errors: ["c3"]});
}),

test('Wrong number of lines at the clue',(suite) => {
  let clues = {"nodes": {"a1-2": "3", "a2-2": "3", "c1-1": "0", "a3-3": "1"}};
  // The line in b2 is flipped, so only two lines touch the clue between a1, b1, a2 and b2.
  let data = {"a1": "\\", "b1": "/", "c1": "\\",
              "a2": "\\", "b2": "/", "c2": "\\",
              "a3": "/", "b3": "\\", "c3": "\\"};

  assert("Wrong clue response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["a1", "a2", "b1", "b2"]});
}),

test('Lines form a loop',(suite) => {
  let clues = {"nodes": {"a1-2": "3", "a2-2": "3", "c1-1": "0", "a3-3": "1"}};
  // The line in c2 is flipped, so lines in b1, c1, b2 and c2 form a loop.
  let data = {"a1": "\\", "b1": "/", "c1": "\\",
              "a2": "\\", "b2": "\\", "c2": "/",
              "a3": "/", "b3": "\\", "c3": "\\"};

  assert("Loop response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "Diagonal lines shouldn't form a loop", errors: ["b1", "b2", "c1", "c2"]});
}),

);
