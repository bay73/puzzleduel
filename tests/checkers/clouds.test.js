// Puzzle 5x5 and its solution (# is a cloud cell), the numbers are the clues outside the grid:
//   # # . . .  2      a1 b1 c1 d1 e1
//   # # . . .         a2 b2 c2 d2 e2
//   . . . . .  0      a3 b3 c3 d3 e3
//   . . # # #         a4 b4 c4 d4 e4
//   . . # # #  3      a5 b5 c5 d5 e5
//   2       2
checkerTestSuite("clouds", "Clouds",

test('Correct solution',(suite) => {
  let clues = {"bottom": ["2", null, null, null, "2"], "right": ["2", null, "0", null, "3"]};
  let data = {"a1": "black", "b1": "black", "a2": "black", "b2": "black",
              "c4": "black", "d4": "black", "e4": "black", "c5": "black", "d5": "black", "e5": "black"};

  assert("Correct solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "OK"});
}),

test('Cloud is not a rectangle',(suite) => {
  let clues = {"bottom": ["2", null, null, null, "2"], "right": ["2", null, "0", null, "3"]};
  // Extra cell c1 makes the first cloud not rectangular.
  let data = {"a1": "black", "b1": "black", "c1": "black", "a2": "black", "b2": "black",
              "c4": "black", "d4": "black", "e4": "black", "c5": "black", "d5": "black", "e5": "black"};

  assert("Not a rectangle response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Black cells should form rectangles", errors: ["a1"]});
}),

test('Cloud is too narrow',(suite) => {
  let clues = {"bottom": ["2", null, null, null, "2"], "right": ["2", null, "0", null, "3"]};
  // The second cloud c5-e5 has height 1.
  let data = {"a1": "black", "b1": "black", "a2": "black", "b2": "black",
              "c5": "black", "d5": "black", "e5": "black"};

  assert("Narrow cloud response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Sides of a rectangle should be at least 2", errors: ["c5"]});
}),

test('Clouds touch diagonally',(suite) => {
  let clues = {"bottom": ["2", null, null, null, "2"], "right": ["2", null, "0", null, "3"]};
  // Clouds a1-b2 and c3-d4 touch by the corner of b2 and c3.
  let data = {"a1": "black", "b1": "black", "a2": "black", "b2": "black",
              "c3": "black", "d3": "black", "c4": "black", "d4": "black"};

  assert("Touching clouds response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Rectangles shouldn't touch", errors: ["c3", "b2"]});
}),

test('Wrong number of cloud cells in column',(suite) => {
  let clues = {"bottom": ["2", null, null, null, "2"], "right": ["2", null, "0", null, "3"]};
  // The second cloud c4-d5 doesn't reach column e, which should contain 2 cells.
  let data = {"a1": "black", "b1": "black", "a2": "black", "b2": "black",
              "c4": "black", "d4": "black", "c5": "black", "d5": "black"};

  assert("Wrong column response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Wrong number of blackened cells in the column", errors: ["e1", "e2", "e3", "e4", "e5"]});
}),

test('Wrong number of cloud cells in row',(suite) => {
  let clues = {"bottom": ["2", null, null, null, "2"], "right": ["2", null, "0", null, "3"]};
  // The second cloud d4-e5 gives correct columns a and e, but the last row has only 2 cells instead of 3.
  let data = {"a1": "black", "b1": "black", "a2": "black", "b2": "black",
              "d4": "black", "e4": "black", "d5": "black", "e5": "black"};

  assert("Wrong row response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Wrong number of blackened cells in the row", errors: ["a5", "b5", "c5", "d5", "e5"]});
}),

);
