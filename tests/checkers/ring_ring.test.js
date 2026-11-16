// Puzzle 4x4 and its solution (# is a black cell, two rectangles cross each other in b2 and c3):
//   #  ┌─────┐      a1 b1 c1 d1
//   ┌──┼──┐  │      a2 b2 c2 d2
//   │  └──┼──┘      a3 b3 c3 d3
//   └─────┘  #      a4 b4 c4 d4
// The rectangles are submitted as the list of connectors: <cell>-h connects the cell with its right neighbour,
// <cell>-v connects the cell with its bottom neighbour.
checkerTestSuite("ring_ring", "Ring-Ring",

test('Correct solution',(suite) => {
  let clues = {"a1": "black", "d4": "black"};
  let data = {"connectors": {
    "b1-h": "1", "c1-h": "1", "b3-h": "1", "c3-h": "1", "a2-h": "1", "b2-h": "1", "a4-h": "1", "b4-h": "1",
    "b1-v": "1", "d1-v": "1", "b2-v": "1", "d2-v": "1", "a2-v": "1", "c2-v": "1", "a3-v": "1", "c3-v": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Line in black cell',(suite) => {
  let clues = {"a1": "black", "d4": "black"};
  // Extra line from a2 goes to the black cell a1.
  let data = {"connectors": {
    "b1-h": "1", "c1-h": "1", "b3-h": "1", "c3-h": "1", "a2-h": "1", "b2-h": "1", "a4-h": "1", "b4-h": "1",
    "b1-v": "1", "d1-v": "1", "b2-v": "1", "d2-v": "1", "a2-v": "1", "c2-v": "1", "a3-v": "1", "c3-v": "1", "a1-v": "1"}};

  assert("Line in black cell response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Rectangle can't pass through the black cell", errors: ["a1"]});
}),

test('Not all cells are used',(suite) => {
  let clues = {"a1": "black", "d4": "black"};
  // The rectangle a2-c2-c4-a4 is missing.
  let data = {"connectors": {
    "b1-h": "1", "c1-h": "1", "b3-h": "1", "c3-h": "1",
    "b1-v": "1", "d1-v": "1", "b2-v": "1", "d2-v": "1"}};

  assert("Not all cells are used response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Rectangles should pass through all cells", errors: ["a2"]});
}),

test('Loop is not closed',(suite) => {
  let clues = {"a1": "black", "d4": "black"};
  // The line between d1 and d2 is missing.
  let data = {"connectors": {
    "b1-h": "1", "c1-h": "1", "b3-h": "1", "c3-h": "1", "a2-h": "1", "b2-h": "1", "a4-h": "1", "b4-h": "1",
    "b1-v": "1", "b2-v": "1", "d2-v": "1", "a2-v": "1", "c2-v": "1", "a3-v": "1", "c3-v": "1"}};

  assert("Loop is not closed response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Rectangles should be a closed loop", errors: ["d1"]});
}),

test('Rectangles overlap',(suite) => {
  let clues = {"a1": "black", "d4": "black"};
  // The second rectangle is a2-b2-b4-a4, its side b2-b4 goes along the side of the first one.
  let data = {"connectors": {
    "b1-h": "1", "c1-h": "1", "b3-h": "1", "c3-h": "1", "a2-h": "1", "a4-h": "1",
    "b1-v": "1", "d1-v": "1", "b2-v": "1", "d2-v": "1", "a2-v": "1", "a3-v": "1", "b2-v": "1", "b3-v": "1"}};

  assert("Rectangles overlap response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Intersection with overlapping is not allowed", errors: ["b2"]});
}),

test('Loop is not a rectangle',(suite) => {
  // Another puzzle 3x3.
  let clues = {"c1": "black"};
  // The loop a1-b1-b2-c2-c3-a3 has 6 corners.
  let data = {"connectors": {
    "a1-h": "1", "b2-h": "1", "a3-h": "1", "b3-h": "1",
    "a1-v": "1", "b1-v": "1", "a2-v": "1", "c2-v": "1"}};

  assert("Loop is not a rectangle response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "This loop is not a rectangle", errors: ["a1", "b1", "b2", "c2", "c3", "b3", "a3", "a2", "a1"]});
}),

);
