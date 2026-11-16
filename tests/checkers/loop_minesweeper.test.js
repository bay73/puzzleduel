// Puzzle 4x4 and its solution:
//   +---+---+   2      a1 b1 c1 d1
//   |       |
//   +   7   +   4      a2 b2 c2 d2
//   |       |
//   +   .   +---+      a3 b3 c3 d3
//   |           |
//   +---+---+---+      a4 b4 c4 d4
// Connector "a1-h" joins a1 and b1, connector "a1-v" joins a1 and a2.
checkerTestSuite("loop_minesweeper", "Loop minesweeper",

test('Correct solution',(suite) => {
  let clues = {"d1": "2", "b2": "7", "d2": "4"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-v": "1", "c2-v": "1", "c3-h": "1", "d3-v": "1",
    "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"d1": "2", "b2": "7", "d2": "4"};
  let data = {};

  assert("No loop response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "There should be single loop passing through some cells"});
}),

test('Loop is not closed',(suite) => {
  let clues = {"d1": "2", "b2": "7", "d2": "4"};
  // No connection between c2 and c3: the line ends in c2.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-v": "1", "c3-h": "1", "d3-v": "1",
    "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Loop is not closed response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "There should be single loop without bifurcations", errors: ["c2"]});
}),

test('Loop with bifurcation',(suite) => {
  let clues = {"d1": "2", "b2": "7", "d2": "4"};
  // Extra line from c3 to c4.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-v": "1", "c2-v": "1", "c3-h": "1", "d3-v": "1",
    "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1", "c3-v": "1"}};

  assert("Loop with bifurcation response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "There should be single loop without bifurcations", errors: ["c3"]});
}),

test('Loop passes through the cell with digit',(suite) => {
  let clues = {"d1": "2", "b2": "7", "d2": "4"};
  // The loop goes c1-d1-d2-c2 instead of c1-c2.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "c2-h": "1", "c2-v": "1", "c3-h": "1", "d3-v": "1",
    "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Loop passes through digit response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "Loop can't pass through the cell with digit", errors: ["d1"]});
}),

test('Wrong number of loop cells around the clue',(suite) => {
  let clues = {"d1": "2", "b2": "7", "d2": "4"};
  // The loop goes c3-c4 and doesn't visit d3 and d4: only 3 cells around d2 are visited.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-v": "1", "c2-v": "1", "c3-v": "1",
    "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Wrong clue response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "The clue is not correct", errors: ["d2"]});
}),

);
