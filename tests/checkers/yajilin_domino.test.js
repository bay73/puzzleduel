// Puzzle 4x4 and its solution (C and G are clue cells, # is a black cell):
//   +--+--+--+      a1 b1 c1 d1
//   |        |
//   +  C  G  +      a2 b2 c2 d2
//   |        |
//   +  #  #  +      a3 b3 c3 d3
//   |        |
//   +--+--+--+      a4 b4 c4 d4
// Loop connectors: "a1-h" connects a1 with b1, "a1-v" connects a1 with a2.
// All non-clue cells which are not visited by the loop are black, they should form dominoes.
// The clue in b2 shows that there is one black cell below it, c2 is a grey cell without a clue.
checkerTestSuite("yajilin_domino", "Yajilin Domino",

test('Correct solution',(suite) => {
  let clues = {"b2": "d1", "c2": "grey"};
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1", "a1-v": "1", "d1-v": "1", "a2-v": "1", "d2-v": "1", "a3-v": "1", "d3-v": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"b2": "d1", "c2": "grey"};
  // Nothing is drawn.
  let data = {};

  assert("No loop response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop passing through some cells"});
}),

test('Two loops',(suite) => {
  // Puzzle 5x2 without clues with two separate loops:
  //   +--+  #  +--+
  //   |  |     |  |
  //   +--+  #  +--+
  let clues = {};
  // The second loop d1-e1-e2-d2 is not connected to the first one.
  let data = {"connectors": {"a1-h": "1", "a2-h": "1", "d1-h": "1", "d2-h": "1", "a1-v": "1", "b1-v": "1", "d1-v": "1", "e1-v": "1"}};

  assert("Two loops response").that(Checker.check("5x2", clues, data)).isEqualTo({status: "There should be single loop passing through some cells", errors: ["d1"]});
}),

test('Loop is not closed',(suite) => {
  let clues = {"b2": "d1", "c2": "grey"};
  // Connector between d2 and d3 is missing, the line ends in d2.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1", "a1-v": "1", "d1-v": "1", "a2-v": "1", "a3-v": "1", "d3-v": "1"}};

  assert("Loop is not closed response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["d2"]});
}),

test('Loop with bifurcation',(suite) => {
  let clues = {"b2": "d1", "c2": "grey"};
  // Extra connector between b4 and b3: three lines meet in b4.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1", "a1-v": "1", "d1-v": "1", "a2-v": "1", "d2-v": "1", "a3-v": "1", "b3-v": "1", "d3-v": "1"}};

  assert("Loop with bifurcation response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["b4"]});
}),

test('Loop passes through the clue cell',(suite) => {
  let clues = {"b2": "d1", "c2": "grey"};
  // The loop goes a2-b2-b3 through the clue cell b2.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "a2-h": "1", "a3-h": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1", "a1-v": "1", "d1-v": "1", "b2-v": "1", "d2-v": "1", "a3-v": "1", "d3-v": "1"}};

  assert("Loop passes through the clue cell response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Loop can't pass through the clue cell", errors: ["b2"]});
}),

test('Wrong number of black cells for the clue',(suite) => {
  let clues = {"b2": "d1", "c2": "grey"};
  // The loop visits b3 and c3, so there are no black cells below b2, but the clue requires one.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "b3-h": "1", "a4-h": "1", "c4-h": "1", "a1-v": "1", "d1-v": "1", "a2-v": "1", "d2-v": "1", "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1"}};

  assert("Wrong clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["b2"]});
}),

test('Single black cell',(suite) => {
  // Only b2 is a clue cell (one black cell to the right of it).
  let clues = {"b2": "r1"};
  // The loop visits all cells except c2: black cell c2 has no black neighbour to form a domino.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "b3-h": "1", "a4-h": "1", "c4-h": "1", "a1-v": "1", "d1-v": "1", "a2-v": "1", "d2-v": "1", "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1"}};

  assert("Single black cell response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Shaded cells should form a domino", errors: ["c2"]});
}),

test('Three black cells together',(suite) => {
  // Only b2 is a clue cell (one black cell below it).
  let clues = {"b2": "d1"};
  // The loop goes around the grid: black cells c2, b3 and c3 form a tromino, c3 has two black neighbours.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1", "a1-v": "1", "d1-v": "1", "a2-v": "1", "d2-v": "1", "a3-v": "1", "d3-v": "1"}};

  assert("Three black cells response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Shaded cells should form a domino", errors: ["b3", "c2", "c3"]});
}),

);
