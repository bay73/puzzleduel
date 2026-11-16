// Puzzle 4x4 (O is a circle) and its solution:
//   O . . .      a1 b1 c1 d1       O--+--+--+
//   . . . O      a2 b2 c2 d2       |        |
//   . O . .      a3 b3 c3 d3       +  +--+--O
//   . . . O      a4 b4 c4 d4       |  |
//                                  +  O--+--+
//                                  |        |
//                                  +--+--+--O
// The loop is a1-b1-c1-d1-d2-c2-b2-b3-c3-d3-d4-c4-b4-a4-a3-a2-a1.
// It turns in a1, d1, d2, b2, b3, d3, d4, a4, every second of these cells has a circle.
checkerTestSuite("every_second_turn", "Every Second Turn",

test('Correct solution',(suite) => {
  let clues = {"a1": "white_circle", "d2": "white_circle", "b3": "white_circle", "d4": "white_circle"};
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "a2-v": "1", "b2-h": "1", "b2-v": "1", "c2-h": "1", "a3-v": "1", "b3-h": "1", "c3-h": "1", "d3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"a1": "white_circle", "d2": "white_circle", "b3": "white_circle", "d4": "white_circle"};
  // Nothing is drawn.
  let data = {};

  assert("No loop response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop passing through all cells", errors: ["a1"]});
}),

test('Loop does not use all cells',(suite) => {
  let clues = {"a1": "white_circle", "d2": "white_circle", "b3": "white_circle", "d4": "white_circle"};
  // The loop goes along the border of the grid, the central cells are not used.
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "a2-v": "1", "d2-v": "1", "a3-v": "1", "d3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Unused cells response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop passing through all cells", errors: ["b2"]});
}),

test('Line is not closed',(suite) => {
  let clues = {"a1": "white_circle", "d2": "white_circle", "b3": "white_circle", "d4": "white_circle"};
  // Segment a1-a2 is missing, so the line ends in a2.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "a2-v": "1", "b2-h": "1", "b2-v": "1", "c2-h": "1", "a3-v": "1", "b3-h": "1", "c3-h": "1", "d3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Not closed response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["a2"]});
}),

test('Loop goes straight through circle',(suite) => {
  let clues = {"a1": "white_circle", "d2": "white_circle", "b3": "white_circle", "d4": "white_circle"};
  // The loop a1-b1-c1-d1-d2-d3-d4-c4-c3-c2-b2-b3-b4-a4-a3-a2-a1 goes straight through the circle in d2.
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "a2-v": "1", "b2-h": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1", "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1", "a4-h": "1", "c4-h": "1"}};

  assert("Straight through circle response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The line should have turn at every circle", errors: ["d2"]});
}),

test('Two consecutive turns without circle',(suite) => {
  let clues = {"a1": "white_circle", "d2": "white_circle", "b3": "white_circle", "d4": "white_circle"};
  // The loop a1-b1-b2-b3-c3-c2-c1-d1-d2-d3-d4-c4-b4-a4-a3-a2-a1 turns in a1 (circle), b1, b3 (circle), c3, c1, ...
  // Turn in c1 follows the turn in c3, both are without circle.
  let data = {"connectors": {"a1-h": "1", "a1-v": "1", "b1-v": "1", "c1-h": "1", "c1-v": "1", "d1-v": "1", "a2-v": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1", "a3-v": "1", "b3-h": "1", "d3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Consecutive turns response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Every second turn of the line should be makred", errors: ["c1"]});
}),

);
