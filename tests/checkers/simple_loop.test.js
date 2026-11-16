// Puzzle 4x4 and its solution (# is a black cell):
//   # # . .      #  #  +--+      a1 b1 c1 d1
//   . . . .      +--+  |  |      a2 b2 c2 d2
//   . . . .      |  +--+  |      a3 b3 c3 d3
//   . . . .      +--+--+--+      a4 b4 c4 d4
checkerTestSuite("simple_loop", "Simple loop",

test('Correct solution',(suite) => {
  let clues = {"a1": "black", "b1": "black"};
  let data = {"connectors": {
    "c1-h": "1", "c1-v": "1", "d1-v": "1",
    "a2-h": "1", "a2-v": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1",
    "a3-v": "1", "b3-h": "1", "d3-v": "1",
    "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"a1": "black", "b1": "black"};
  // Nothing is drawn.
  let data = {};

  assert("No loop response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop passing through all cells"});
}),

test('Loop is not closed',(suite) => {
  let clues = {"a1": "black", "b1": "black"};
  // The line between c1 and c2 is missing, so the line has dead end in c2.
  let data = {"connectors": {
    "c1-h": "1", "d1-v": "1",
    "a2-h": "1", "a2-v": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1",
    "a3-v": "1", "b3-h": "1", "d3-v": "1",
    "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Not closed loop response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["c2"]});
}),

test('Loop with bifurcation',(suite) => {
  let clues = {"a1": "black", "b1": "black"};
  // Extra line between b2 and c2.
  let data = {"connectors": {
    "c1-h": "1", "c1-v": "1", "d1-v": "1",
    "a2-h": "1", "b2-h": "1", "a2-v": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1",
    "a3-v": "1", "b3-h": "1", "d3-v": "1",
    "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Bifurcation response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["b2"]});
}),

test('Loop does not visit all white cells',(suite) => {
  let clues = {"a1": "black", "b1": "black"};
  // Small loop c1-d1-d2-c2.
  let data = {"connectors": {"c1-h": "1", "c1-v": "1", "d1-v": "1", "c2-h": "1"}};

  assert("Not all cells response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop passing through all white cells", errors: ["a2"]});
}),

test('Loop passes through the black cell',(suite) => {
  let clues = {"a1": "black", "b1": "black"};
  // The loop visits all cells of the grid including black ones:
  //   +--+--+--+
  //   |  +--+  |
  //   |  |  |  |
  //   +--+  +--+
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "a1-v": "1", "d1-v": "1",
    "a2-v": "1", "b2-h": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1",
    "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1",
    "a4-h": "1", "c4-h": "1"}};

  assert("Black cell response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Loop can't pass through the black cell", errors: ["a1"]});
}),

);
