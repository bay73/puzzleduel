// Puzzle 4x4 and its solution (cells marked with x are inside the loop).
// Every clue differs by one from the real number of loop segments around the cell:
//   2 x x .      a1 b1 c1 d1
//   . 0 3 .      a2 b2 c2 d2
//   2 x . 1      a3 b3 c3 d3
//   . 0 . .      a4 b4 c4 d4
// Inner cells are b1, c1, b2, c2, a3, b3.
// Real numbers of loop segments around the cells with clues: a1 - 1, b2 - 1, c2 - 2, a3 - 3, d3 - 0, b4 - 1.
// Edge "c2-1" is the right side of c2: 0 - top, 1 - right, 2 - bottom, 3 - left.
checkerTestSuite("fence_knapp_daneben", "Knapp daneben fences",

test('Correct solution',(suite) => {
  let clues = {"a1": "2", "b2": "0", "c2": "3", "a3": "2", "d3": "1", "b4": "0"};
  let data = {"edges": {"a1-1": "1", "b1-0": "1", "c1-0": "1", "c1-1": "1", "a2-1": "1", "a2-2": "1", "c2-1": "1", "c2-2": "1", "a3-2": "1", "a3-3": "1", "b3-1": "1", "b3-2": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"a1": "2", "b2": "0", "c2": "3", "a3": "2", "d3": "1", "b4": "0"};
  // Nothing is drawn.
  let data = {};

  assert("No loop response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Loop is not closed',(suite) => {
  let clues = {"a1": "2", "b2": "0", "c2": "3", "a3": "2", "d3": "1", "b4": "0"};
  // The bottom side of b3 is missing.
  let data = {"edges": {"a1-1": "1", "b1-0": "1", "c1-0": "1", "c1-1": "1", "a2-1": "1", "a2-2": "1", "c2-1": "1", "c2-2": "1", "a3-2": "1", "a3-3": "1", "b3-1": "1"}};

  assert("Loop is not closed response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Loop with a branch',(suite) => {
  let clues = {"a1": "2", "b2": "0", "c2": "3", "a3": "2", "d3": "1", "b4": "0"};
  // Extra segment at the bottom side of c3 sticks out of the loop.
  let data = {"edges": {"a1-1": "1", "b1-0": "1", "c1-0": "1", "c1-1": "1", "a2-1": "1", "a2-2": "1", "c2-1": "1", "c2-2": "1", "a3-2": "1", "a3-3": "1", "b3-1": "1", "b3-2": "1", "c3-2": "1"}};

  assert("Loop with a branch response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Two loops',(suite) => {
  let clues = {"a1": "2", "b2": "0", "c2": "3", "a3": "2", "d3": "1", "b4": "0"};
  // The second loop goes around d4.
  let data = {"edges": {"a1-1": "1", "b1-0": "1", "c1-0": "1", "c1-1": "1", "a2-1": "1", "a2-2": "1", "c2-1": "1", "c2-2": "1", "a3-2": "1", "a3-3": "1", "b3-1": "1", "b3-2": "1", "d3-2": "1", "c4-1": "1", "d4-1": "1", "d4-2": "1"}};

  assert("Two loops response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Clue is equal to the real number',(suite) => {
  // There is exactly one loop segment around b2, but the clue should differ by one from the real number.
  let clues = {"a1": "2", "b2": "1", "c2": "3", "a3": "2", "d3": "1", "b4": "0"};
  let data = {"edges": {"a1-1": "1", "b1-0": "1", "c1-0": "1", "c1-1": "1", "a2-1": "1", "a2-2": "1", "c2-1": "1", "c2-2": "1", "a3-2": "1", "a3-3": "1", "b3-1": "1", "b3-2": "1"}};

  assert("Exact clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["b2"]});
}),

test('Clue differs by more than one',(suite) => {
  // There are no loop segments around d3, so the clue 2 differs by two.
  let clues = {"a1": "2", "b2": "0", "c2": "3", "a3": "2", "d3": "2", "b4": "0"};
  let data = {"edges": {"a1-1": "1", "b1-0": "1", "c1-0": "1", "c1-1": "1", "a2-1": "1", "a2-2": "1", "c2-1": "1", "c2-2": "1", "a3-2": "1", "a3-3": "1", "b3-1": "1", "b3-2": "1"}};

  assert("Wrong clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["d3"]});
}),

);
