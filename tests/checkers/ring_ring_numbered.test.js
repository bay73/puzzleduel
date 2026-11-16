// Puzzle 5x4 with letters A and B and its solution (# is a black cell, two rectangles cross each other in c2 and c3).
// Same letters belong to the same rectangle, different letters belong to different rectangles:
//   #  #  ┌──A──┐      a1 b1 c1 d1 e1
//   ┌──B──┼──┐  │      a2 b2 c2 d2 e2
//   └─────┼──┘  A      a3 b3 c3 d3 e3
//   #  #  └─────┘      a4 b4 c4 d4 e4
// The rectangles are submitted as the list of connectors: <cell>-h connects the cell with its right neighbour,
// <cell>-v connects the cell with its bottom neighbour.
checkerTestSuite("ring_ring_numbered", "Ring-Ring Numbered",

test('Correct solution',(suite) => {
  let clues = {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "d1": "A", "b2": "B", "e3": "A"};
  let data = {"connectors": {
    "c1-h": "1", "d1-h": "1", "c4-h": "1", "d4-h": "1", "a2-h": "1", "b2-h": "1", "c2-h": "1", "a3-h": "1", "b3-h": "1", "c3-h": "1",
    "c1-v": "1", "e1-v": "1", "c2-v": "1", "e2-v": "1", "c3-v": "1", "e3-v": "1", "a2-v": "1", "d2-v": "1"}};

  assert("Correct solution response").that(Checker.check("5x4-AB", clues, data)).isEqualTo({status: "OK"});
}),

test('Two rectangles pass through the cell with letter',(suite) => {
  // Letter A is placed to c2, where two rectangles cross each other.
  let clues = {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "c2": "A", "b2": "B", "e3": "A"};
  let data = {"connectors": {
    "c1-h": "1", "d1-h": "1", "c4-h": "1", "d4-h": "1", "a2-h": "1", "b2-h": "1", "c2-h": "1", "a3-h": "1", "b3-h": "1", "c3-h": "1",
    "c1-v": "1", "e1-v": "1", "c2-v": "1", "e2-v": "1", "c3-v": "1", "e3-v": "1", "a2-v": "1", "d2-v": "1"}};

  assert("Two rectangles in the cell with letter response").that(Checker.check("5x4-AB", clues, data)).isEqualTo({status: "Only one rectangle should pass through a cell with number", errors: ["c2"]});
}),

test('Different letters at the same rectangle',(suite) => {
  // Letters A in d1 and B in e3 are both at the rectangle c1-e1-e4-c4.
  let clues = {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "d1": "A", "e3": "B"};
  let data = {"connectors": {
    "c1-h": "1", "d1-h": "1", "c4-h": "1", "d4-h": "1", "a2-h": "1", "b2-h": "1", "c2-h": "1", "a3-h": "1", "b3-h": "1", "c3-h": "1",
    "c1-v": "1", "e1-v": "1", "c2-v": "1", "e2-v": "1", "c3-v": "1", "e3-v": "1", "a2-v": "1", "d2-v": "1"}};

  assert("Different letters at the same rectangle response").that(Checker.check("5x4-AB", clues, data)).isEqualTo({status: "One rectangle can't pass through cells with different numbers", errors: ["d1", "e3"]});
}),

test('Same letters at different rectangles',(suite) => {
  // Letter A in d1 is at the rectangle c1-e1-e4-c4, and letter A in b2 is at the rectangle a2-d2-d3-a3.
  let clues = {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "d1": "A", "b2": "A"};
  let data = {"connectors": {
    "c1-h": "1", "d1-h": "1", "c4-h": "1", "d4-h": "1", "a2-h": "1", "b2-h": "1", "c2-h": "1", "a3-h": "1", "b3-h": "1", "c3-h": "1",
    "c1-v": "1", "e1-v": "1", "c2-v": "1", "e2-v": "1", "c3-v": "1", "e3-v": "1", "a2-v": "1", "d2-v": "1"}};

  assert("Same letters at different rectangles response").that(Checker.check("5x4-AB", clues, data)).isEqualTo({status: "All equal numbers should be at the same rectangle", errors: ["b2", "d1"]});
}),

test('Line in black cell',(suite) => {
  let clues = {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "d1": "A", "b2": "B", "e3": "A"};
  // Extra line from a2 goes to the black cell a1.
  let data = {"connectors": {
    "c1-h": "1", "d1-h": "1", "c4-h": "1", "d4-h": "1", "a2-h": "1", "b2-h": "1", "c2-h": "1", "a3-h": "1", "b3-h": "1", "c3-h": "1",
    "c1-v": "1", "e1-v": "1", "c2-v": "1", "e2-v": "1", "c3-v": "1", "e3-v": "1", "a2-v": "1", "d2-v": "1", "a1-v": "1"}};

  assert("Line in black cell response").that(Checker.check("5x4-AB", clues, data)).isEqualTo({status: "Rectangle can't pass through the black cell", errors: ["a1"]});
}),

test('Not all cells are used',(suite) => {
  let clues = {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "d1": "A", "b2": "B", "e3": "A"};
  // The rectangle a2-d2-d3-a3 is missing.
  let data = {"connectors": {
    "c1-h": "1", "d1-h": "1", "c4-h": "1", "d4-h": "1",
    "c1-v": "1", "e1-v": "1", "c2-v": "1", "e2-v": "1", "c3-v": "1", "e3-v": "1"}};

  assert("Not all cells are used response").that(Checker.check("5x4-AB", clues, data)).isEqualTo({status: "Rectangles should pass through all cells", errors: ["a2"]});
}),

test('Loop is not closed',(suite) => {
  let clues = {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "d1": "A", "b2": "B", "e3": "A"};
  // The line between e1 and e2 is missing.
  let data = {"connectors": {
    "c1-h": "1", "d1-h": "1", "c4-h": "1", "d4-h": "1", "a2-h": "1", "b2-h": "1", "c2-h": "1", "a3-h": "1", "b3-h": "1", "c3-h": "1",
    "c1-v": "1", "c2-v": "1", "e2-v": "1", "c3-v": "1", "e3-v": "1", "a2-v": "1", "d2-v": "1"}};

  assert("Loop is not closed response").that(Checker.check("5x4-AB", clues, data)).isEqualTo({status: "Rectangles should be a closed loop", errors: ["e1"]});
}),

test('Rectangles overlap',(suite) => {
  let clues = {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "d1": "A", "b2": "B", "e3": "A"};
  // The second rectangle is a2-c2-c3-a3, its side c2-c3 goes along the side of the first one.
  let data = {"connectors": {
    "c1-h": "1", "d1-h": "1", "c4-h": "1", "d4-h": "1", "a2-h": "1", "b2-h": "1", "a3-h": "1", "b3-h": "1",
    "c1-v": "1", "e1-v": "1", "c2-v": "1", "e2-v": "1", "c3-v": "1", "e3-v": "1", "a2-v": "1"}};

  assert("Rectangles overlap response").that(Checker.check("5x4-AB", clues, data)).isEqualTo({status: "Intersection with overlapping is not allowed", errors: ["c2"]});
}),

test('Loop is not a rectangle',(suite) => {
  // Another puzzle 3x3.
  let clues = {"c1": "black"};
  // The loop a1-b1-b2-c2-c3-a3 has 6 corners.
  let data = {"connectors": {
    "a1-h": "1", "b2-h": "1", "a3-h": "1", "b3-h": "1",
    "a1-v": "1", "b1-v": "1", "a2-v": "1", "c2-v": "1"}};

  assert("Loop is not a rectangle response").that(Checker.check("3x3-AB", clues, data)).isEqualTo({status: "This loop is not a rectangle", errors: ["a1", "b1", "b2", "c2", "c3", "b3", "a3", "a2", "a1"]});
}),

);
