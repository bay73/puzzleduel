// Puzzle 4x4 and its solution (B - black circle, W - white circle):
//   . B . .      +--B--+--+
//   . W . W      +  W--+  W
//   . . . .      +  +  +  +
//   . . B .      +--+  B--+
// The loop: a1 b1 c1 d1 d2 d3 d4 c4 c3 c2 b2 b3 b4 a4 a3 a2 (a1).
checkerTestSuite("alternate_loop", "Alternate loop",

test('Correct solution',(suite) => {
  let clues = {"b1": "black_circle", "d2": "white_circle", "c4": "black_circle", "b2": "white_circle"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "d2-v": "1", "d3-v": "1", "c4-h": "1", "c3-v": "1",
    "c2-v": "1", "b2-h": "1", "b2-v": "1", "b3-v": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"b1": "black_circle", "d2": "white_circle", "c4": "black_circle", "b2": "white_circle"};
  // Nothing is drawn.
  let data = {};

  assert("No loop response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop passing through all cells", errors: ["a1"]});
}),

test('Loop with bifurcation',(suite) => {
  let clues = {"b1": "black_circle", "d2": "white_circle", "c4": "black_circle", "b2": "white_circle"};
  // Extra line between b1 and b2: three lines go from b1.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "d2-v": "1", "d3-v": "1", "c4-h": "1", "c3-v": "1",
    "c2-v": "1", "b2-h": "1", "b2-v": "1", "b3-v": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1",
    "b1-v": "1"}};

  assert("Bifurcation response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["b1"]});
}),

test('Loop is not closed',(suite) => {
  let clues = {"b1": "black_circle", "d2": "white_circle", "c4": "black_circle", "b2": "white_circle"};
  // No line between d2 and d3: the line ends in d2.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "d3-v": "1", "c4-h": "1", "c3-v": "1",
    "c2-v": "1", "b2-h": "1", "b2-v": "1", "b3-v": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Not closed loop response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations", errors: ["d2"]});
}),

test('Loop does not pass through all cells',(suite) => {
  let clues = {"b1": "black_circle", "d2": "white_circle", "c4": "black_circle", "b2": "white_circle"};
  // Small loop a1-b1-b2-a2, the first not visited cell is c1.
  let data = {"connectors": {"a1-h": "1", "b1-v": "1", "a2-h": "1", "a1-v": "1"}};

  assert("Not all cells response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop passing through all cells", errors: ["c1"]});
}),

test('Circles do not alternate',(suite) => {
  // Circle in d2 is black, and it follows black circle in b1 along the loop.
  let clues = {"b1": "black_circle", "d2": "black_circle", "c4": "white_circle", "b2": "white_circle"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "d2-v": "1", "d3-v": "1", "c4-h": "1", "c3-v": "1",
    "c2-v": "1", "b2-h": "1", "b2-v": "1", "b3-v": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Not alternating circles response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The circles along the line should alternate the color", errors: ["d2"]});
}),

);
