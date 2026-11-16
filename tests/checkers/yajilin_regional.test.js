// Puzzle 4x4 divided into four 2x2 areas and its solution (# is a black cell):
//   #  +--+--+      a1 b1 c1 d1      1 . | 1 .
//      |     |                       . . | . .
//   +--+  #  +      a2 b2 c2 d2      ----+----
//   |        |                       0 . | . .
//   +  +--+  +      a3 b3 c3 d3      . . | . .
//   |  |  |  |
//   +--+  +--+      a4 b4 c4 d4
// Loop connectors: "a1-h" connects a1 with b1, "a1-v" connects a1 with a2.
// All cells which are not visited by the loop are black. The clue is the number of black cells in the area:
// one in the top left area, one in the top right area, none in the bottom left area.
checkerTestSuite("yajilin_regional", "Regional Yajilin",

test('Correct solution',(suite) => {
  let clues = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "c2", "d2"], ["a3", "b3", "a4", "b4"], ["c3", "d3", "c4", "d4"]], "a1": "1", "c1": "1", "a3": "0"};
  let data = {"connectors": {"b1-h": "1", "c1-h": "1", "a2-h": "1", "b3-h": "1", "a4-h": "1", "c4-h": "1", "b1-v": "1", "d1-v": "1", "a2-v": "1", "d2-v": "1", "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "c2", "d2"], ["a3", "b3", "a4", "b4"], ["c3", "d3", "c4", "d4"]], "a1": "1", "c1": "1", "a3": "0"};
  // Nothing is drawn.
  let data = {};

  assert("No loop response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop passing through some cells"});
}),

test('Two loops',(suite) => {
  let clues = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "c2", "d2"], ["a3", "b3", "a4", "b4"], ["c3", "d3", "c4", "d4"]], "a1": "1", "c1": "1", "a3": "0"};
  // Two separate loops: a1-b1-b2-a2 and c3-d3-d4-c4.
  let data = {"connectors": {"a1-h": "1", "a2-h": "1", "c3-h": "1", "c4-h": "1", "a1-v": "1", "b1-v": "1", "c3-v": "1", "d3-v": "1"}};

  assert("Two loops response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop passing through some cells", errors: ["c3"]});
}),

test('Loop is not closed',(suite) => {
  let clues = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "c2", "d2"], ["a3", "b3", "a4", "b4"], ["c3", "d3", "c4", "d4"]], "a1": "1", "c1": "1", "a3": "0"};
  // Connector between d2 and d3 is missing, the line ends in d2.
  let data = {"connectors": {"b1-h": "1", "c1-h": "1", "a2-h": "1", "b3-h": "1", "a4-h": "1", "c4-h": "1", "b1-v": "1", "d1-v": "1", "a2-v": "1", "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1"}};

  assert("Loop is not closed response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["d2"]});
}),

test('Loop with bifurcation',(suite) => {
  let clues = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "c2", "d2"], ["a3", "b3", "a4", "b4"], ["c3", "d3", "c4", "d4"]], "a1": "1", "c1": "1", "a3": "0"};
  // Extra connector between c1 and c2: three lines meet in c1.
  let data = {"connectors": {"b1-h": "1", "c1-h": "1", "a2-h": "1", "b3-h": "1", "a4-h": "1", "c4-h": "1", "b1-v": "1", "c1-v": "1", "d1-v": "1", "a2-v": "1", "d2-v": "1", "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1"}};

  assert("Loop with bifurcation response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["c1"]});
}),

test('Wrong number of black cells in the area',(suite) => {
  let clues = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "c2", "d2"], ["a3", "b3", "a4", "b4"], ["c3", "d3", "c4", "d4"]], "a1": "1", "c1": "1", "a3": "0"};
  // The loop visits all cells, so there are no black cells in the top left area, but the clue requires one.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "b2-h": "1", "a4-h": "1", "c4-h": "1", "a1-v": "1", "d1-v": "1", "a2-v": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1", "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1"}};

  assert("Wrong clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["a1", "b1", "a2", "b2"]});
}),

test('Black cells share an edge',(suite) => {
  let clues = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "c2", "d2"], ["a3", "b3", "a4", "b4"], ["c3", "d3", "c4", "d4"]], "a1": "1", "c1": "1", "a3": "0"};
  // The loop doesn't visit b2 and c2: numbers of black cells in the areas are correct, but the black cells share an edge.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "b3-h": "1", "a4-h": "1", "c4-h": "1", "a1-v": "1", "d1-v": "1", "a2-v": "1", "d2-v": "1", "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1"}};

  assert("Black cells share an edge response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Blackened cells shouldn't sharing an edge", errors: ["b2", "c2"]});
}),

);
