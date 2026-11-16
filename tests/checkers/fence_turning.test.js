// Puzzle 4x4 and its solution (cells marked with x are inside the loop).
// A clue shows how many times the loop turns in the corners of the cell:
//   . x 1 .      a1 b1 c1 d1
//   2 x x .      a2 b2 c2 d2
//   x 3 . .      a3 b3 c3 d3
//   . . . 0      a4 b4 c4 d4
// Inner cells are b1, c1, b2, c2, a3, b3.
// The loop has 8 turns: at the top left corner of b1, at the top right corner of c1,
// at three corners of c3 (all except the bottom right one) and at all four corners of a3.
// Edge "c2-1" is the right side of c2: 0 - top, 1 - right, 2 - bottom, 3 - left.
checkerTestSuite("fence_turning", "Turning fences",

test('Correct solution',(suite) => {
  let clues = {"c1": "1", "a2": "2", "b3": "3", "d4": "0"};
  let data = {"edges": {"a1-1": "1", "b1-0": "1", "c1-0": "1", "c1-1": "1", "a2-1": "1", "a2-2": "1", "c2-1": "1", "c2-2": "1", "a3-2": "1", "a3-3": "1", "b3-1": "1", "b3-2": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"c1": "1", "a2": "2", "b3": "3", "d4": "0"};
  // Nothing is drawn.
  let data = {};

  assert("No loop response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Loop is not closed',(suite) => {
  let clues = {"c1": "1", "a2": "2", "b3": "3", "d4": "0"};
  // The bottom side of b3 is missing.
  let data = {"edges": {"a1-1": "1", "b1-0": "1", "c1-0": "1", "c1-1": "1", "a2-1": "1", "a2-2": "1", "c2-1": "1", "c2-2": "1", "a3-2": "1", "a3-3": "1", "b3-1": "1"}};

  assert("Loop is not closed response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Loop with a branch',(suite) => {
  let clues = {"c1": "1", "a2": "2", "b3": "3", "d4": "0"};
  // Extra segment at the bottom side of c3 sticks out of the loop.
  let data = {"edges": {"a1-1": "1", "b1-0": "1", "c1-0": "1", "c1-1": "1", "a2-1": "1", "a2-2": "1", "c2-1": "1", "c2-2": "1", "a3-2": "1", "a3-3": "1", "b3-1": "1", "b3-2": "1", "c3-2": "1"}};

  assert("Loop with a branch response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Two loops',(suite) => {
  let clues = {"c1": "1", "a2": "2", "b3": "3", "d4": "0"};
  // The second loop goes around d4.
  let data = {"edges": {"a1-1": "1", "b1-0": "1", "c1-0": "1", "c1-1": "1", "a2-1": "1", "a2-2": "1", "c2-1": "1", "c2-2": "1", "a3-2": "1", "a3-3": "1", "b3-1": "1", "b3-2": "1", "d3-2": "1", "c4-1": "1", "d4-1": "1", "d4-2": "1"}};

  assert("Two loops response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Wrong number of turns around the clue',(suite) => {
  let clues = {"c1": "1", "a2": "2", "b3": "3", "d4": "0"};
  // The loop goes around the square b1-c1-b2-c2. It turns only once in the corners of a2 (bottom right one).
  let data = {"edges": {"a1-1": "1", "b1-0": "1", "c1-0": "1", "c1-1": "1", "a2-1": "1", "b2-2": "1", "c2-1": "1", "c2-2": "1"}};

  assert("Wrong clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["a2"]});
}),

);
