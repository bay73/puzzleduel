// Puzzle 4x4 and its solution:
//   8---+---+---+      a1 b1 c1 d1
//   |           |
//   +   +---+---2      a2 b2 c2 d2
//   |   |
//   +   +---+---6      a3 b3 c3 d3
//   |           |
//   +---+---+---+      a4 b4 c4 d4
// Lengths of the loop segments: 4 from a1 to d2, 5 from d2 to d3 and 7 from d3 to a1.
// Connector "a1-h" joins a1 and b1, connector "a1-v" joins a1 and a2.
checkerTestSuite("loop_bounds", "Loop bounds",

test('Correct solution',(suite) => {
  let clues = {"a1": "8", "d2": "2", "d3": "6"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "c2-h": "1", "b2-h": "1", "b2-v": "1", "b3-h": "1",
    "c3-h": "1", "d3-v": "1", "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"a1": "8", "d2": "2", "d3": "6"};
  let data = {};

  assert("No loop response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "There should be single loop passing through all cells", errors: ["a1"]});
}),

test('Loop is not closed',(suite) => {
  let clues = {"a1": "8", "d2": "2", "d3": "6"};
  // No connection between c2 and b2: the line ends in c2.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "c2-h": "1", "b2-v": "1", "b3-h": "1",
    "c3-h": "1", "d3-v": "1", "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Loop is not closed response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "There should be single loop without bifurcations", errors: ["c2"]});
}),

test('Loop with bifurcation',(suite) => {
  let clues = {"a1": "8", "d2": "2", "d3": "6"};
  // Extra line from b1 to b2.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "c2-h": "1", "b2-h": "1", "b2-v": "1", "b3-h": "1",
    "c3-h": "1", "d3-v": "1", "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1",
    "b1-v": "1"}};

  assert("Loop with bifurcation response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "There should be single loop without bifurcations", errors: ["b1"]});
}),

test('Loop does not pass through all cells',(suite) => {
  let clues = {"a1": "8", "d2": "2", "d3": "6"};
  // The loop goes along the border of the grid and misses b2, c2, b3, c3.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "d2-v": "1", "d3-v": "1",
    "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Not all cells response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "There should be single loop passing through all cells", errors: ["b2"]});
}),

test('Segment is too short',(suite) => {
  // Clue in d2 is 4: length of the segment from a1 to d2 is 4, which is not greater than 4.
  let clues = {"a1": "8", "d2": "4", "d3": "6"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "c2-h": "1", "b2-h": "1", "b2-v": "1", "b3-h": "1",
    "c3-h": "1", "d3-v": "1", "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Segment is too short response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "The length of the segment should be strictly between numbers at its ends", errors: ["a1", "d2"]});
}),

test('Segment is too long',(suite) => {
  // Clue in d3 is 5: length of the segment from d2 to d3 is 5, which is not less than 5.
  let clues = {"a1": "8", "d2": "2", "d3": "5"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "c2-h": "1", "b2-h": "1", "b2-v": "1", "b3-h": "1",
    "c3-h": "1", "d3-v": "1", "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Segment is too long response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "The length of the segment should be strictly between numbers at its ends", errors: ["d2", "d3"]});
}),

test('Wrong length of the segment passing through the corner a1',(suite) => {
  // Other clues: lengths of the segments are 3 from b1 to d2, 5 from d2 to d3, 6 from d3 to a2 (all correct),
  // but length of the segment from a2 to b1 is 2, which is less than both 3 and 4.
  let clues = {"b1": "4", "d2": "1", "d3": "7", "a2": "3"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "c2-h": "1", "b2-h": "1", "b2-v": "1", "b3-h": "1",
    "c3-h": "1", "d3-v": "1", "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Wrong segment response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "The length of the segment should be strictly between numbers at its ends", errors: ["a2", "b1"]});
}),

);
