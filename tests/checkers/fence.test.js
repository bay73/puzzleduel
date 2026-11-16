// Puzzle 4x4 and its solution (X is a cell inside the loop):
//   3 . . 0      a1 b1 c1 d1      X X . .
//   3 1 2 .      a2 b2 c2 d2      . X X .
//   . . 2 .      a3 b3 c3 d3      X X X .
//   . 1 . .      a4 b4 c4 d4      . . . .
// Edges are named by the cell and its side: 0 - top, 1 - right, 2 - bottom, 3 - left.
checkerTestSuite("fence", "Fence",

test('Correct solution',(suite) => {
  let clues = {"a1": "3", "d1": "0", "a2": "3", "b2": "1", "c2": "2", "c3": "2", "b4": "1"};
  let data = {"edges": {"a1-0": "1", "a1-3": "1", "a1-2": "1", "b1-0": "1", "b1-1": "1", "c1-2": "1", "a2-1": "1", "a2-2": "1", "c2-1": "1",
                        "a3-3": "1", "a3-2": "1", "b3-2": "1", "c3-1": "1", "c3-2": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"a1": "3", "d1": "0", "a2": "3", "b2": "1", "c2": "2", "c3": "2", "b4": "1"};
  // Nothing is drawn.
  let data = {};

  assert("No loop response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Line is not closed',(suite) => {
  let clues = {"a1": "3", "d1": "0", "a2": "3", "b2": "1", "c2": "2", "c3": "2", "b4": "1"};
  // The bottom edge of c3 is missing.
  let data = {"edges": {"a1-0": "1", "a1-3": "1", "a1-2": "1", "b1-0": "1", "b1-1": "1", "c1-2": "1", "a2-1": "1", "a2-2": "1", "c2-1": "1",
                        "a3-3": "1", "a3-2": "1", "b3-2": "1", "c3-1": "1"}};

  assert("Not closed response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Loop with a branch',(suite) => {
  let clues = {"a1": "3", "d1": "0", "a2": "3", "b2": "1", "c2": "2", "c3": "2", "b4": "1"};
  // Extra edge at the bottom of d3 starts from the corner of the loop.
  let data = {"edges": {"a1-0": "1", "a1-3": "1", "a1-2": "1", "b1-0": "1", "b1-1": "1", "c1-2": "1", "a2-1": "1", "a2-2": "1", "c2-1": "1",
                        "a3-3": "1", "a3-2": "1", "b3-2": "1", "c3-1": "1", "c3-2": "1", "d3-2": "1"}};

  assert("Branch response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Two loops',(suite) => {
  let clues = {"a1": "3", "d1": "0", "a2": "3", "b2": "1", "c2": "2", "c3": "2", "b4": "1"};
  // One loop around a1 and another loop around d4.
  let data = {"edges": {"a1-0": "1", "a1-3": "1", "a1-1": "1", "a1-2": "1", "d3-2": "1", "c4-1": "1", "d4-1": "1", "d4-2": "1"}};

  assert("Two loops response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Wrong number of edges around the clue',(suite) => {
  let clues = {"a1": "3", "d1": "0", "a2": "3", "b2": "1", "c2": "2", "c3": "2", "b4": "1"};
  // Cell c3 is left outside the loop, so there are 3 edges around c2.
  //   X X . .
  //   . X X .
  //   X X . .
  //   . . . .
  let data = {"edges": {"a1-0": "1", "a1-3": "1", "a1-2": "1", "b1-0": "1", "b1-1": "1", "c1-2": "1", "a2-1": "1", "a2-2": "1", "c2-1": "1", "c2-2": "1",
                        "a3-3": "1", "a3-2": "1", "b3-1": "1", "b3-2": "1"}};

  assert("Wrong clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["c2"]});
}),

);
