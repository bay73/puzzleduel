// Puzzle 4x4 with two areas (left and right halves) and its solution:
//   . . | . .      a1 b1 c1 d1       +--+--+--+
//   . . | . .      a2 b2 c2 d2       |        |
//   . . | . .      a3 b3 c3 d3       +  +--+--+
//   . . | . .      a4 b4 c4 d4       |  |
//                                    +  +--+--+
//                                    |        |
//                                    +--+--+--+
// The loop is a1-b1-c1-d1-d2-c2-b2-b3-c3-d3-d4-c4-b4-a4-a3-a2-a1.
checkerTestSuite("double_back", "Double Back",

test('Correct solution',(suite) => {
  let clues = {"areas": [["a1","b1","a2","b2","a3","b3","a4","b4"],["c1","d1","c2","d2","c3","d3","c4","d4"]]};
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "a2-v": "1", "b2-h": "1", "b2-v": "1", "c2-h": "1", "a3-v": "1", "b3-h": "1", "c3-h": "1", "d3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"areas": [["a1","b1","a2","b2","a3","b3","a4","b4"],["c1","d1","c2","d2","c3","d3","c4","d4"]]};
  // Nothing is drawn.
  let data = {};

  assert("No loop response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop passing through all cells", errors: ["a1"]});
}),

test('Loop does not use all cells',(suite) => {
  let clues = {"areas": [["a1","b1","a2","b2","a3","b3","a4","b4"],["c1","d1","c2","d2","c3","d3","c4","d4"]]};
  // The loop goes along the border of the grid, the central cells are not used.
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "a2-v": "1", "d2-v": "1", "a3-v": "1", "d3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Unused cells response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop passing through all cells", errors: ["b2"]});
}),

test('Line is not closed',(suite) => {
  let clues = {"areas": [["a1","b1","a2","b2","a3","b3","a4","b4"],["c1","d1","c2","d2","c3","d3","c4","d4"]]};
  // Segment a1-a2 is missing, so the line ends in a2.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "a2-v": "1", "b2-h": "1", "b2-v": "1", "c2-h": "1", "a3-v": "1", "b3-h": "1", "c3-h": "1", "d3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Not closed response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["a2"]});
}),

test('Loop with a branch',(suite) => {
  let clues = {"areas": [["a1","b1","a2","b2","a3","b3","a4","b4"],["c1","d1","c2","d2","c3","d3","c4","d4"]]};
  // Extra segment b1-b2 makes a branch in b1.
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-h": "1", "b1-v": "1", "c1-h": "1", "d1-v": "1", "a2-v": "1", "b2-h": "1", "b2-v": "1", "c2-h": "1", "a3-v": "1", "b3-h": "1", "c3-h": "1", "d3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Branch response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["b1"]});
}),

test('Area visited once',(suite) => {
  let clues = {"areas": [["a1","b1","a2","b2","a3","b3","a4","b4"],["c1","d1","c2","d2","c3","d3","c4","d4"]]};
  // The loop a1-b1-c1-d1-d2-d3-d4-c4-c3-c2-b2-b3-b4-a4-a3-a2-a1 uses all cells,
  // but it enters each of the areas only once.
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "a2-v": "1", "b2-h": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1", "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1", "a4-h": "1", "c4-h": "1"}};

  assert("Area visited once response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Loop should visit the area exactly two times", errors: ["a1", "b1", "a2", "b2", "a3", "b3", "a4", "b4"]});
}),

);
