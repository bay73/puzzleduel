// Puzzle 4x4 (g is a grey cell) and its solution (X is a cell inside the loop):
//   . g . .      a1 b1 c1 d1      . X X .
//   g g . .      a2 b2 c2 d2      . X . .
//   . . g .      a3 b3 c3 d3      X X X X
//   . . . .      a4 b4 c4 d4      . . . .
// Number of the loop edges around the cells:
//   1 2 3 1
//   2 2 3 1
//   3 1 2 3
//   1 1 1 1
// Edges are named by the cell and its side: 0 - top, 1 - right, 2 - bottom, 3 - left.
checkerTestSuite("fence_even_odd", "Fence Even Odd",

test('Correct solution',(suite) => {
  let clues = {"b1": "grey", "a2": "grey", "b2": "grey", "c3": "grey"};
  let data = {"edges": {"a1-1": "1", "b1-0": "1", "c1-0": "1", "c1-1": "1", "c1-2": "1", "a2-1": "1", "a2-2": "1", "b2-1": "1", "c2-2": "1", "d2-2": "1",
                        "a3-3": "1", "a3-2": "1", "b3-2": "1", "c3-2": "1", "d3-1": "1", "d3-2": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"b1": "grey", "a2": "grey", "b2": "grey", "c3": "grey"};
  // Nothing is drawn.
  let data = {};

  assert("No loop response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Line is not closed',(suite) => {
  let clues = {"b1": "grey", "a2": "grey", "b2": "grey", "c3": "grey"};
  // The bottom edge of d3 is missing.
  let data = {"edges": {"a1-1": "1", "b1-0": "1", "c1-0": "1", "c1-1": "1", "c1-2": "1", "a2-1": "1", "a2-2": "1", "b2-1": "1", "c2-2": "1", "d2-2": "1",
                        "a3-3": "1", "a3-2": "1", "b3-2": "1", "c3-2": "1", "d3-1": "1"}};

  assert("Not closed response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Loop with a branch',(suite) => {
  let clues = {"b1": "grey", "a2": "grey", "b2": "grey", "c3": "grey"};
  // Extra edge at the bottom of a1 starts from the middle of the loop line.
  let data = {"edges": {"a1-1": "1", "a1-2": "1", "b1-0": "1", "c1-0": "1", "c1-1": "1", "c1-2": "1", "a2-1": "1", "a2-2": "1", "b2-1": "1", "c2-2": "1", "d2-2": "1",
                        "a3-3": "1", "a3-2": "1", "b3-2": "1", "c3-2": "1", "d3-1": "1", "d3-2": "1"}};

  assert("Branch response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Odd number of edges around grey cell',(suite) => {
  // Additional grey cell d4 has only one edge of the loop.
  let clues = {"b1": "grey", "a2": "grey", "b2": "grey", "c3": "grey", "d4": "grey"};
  let data = {"edges": {"a1-1": "1", "b1-0": "1", "c1-0": "1", "c1-1": "1", "c1-2": "1", "a2-1": "1", "a2-2": "1", "b2-1": "1", "c2-2": "1", "d2-2": "1",
                        "a3-3": "1", "a3-2": "1", "b3-2": "1", "c3-2": "1", "d3-1": "1", "d3-2": "1"}};

  assert("Odd grey cell response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["d4"]});
}),

test('Even number of edges around white cell',(suite) => {
  // Cell c3 is white now, but it has two edges of the loop.
  let clues = {"b1": "grey", "a2": "grey", "b2": "grey"};
  let data = {"edges": {"a1-1": "1", "b1-0": "1", "c1-0": "1", "c1-1": "1", "c1-2": "1", "a2-1": "1", "a2-2": "1", "b2-1": "1", "c2-2": "1", "d2-2": "1",
                        "a3-3": "1", "a3-2": "1", "b3-2": "1", "c3-2": "1", "d3-1": "1", "d3-2": "1"}};

  assert("Even white cell response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["c3"]});
}),

);
