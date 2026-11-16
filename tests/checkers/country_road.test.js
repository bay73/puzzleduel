// Puzzle 4x4 with four 2x2 areas and its solution:
//   3 . | . .      a1 b1 c1 d1       +--+--+  .
//   . . | . .      a2 b2 c2 d2       |     |
//   ----+----                        +  .  +--+
//   . . | 3 .      a3 b3 c3 d3       |        |
//   . . | . .      a4 b4 c4 d4       +--+  .  +
//                                       |     |
//                                    .  +--+--+
// The loop is a1-b1-c1-c2-d2-d3-d4-c4-b4-b3-a3-a2-a1, cells d1, b2, c3 and a4 are not used.
checkerTestSuite("country_road", "Country Road",

test('Correct solution',(suite) => {
  let clues = {"a1": "3", "c3": "3", "areas": [["a1","b1","a2","b2"],["c1","d1","c2","d2"],["c3","d3","c4","d4"],["a3","b3","a4","b4"]]};
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-h": "1", "c1-v": "1", "a2-v": "1", "c2-h": "1", "d2-v": "1", "a3-h": "1", "b3-v": "1", "d3-v": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"a1": "3", "c3": "3", "areas": [["a1","b1","a2","b2"],["c1","d1","c2","d2"],["c3","d3","c4","d4"],["a3","b3","a4","b4"]]};
  // Nothing is drawn.
  let data = {};

  assert("No loop response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop passing through some cells"});
}),

test('Loop with a branch',(suite) => {
  let clues = {"a1": "3", "c3": "3", "areas": [["a1","b1","a2","b2"],["c1","d1","c2","d2"],["c3","d3","c4","d4"],["a3","b3","a4","b4"]]};
  // Extra segment b1-b2 makes a branch in b1.
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-h": "1", "b1-v": "1", "c1-v": "1", "a2-v": "1", "c2-h": "1", "d2-v": "1", "a3-h": "1", "b3-v": "1", "d3-v": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Branch response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["b1"]});
}),

test('Line is not closed',(suite) => {
  let clues = {"a1": "3", "c3": "3", "areas": [["a1","b1","a2","b2"],["c1","d1","c2","d2"],["c3","d3","c4","d4"],["a3","b3","a4","b4"]]};
  // Segment a2-a3 is missing, so the line going from a1 to the right ends in a3.
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-h": "1", "c1-v": "1", "c2-h": "1", "d2-v": "1", "a3-h": "1", "b3-v": "1", "d3-v": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Not closed response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["a3"]});
}),

test('Unused neighbouring cells in different areas',(suite) => {
  let clues = {"a1": "3", "c3": "3", "areas": [["a1","b1","a2","b2"],["c1","d1","c2","d2"],["c3","d3","c4","d4"],["a3","b3","a4","b4"]]};
  // The loop goes c1-d1-d2 instead of c1-c2-d2. Cells b2 and c2 are both unused and belong to different areas.
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "a2-v": "1", "d2-v": "1", "a3-h": "1", "b3-v": "1", "d3-v": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Unused neighbours response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Two neigbouring cells in different areas can't both be unused by the loop", errors: ["c2", "b2"]});
}),

test('Area visited twice',(suite) => {
  let clues = {"a1": "3", "c3": "3", "areas": [["a1","b1","a2","b2"],["c1","d1","c2","d2"],["c3","d3","c4","d4"],["a3","b3","a4","b4"]]};
  // The loop a1-b1-c1-d1-d2-c2-b2-b3-c3-d3-d4-c4-b4-a4-a3-a2-a1 uses all cells.
  // It leaves the top left area after b1 and returns to it in b2.
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "a2-v": "1", "b2-h": "1", "b2-v": "1", "c2-h": "1", "a3-v": "1", "b3-h": "1", "c3-h": "1", "d3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Area visited twice response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Loop should visit the area exactly one time", errors: ["a1", "b1", "a2", "b2"]});
}),

test('Wrong number of used cells in area',(suite) => {
  let clues = {"a1": "3", "c3": "3", "areas": [["a1","b1","a2","b2"],["c1","d1","c2","d2"],["c3","d3","c4","d4"],["a3","b3","a4","b4"]]};
  // The loop goes c4-c3-b3 instead of c4-b4-b3, so it uses 4 cells in the area with clue 3 in c3.
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-h": "1", "c1-v": "1", "a2-v": "1", "c2-h": "1", "d2-v": "1", "a3-h": "1", "b3-h": "1", "c3-v": "1", "d3-v": "1", "c4-h": "1"}};

  assert("Wrong clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["c3"]});
}),

);
