// Puzzle 4x4 with two areas (top and bottom halves, g is a grey cell) and its solution:
//   . . . .      a1 b1 c1 d1       +--+  +--+
//   . . . .      a2 b2 c2 d2       |  |  |  |
//   -------                        +  +--+  +
//   . g g .      a3 b3 c3 d3       |        |
//   . . . .      a4 b4 c4 d4       +  .  .  +
//                                  |        |
//                                  +--+--+--+
// The loop is a1-b1-b2-c2-c1-d1-d2-d3-d4-c4-b4-a4-a3-a2-a1.
// It uses all (white) cells of the top area and all white cells of the bottom area.
checkerTestSuite("expressway", "Expressway",

test('Correct solution',(suite) => {
  let clues = {"b3": "grey", "c3": "grey", "areas": [["a1","b1","c1","d1","a2","b2","c2","d2"],["a3","b3","c3","d3","a4","b4","c4","d4"]]};
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-v": "1", "c1-h": "1", "c1-v": "1", "d1-v": "1", "a2-v": "1", "b2-h": "1", "d2-v": "1", "a3-v": "1", "d3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"b3": "grey", "c3": "grey", "areas": [["a1","b1","c1","d1","a2","b2","c2","d2"],["a3","b3","c3","d3","a4","b4","c4","d4"]]};
  // Nothing is drawn.
  let data = {};

  assert("No loop response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop passing through some cells"});
}),

test('Line is not closed',(suite) => {
  let clues = {"b3": "grey", "c3": "grey", "areas": [["a1","b1","c1","d1","a2","b2","c2","d2"],["a3","b3","c3","d3","a4","b4","c4","d4"]]};
  // Segment a2-a3 is missing, so the line going from a1 to the right ends in a3.
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-v": "1", "c1-h": "1", "c1-v": "1", "d1-v": "1", "b2-h": "1", "d2-v": "1", "a3-v": "1", "d3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Not closed response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["a3"]});
}),

test('Loop uses cells of both colours in area',(suite) => {
  let clues = {"b3": "grey", "c3": "grey", "areas": [["a1","b1","c1","d1","a2","b2","c2","d2"],["a3","b3","c3","d3","a4","b4","c4","d4"]]};
  // The loop a1-b1-c1-d1-d2-c2-b2-b3-c3-d3-d4-c4-b4-a4-a3-a2-a1 uses all cells of the grid,
  // i.e. both white and grey cells of the bottom area.
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "a2-v": "1", "b2-h": "1", "b2-v": "1", "c2-h": "1", "a3-v": "1", "b3-h": "1", "c3-h": "1", "d3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Both colours response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Line should pass only through the cells of one colour", errors: ["a3", "b3", "c3", "d3", "a4", "b4", "c4", "d4"]});
}),

test('Loop does not visit area',(suite) => {
  let clues = {"b3": "grey", "c3": "grey", "areas": [["a1","b1","c1","d1","a2","b2","c2","d2"],["a3","b3","c3","d3","a4","b4","c4","d4"]]};
  // The loop a1-b1-c1-d1-d2-c2-b2-a2-a1 uses all cells of the top area and doesn't visit the bottom area.
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "a2-h": "1", "b2-h": "1", "c2-h": "1"}};

  assert("Not visited area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be a single loop passing through all areas", errors: ["a3", "b3", "c3", "d3", "a4", "b4", "c4", "d4"]});
}),

test('Loop does not use all cells of one colour',(suite) => {
  let clues = {"b3": "grey", "c3": "grey", "areas": [["a1","b1","c1","d1","a2","b2","c2","d2"],["a3","b3","c3","d3","a4","b4","c4","d4"]]};
  // The loop goes along the border of the grid, white cells b2 and c2 of the top area are not used.
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "a2-v": "1", "d2-v": "1", "a3-v": "1", "d3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Not all cells response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All cells of one colour should be used", errors: ["a1", "b1", "c1", "d1", "a2", "b2", "c2", "d2"]});
}),

);
