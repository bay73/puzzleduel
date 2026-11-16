// Puzzle 4x4 with four 2x2 areas (a1-b2 with clue 3, c1-d2 with clue 4, a3-b4 with clue 3
// and c3-d4 without clue) and its solution:
//   +---+---+---+      a1 b1 c1 d1
//   |           |
//   +   +---+---+      a2 b2 c2 d2
//   |   |
//   +   +---+---+      a3 b3 c3 d3
//   |           |
//   +---+---+---+      a4 b4 c4 d4
// The longest parts of the loop inside the areas: a2-a1-b1 (3), c1-d1-d2-c2 (4),
// b4-a4-a3 (3), c3-d3-d4-c4 (4).
// Connector "a1-h" joins a1 and b1, connector "a1-v" joins a1 and a2.
checkerTestSuite("maxi_loop", "Maxi loop",

test('Correct solution',(suite) => {
  let clues = {"areas": [["a1","b1","a2","b2"], ["c1","d1","c2","d2"], ["a3","b3","a4","b4"], ["c3","d3","c4","d4"]],
               "a1": "3", "d2": "4", "a3": "3"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "c2-h": "1", "b2-h": "1", "b2-v": "1", "b3-h": "1",
    "c3-h": "1", "d3-v": "1", "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"areas": [["a1","b1","a2","b2"], ["c1","d1","c2","d2"], ["a3","b3","a4","b4"], ["c3","d3","c4","d4"]],
               "a1": "3", "d2": "4", "a3": "3"};
  let data = {};

  assert("No loop response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "There should be single loop passing through all cells", errors: ["a1"]});
}),

test('Loop is not closed',(suite) => {
  let clues = {"areas": [["a1","b1","a2","b2"], ["c1","d1","c2","d2"], ["a3","b3","a4","b4"], ["c3","d3","c4","d4"]],
               "a1": "3", "d2": "4", "a3": "3"};
  // No connection between c3 and d3: the line ends in c3.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "c2-h": "1", "b2-h": "1", "b2-v": "1", "b3-h": "1",
    "d3-v": "1", "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Loop is not closed response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "There should be single loop without bifurcations", errors: ["c3"]});
}),

test('Loop with bifurcation',(suite) => {
  let clues = {"areas": [["a1","b1","a2","b2"], ["c1","d1","c2","d2"], ["a3","b3","a4","b4"], ["c3","d3","c4","d4"]],
               "a1": "3", "d2": "4", "a3": "3"};
  // Extra line from c1 to c2.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "c2-h": "1", "b2-h": "1", "b2-v": "1", "b3-h": "1",
    "c3-h": "1", "d3-v": "1", "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1",
    "c1-v": "1"}};

  assert("Loop with bifurcation response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "There should be single loop without bifurcations", errors: ["c1"]});
}),

test('Loop does not pass through all cells',(suite) => {
  let clues = {"areas": [["a1","b1","a2","b2"], ["c1","d1","c2","d2"], ["a3","b3","a4","b4"], ["c3","d3","c4","d4"]],
               "a1": "3", "d2": "4", "a3": "3"};
  // The loop goes along the border of the grid and misses b2, c2, b3, c3.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "d2-v": "1", "d3-v": "1",
    "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Not all cells response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "There should be single loop passing through all cells", errors: ["b2"]});
}),

test('Wrong maximal length inside the area',(suite) => {
  let clues = {"areas": [["a1","b1","a2","b2"], ["c1","d1","c2","d2"], ["a3","b3","a4","b4"], ["c3","d3","c4","d4"]],
               "a1": "3", "d2": "4", "a3": "3"};
  // Another loop through all cells: a1-b1-b2-c2-c1-d1-d2-d3-d4-c4-c3-b3-b4-a4-a3-a2.
  // It visits all 4 cells of the top left area in one pass (a2-a1-b1-b2).
  let data = {"connectors": {
    "a1-h": "1", "b1-v": "1", "b2-h": "1", "c1-v": "1", "c1-h": "1", "d1-v": "1", "d2-v": "1", "d3-v": "1",
    "c4-h": "1", "c3-v": "1", "b3-h": "1", "b3-v": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Wrong clue response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "The clue is not correct", errors: ["a1"]});
}),

);
