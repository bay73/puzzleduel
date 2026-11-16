// Puzzle 4x4 (clues show the length of the shortest loop segment in the row or column):
//   . . . .          a1 b1 c1 d1
//   . . . . 1        a2 b2 c2 d2
//   . . . .          a3 b3 c3 d3
//   . . . .          a4 b4 c4 d4
//     2
// Solution:
//   +--+--+--+
//   |  +--+  |
//   |  |  |  |
//   +--+  +--+
checkerTestSuite("shortest_segment", "Shortest segment",

test('Correct solution',(suite) => {
  let clues = {"bottom": [null, "2", null, null], "right": [null, "1", null, null]};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "a1-v": "1", "d1-v": "1",
    "a2-v": "1", "b2-h": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1",
    "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1",
    "a4-h": "1", "c4-h": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"bottom": [null, "2", null, null], "right": [null, "1", null, null]};
  // Nothing is drawn.
  let data = {};

  assert("No loop response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop passing through all cells", errors: ["a1"]});
}),

test('Loop is not closed',(suite) => {
  let clues = {"bottom": [null, "2", null, null], "right": [null, "1", null, null]};
  // The line between c1 and d1 is missing, so the line has dead end in c1.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "a1-v": "1", "d1-v": "1",
    "a2-v": "1", "b2-h": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1",
    "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1",
    "a4-h": "1", "c4-h": "1"}};

  assert("Not closed loop response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["c1"]});
}),

test('Loop with bifurcation',(suite) => {
  let clues = {"bottom": [null, "2", null, null], "right": [null, "1", null, null]};
  // Extra line between b1 and b2.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "a1-v": "1", "b1-v": "1", "d1-v": "1",
    "a2-v": "1", "b2-h": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1",
    "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1",
    "a4-h": "1", "c4-h": "1"}};

  assert("Bifurcation response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["b1"]});
}),

test('Loop does not visit all cells',(suite) => {
  let clues = {"bottom": [null, "2", null, null], "right": [null, "1", null, null]};
  // Small loop a1-b1-b2-a2.
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-v": "1", "a2-h": "1"}};

  assert("Not all cells response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop passing through all cells", errors: ["c1"]});
}),

test('Wrong shortest segment in the row',(suite) => {
  let clues = {"bottom": [null, "2", null, null], "right": [null, "1", null, null]};
  // The only horizontal segment in the second row (b2-d2) has length 2:
  //   +--+--+--+
  //   |  +--+--+
  //   |  +--+--+
  //   +--+--+--+
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "a1-v": "1", "d1-v": "1",
    "a2-v": "1", "b2-h": "1", "c2-h": "1", "b2-v": "1",
    "a3-v": "1", "b3-h": "1", "c3-h": "1", "d3-v": "1",
    "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Wrong row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Wrong length of the shortest segment in the row", errors: ["a2", "b2", "c2", "d2"]});
}),

test('Wrong shortest segment in the column',(suite) => {
  let clues = {"bottom": [null, "2", null, null], "right": [null, "1", null, null]};
  // Vertical segments in the second column (b1-b2 and b3-b4) have length 1:
  //   +--+  +--+
  //   |  +--+  |
  //   |  +--+  |
  //   +--+  +--+
  let data = {"connectors": {
    "a1-h": "1", "c1-h": "1", "a1-v": "1", "b1-v": "1", "c1-v": "1", "d1-v": "1",
    "a2-v": "1", "b2-h": "1", "d2-v": "1",
    "a3-v": "1", "b3-h": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1",
    "a4-h": "1", "c4-h": "1"}};

  assert("Wrong column response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Wrong length of the shortest segment in the column", errors: ["b1", "b2", "b3", "b4"]});
}),

test('Correct column clues in the tall grid',(suite) => {
  // Grid 4x6 (it is taller than wide), vertical segments have length 5 in columns a, d and 4 in columns b, c:
  //   +--+--+--+
  //   |  +--+  |
  //   |  |  |  |
  //   |  |  |  |
  //   |  |  |  |
  //   +--+  +--+
  let clues = {"bottom": ["5", "4", null, null], "right": [null, "1", null, null, null, null]};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "a1-v": "1", "d1-v": "1",
    "a2-v": "1", "b2-h": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1",
    "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1",
    "a4-v": "1", "b4-v": "1", "c4-v": "1", "d4-v": "1",
    "a5-v": "1", "b5-v": "1", "c5-v": "1", "d5-v": "1",
    "a6-h": "1", "c6-h": "1"}};

  assert("Tall grid response").that(Checker.check("4x6", clues, data)).isEqualTo({status: "OK"});
}),

test('Wrong column clue in the tall grid',(suite) => {
  // Grid 4x6 (it is taller than wide), vertical segments have length 5 in columns a, d and 4 in columns b, c:
  //   +--+--+--+
  //   |  +--+  |
  //   |  |  |  |
  //   |  |  |  |
  //   |  |  |  |
  //   +--+  +--+
  // The clue for the column a is 4, but its only segment has length 5.
  let clues = {"bottom": ["4", null, null, null]};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "a1-v": "1", "d1-v": "1",
    "a2-v": "1", "b2-h": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1",
    "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1",
    "a4-v": "1", "b4-v": "1", "c4-v": "1", "d4-v": "1",
    "a5-v": "1", "b5-v": "1", "c5-v": "1", "d5-v": "1",
    "a6-h": "1", "c6-h": "1"}};

  assert("Wrong column in the tall grid response").that(Checker.check("4x6", clues, data)).isEqualTo({status: "Wrong length of the shortest segment in the column", errors: ["a1", "a2", "a3", "a4", "a5", "a6"]});
}),

test('Row without segments',(suite) => {
  // There are no horizontal segments in the third row of the solution, but the clue is 2.
  let clues = {"bottom": [null, "2", null, null], "right": [null, "1", "2", null]};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "a1-v": "1", "d1-v": "1",
    "a2-v": "1", "b2-h": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1",
    "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1",
    "a4-h": "1", "c4-h": "1"}};

  assert("Row without segments response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Wrong length of the shortest segment in the row", errors: ["a3", "b3", "c3", "d3"]});
}),

test('Clue 0 for the row without segments',(suite) => {
  // Clue 0 means that there are no segments in the row.
  let clues = {"bottom": [null, "2", null, null], "right": [null, "1", "0", null]};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "a1-v": "1", "d1-v": "1",
    "a2-v": "1", "b2-h": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1",
    "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1",
    "a4-h": "1", "c4-h": "1"}};

  assert("Clue 0 response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Clue for the column without segments',(suite) => {
  // The loop goes along the border of the 3x2 grid: there are no vertical segments in the column b.
  let clues = {"bottom": [null, "1", null]};
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "a1-v": "1", "c1-v": "1", "a2-h": "1", "b2-h": "1"}};

  assert("Column without segments response").that(Checker.check("3x2", clues, data)).isEqualTo({status: "Wrong length of the shortest segment in the column", errors: ["b1", "b2"]});
}),

);
