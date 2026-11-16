// Puzzle 4x4 (o is a dot between two cells of the same row):
//   .   . o .   .      a1 b1 c1 d1
//   .   . o .   .      a2 b2 c2 d2
//   . o . o . o .      a3 b3 c3 d3
//   . o . o . o .      a4 b4 c4 d4
// Solution (cells with dot between both turn or both go straight):
//   +--+--+--+
//   |  +--+  |
//   |  |  |  |
//   +--+  +--+
checkerTestSuite("russian_loop", "Russian loop",

test('Correct solution',(suite) => {
  let clues = {"edges": {"b1-1": "dot", "b2-1": "dot", "a3-1": "dot", "b3-1": "dot", "c3-1": "dot", "a4-1": "dot", "b4-1": "dot", "c4-1": "dot"}};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "a1-v": "1", "d1-v": "1",
    "a2-v": "1", "b2-h": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1",
    "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1",
    "a4-h": "1", "c4-h": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"edges": {"b1-1": "dot", "b2-1": "dot", "a3-1": "dot", "b3-1": "dot", "c3-1": "dot", "a4-1": "dot", "b4-1": "dot", "c4-1": "dot"}};
  // Nothing is drawn.
  let data = {};

  assert("No loop response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop passing through all cells", errors: ["a1"]});
}),

test('Loop is not closed',(suite) => {
  let clues = {"edges": {"b1-1": "dot", "b2-1": "dot", "a3-1": "dot", "b3-1": "dot", "c3-1": "dot", "a4-1": "dot", "b4-1": "dot", "c4-1": "dot"}};
  // The line between c1 and d1 is missing, so the line has dead end in c1.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "a1-v": "1", "d1-v": "1",
    "a2-v": "1", "b2-h": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1",
    "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1",
    "a4-h": "1", "c4-h": "1"}};

  assert("Not closed loop response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["c1"]});
}),

test('Loop with bifurcation',(suite) => {
  let clues = {"edges": {"b1-1": "dot", "b2-1": "dot", "a3-1": "dot", "b3-1": "dot", "c3-1": "dot", "a4-1": "dot", "b4-1": "dot", "c4-1": "dot"}};
  // Extra line between b1 and b2.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "a1-v": "1", "b1-v": "1", "d1-v": "1",
    "a2-v": "1", "b2-h": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1",
    "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1",
    "a4-h": "1", "c4-h": "1"}};

  assert("Bifurcation response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["b1"]});
}),

test('Loop does not visit all cells',(suite) => {
  let clues = {"edges": {"b1-1": "dot", "b2-1": "dot", "a3-1": "dot", "b3-1": "dot", "c3-1": "dot", "a4-1": "dot", "b4-1": "dot", "c4-1": "dot"}};
  // Small loop a1-b1-b2-a2.
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-v": "1", "a2-h": "1"}};

  assert("Not all cells response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop passing through all cells", errors: ["c1"]});
}),

test('Different cells with dot between',(suite) => {
  let clues = {"edges": {"b1-1": "dot", "b2-1": "dot", "a3-1": "dot", "b3-1": "dot", "c3-1": "dot", "a4-1": "dot", "b4-1": "dot", "c4-1": "dot"}};
  // The loop turns in b2 and goes straight through c2, but there is a dot between them:
  //   +--+--+--+
  //   |  +--+--+
  //   |  +--+--+
  //   +--+--+--+
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "a1-v": "1", "d1-v": "1",
    "a2-v": "1", "b2-h": "1", "c2-h": "1", "b2-v": "1",
    "a3-v": "1", "b3-h": "1", "c3-h": "1", "d3-v": "1",
    "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Different cells with dot response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Cells with dot between should be of the same type", errors: ["b2", "c2"]});
}),

test('Same cells without dot between',(suite) => {
  let clues = {"edges": {"b1-1": "dot", "b2-1": "dot", "a3-1": "dot", "b3-1": "dot", "c3-1": "dot", "a4-1": "dot", "b4-1": "dot", "c4-1": "dot"}};
  // The loop turns both in a1 and b1, but there is no dot between them:
  //   +--+  +--+
  //   |  +--+  |
  //   |  +--+  |
  //   +--+  +--+
  let data = {"connectors": {
    "a1-h": "1", "c1-h": "1", "a1-v": "1", "b1-v": "1", "c1-v": "1", "d1-v": "1",
    "a2-v": "1", "b2-h": "1", "d2-v": "1",
    "a3-v": "1", "b3-h": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1",
    "a4-h": "1", "c4-h": "1"}};

  assert("Same cells without dot response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Cells without dot between should be of different types", errors: ["a1", "b1"]});
}),

);
