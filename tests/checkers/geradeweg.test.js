// Puzzle 4x4 and its solution. The loop passes through all cells with numbers,
// a number shows the length of the straight loop segments passing through the cell:
//   . 2 2 .      +--2--2  .      a1 b1 c1 d1
//   . . . .      |  .  |  .      a2 b2 c2 d2
//   3 1 . .      3  1--+  .      a3 b3 c3 d3
//   . . . .      +--+  .  .      a4 b4 c4 d4
// Connector "a1-h" joins a1 with b1, connector "a1-v" joins a1 with a2.
checkerTestSuite("geradeweg", "Geradeweg",

test('Correct solution',(suite) => {
  let clues = {"b1": "2", "c1": "2", "a3": "3", "b3": "1"};
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-v": "1", "c2-v": "1", "b3-h": "1", "b3-v": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"b1": "2", "c1": "2", "a3": "3", "b3": "1"};
  // Nothing is drawn.
  let data = {};

  assert("No loop response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Loop should pass through all cells with numbers"});
}),

test('Loop is not closed',(suite) => {
  let clues = {"b1": "2", "c1": "2", "a3": "3", "b3": "1"};
  // Connector between c2 and c3 is missing, so the line ends in c2.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-v": "1", "b3-h": "1", "b3-v": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Loop is not closed response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["c2"]});
}),

test('Loop with a branch',(suite) => {
  let clues = {"b1": "2", "c1": "2", "a3": "3", "b3": "1"};
  // Extra connector between b1 and b2: three lines meet in b1.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "b1-v": "1", "c1-v": "1", "c2-v": "1", "b3-h": "1", "b3-v": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Loop with a branch response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["b1"]});
}),

test('Two loops',(suite) => {
  let clues = {"b1": "2", "c1": "2", "a3": "3", "b3": "1"};
  // One loop is a1-b1-b2-a2, another one is c3-d3-d4-c4.
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-v": "1", "a2-h": "1", "c3-h": "1", "c3-v": "1", "d3-v": "1", "c4-h": "1"}};

  assert("Two loops response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop", errors: ["c3"]});
}),

test('Loop misses a cell with a number',(suite) => {
  let clues = {"b1": "2", "c1": "2", "a3": "3", "b3": "1"};
  // Loop a2-b2-b3-a3 doesn't pass through b1.
  let data = {"connectors": {"a2-h": "1", "a2-v": "1", "b2-v": "1", "a3-h": "1"}};

  assert("Missed clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Loop should pass through all cells with numbers", errors: ["b1"]});
}),

test('Wrong length of a straight segment',(suite) => {
  let clues = {"b1": "2", "c1": "2", "a3": "3", "b3": "1"};
  // The loop goes along the grid border, so the segment passing through b1 has length 3.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "d2-v": "1", "d3-v": "1", "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Wrong straight segment response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Segment passing through the clue should have the indicated length", errors: ["b1"]});
}),

test('Wrong length of a segment after turn',(suite) => {
  let clues = {"b1": "2", "c1": "2", "a3": "3", "b3": "1"};
  // Loop a1-b1-c1-c2-b2-a2 turns in c1: the segment to the left has length 2, but the segment going down has length 1.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-v": "1", "b2-h": "1", "a2-h": "1", "a1-v": "1"}};

  assert("Wrong turn segment response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Segment passing through the clue should have the indicated length", errors: ["c1"]});
}),

);
