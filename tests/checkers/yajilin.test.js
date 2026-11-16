// Puzzle 4x4 and its solution (C is a clue cell, # is a black cell):
//   +--+--+--+      a1 b1 c1 d1
//   |        |
//   +  C  #  +      a2 b2 c2 d2
//   |        |
//   +  +--+  +      a3 b3 c3 d3
//   |  |  |  |
//   +--+  +--+      a4 b4 c4 d4
// Loop connectors: "a1-h" connects a1 with b1, "a1-v" connects a1 with a2.
// All non-clue cells which are not visited by the loop are black.
// The clue in b2 shows that there is one black cell to the right of it.
checkerTestSuite("yajilin", "Yajilin",

test('Correct solution',(suite) => {
  let clues = {"b2": "r1"};
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "b3-h": "1", "a4-h": "1", "c4-h": "1", "a1-v": "1", "d1-v": "1", "a2-v": "1", "d2-v": "1", "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"b2": "r1"};
  // Nothing is drawn.
  let data = {};

  assert("No loop response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop passing through some cells"});
}),

test('Two loops',(suite) => {
  // Puzzle 5x2 with two separate loops:
  //   +--+  C  +--+
  //   |  |     |  |
  //   +--+  #  +--+
  let clues = {"c1": "d1"};
  // The second loop d1-e1-e2-d2 is not connected to the first one.
  let data = {"connectors": {"a1-h": "1", "a2-h": "1", "d1-h": "1", "d2-h": "1", "a1-v": "1", "b1-v": "1", "d1-v": "1", "e1-v": "1"}};

  assert("Two loops response").that(Checker.check("5x2", clues, data)).isEqualTo({status: "There should be single loop passing through some cells", errors: ["d1"]});
}),

test('Loop is not closed',(suite) => {
  let clues = {"b2": "r1"};
  // Connector between d2 and d3 is missing, the line ends in d2.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "b3-h": "1", "a4-h": "1", "c4-h": "1", "a1-v": "1", "d1-v": "1", "a2-v": "1", "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1"}};

  assert("Loop is not closed response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["d2"]});
}),

test('Loop with bifurcation',(suite) => {
  let clues = {"b2": "r1"};
  // Extra connector between c1 and c2: three lines meet in c1.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "b3-h": "1", "a4-h": "1", "c4-h": "1", "a1-v": "1", "c1-v": "1", "d1-v": "1", "a2-v": "1", "d2-v": "1", "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1"}};

  assert("Loop with bifurcation response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["c1"]});
}),

test('Loop passes through the clue cell',(suite) => {
  let clues = {"b2": "r1"};
  // The loop goes a2-b2-b3 through the clue cell b2.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "a2-h": "1", "a3-h": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1", "a1-v": "1", "d1-v": "1", "b2-v": "1", "d2-v": "1", "a3-v": "1", "d3-v": "1"}};

  assert("Loop passes through the clue cell response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Loop can't pass through the clue cell", errors: ["b2"]});
}),

test('Wrong number of black cells for the clue',(suite) => {
  let clues = {"b2": "r1"};
  // The loop visits c2 and leaves b3 black: there are no black cells to the right of b2, but the clue requires one.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "c2-h": "1", "c3-h": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1", "a1-v": "1", "d1-v": "1", "a2-v": "1", "c2-v": "1", "a3-v": "1", "d3-v": "1"}};

  assert("Wrong clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["b2"]});
}),

test('Black cells share an edge',(suite) => {
  let clues = {"b2": "r1"};
  // The loop doesn't visit c2, c3 and a4: black cells c2 and c3 share an edge.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "a3-h": "1", "b4-h": "1", "c4-h": "1", "a1-v": "1", "d1-v": "1", "a2-v": "1", "d2-v": "1", "b3-v": "1", "d3-v": "1"}};

  assert("Black cells share an edge response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Blackened cells shouldn't sharing an edge", errors: ["c2", "c3"]});
}),

);
