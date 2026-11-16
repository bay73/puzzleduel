// Puzzle 4x4 and its solution:
//   1 . . .      +--+--+--+      a1 b1 c1 d1
//   . . 2 .      +--+--+--+      a2 b2 c2 d2
//   . 3 . .      +--+--+--+      a3 b3 c3 d3
//   4 . . .      +--+--+--+      a4 b4 c4 d4
// The path is a1-d1-d2-a2-a3-d3-d4-a4.
checkerTestSuite("sequential_path", "Sequential path",

test('Correct solution',(suite) => {
  let clues = {"a1": "1", "c2": "2", "b3": "3", "a4": "4"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1",
    "a2-h": "1", "b2-h": "1", "c2-h": "1", "a2-v": "1",
    "a3-h": "1", "b3-h": "1", "c3-h": "1", "d3-v": "1",
    "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Numbers are visited in wrong order',(suite) => {
  let clues = {"a1": "1", "c2": "2", "b3": "3", "a4": "4"};
  // The path a1-a4-b4-b1-c1-c4-d4-d1 visits 4 in a4 just after 1.
  let data = {"connectors": {
    "a1-v": "1", "b1-v": "1", "c1-v": "1", "d1-v": "1", "b1-h": "1",
    "a2-v": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1",
    "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1",
    "a4-h": "1", "c4-h": "1"}};

  assert("Wrong order response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The line should pass numbered cells in order", errors: ["a4"]});
}),

test('Line with bifurcation',(suite) => {
  let clues = {"a1": "1", "c2": "2", "b3": "3", "a4": "4"};
  // Extra line between b1 and b2.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "b1-v": "1",
    "a2-h": "1", "b2-h": "1", "c2-h": "1", "a2-v": "1",
    "a3-h": "1", "b3-h": "1", "c3-h": "1", "d3-v": "1",
    "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Bifurcation response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single line without bifurcations", errors: ["b1"]});
}),

test('Line does not visit all cells',(suite) => {
  let clues = {"a1": "1", "c2": "2", "b3": "3", "a4": "4"};
  // The line ends in b4 and doesn't reach a4.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1",
    "a2-h": "1", "b2-h": "1", "c2-h": "1", "a2-v": "1",
    "a3-h": "1", "b3-h": "1", "c3-h": "1", "d3-v": "1",
    "b4-h": "1", "c4-h": "1"}};

  assert("Not all cells response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Lines should pass through all cells", errors: ["a4"]});
}),

);
