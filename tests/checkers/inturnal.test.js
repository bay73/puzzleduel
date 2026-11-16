// Puzzle 4x4 and its solution. The loop goes through centers of some cells,
// a clue shows how many of four corners of the cell are inside the loop:
//   . . . .      +-----+  .      a1 b1 c1 d1
//   . 4 2 .      |  4  2  .      a2 b2 c2 d2
//   . 3 . .      |  3--+  .      a3 b3 c3 d3
//   1 . . 0      1--+  .  0      a4 b4 c4 d4
// The loop is a1-b1-c1-c2-c3-b3-b4-a4-a3-a2-a1. Five grid nodes are inside it:
// all four corners of b2 and the bottom left corner of b3.
// Connector "a1-h" joins a1 with b1, connector "a1-v" joins a1 with a2.
checkerTestSuite("inturnal", "Inturnal",

test('Correct solution',(suite) => {
  let clues = {"b2": "4", "c2": "2", "b3": "3", "a4": "1", "d4": "0"};
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-v": "1", "c2-v": "1", "b3-h": "1", "b3-v": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"b2": "4", "c2": "2", "b3": "3", "a4": "1", "d4": "0"};
  // Nothing is drawn.
  let data = {};

  assert("No loop response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop passing through some cells"});
}),

test('Loop is not closed',(suite) => {
  let clues = {"b2": "4", "c2": "2", "b3": "3", "a4": "1", "d4": "0"};
  // Connector between c2 and c3 is missing, so the line ends in c2.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-v": "1", "b3-h": "1", "b3-v": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Loop is not closed response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["c2"]});
}),

test('Loop with a branch',(suite) => {
  let clues = {"b2": "4", "c2": "2", "b3": "3", "a4": "1", "d4": "0"};
  // Extra connector between b1 and b2: three lines meet in b1.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "b1-v": "1", "c1-v": "1", "c2-v": "1", "b3-h": "1", "b3-v": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Loop with a branch response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["b1"]});
}),

test('Two loops',(suite) => {
  let clues = {"b2": "4", "c2": "2", "b3": "3", "a4": "1", "d4": "0"};
  // One loop is a1-b1-b2-a2, another one is c3-d3-d4-c4.
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-v": "1", "a2-h": "1", "c3-h": "1", "c3-v": "1", "d3-v": "1", "c4-h": "1"}};

  assert("Two loops response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop passing through some cells", errors: []});
}),

test('Wrong number of corners inside the loop',(suite) => {
  // The loop doesn't go around any corner of d4, but the clue requires one.
  let clues = {"b2": "4", "c2": "2", "b3": "3", "a4": "1", "d4": "1"};
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-v": "1", "c2-v": "1", "b3-h": "1", "b3-v": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Wrong clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["d4"]});
}),

test('Loop misses corners required by the clue',(suite) => {
  let clues = {"b2": "4", "c2": "2", "b3": "2", "a4": "1", "d4": "0"};
  // Clue in b3 is changed to 2 and the loop a1-b1-c1-c2-c3-b3-a3-a2-a1 doesn't go to the last row:
  // two top corners of b3 are inside the loop, but no corners of a4 are.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-v": "1", "c2-v": "1", "b3-h": "1", "a3-h": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Wrong clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["a4"]});
}),

);
