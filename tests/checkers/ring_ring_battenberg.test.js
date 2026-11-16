// Puzzle 4x4 and its solution (# is a black cell, two rectangles share a vertex in the marked cell b2):
//   #  ┌─────┐      a1 b1 c1 d1
//   ┌──┼─────┘      a2 b2 c2 d2
//   │  │  ┌──┐      a3 b3 c3 d3
//   └──┘  └──┘      a4 b4 c4 d4
// The rectangles are submitted as the list of connectors: <cell>-h connects the cell with its right neighbour,
// <cell>-v connects the cell with its bottom neighbour.
checkerTestSuite("ring_ring_battenberg", "Ring-Ring Battenberg",

test('Correct solution',(suite) => {
  let clues = {"a1": "black", "b2": "battenberg"};
  let data = {"connectors": {
    "b1-h": "1", "c1-h": "1", "b2-h": "1", "c2-h": "1", "a2-h": "1", "a4-h": "1", "c3-h": "1", "c4-h": "1",
    "b1-v": "1", "d1-v": "1", "a2-v": "1", "a3-v": "1", "b2-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Correct solution with another direction of the shared vertex',(suite) => {
  // Another puzzle: black cell d1, marked cell c2.
  let clues = {"d1": "black", "c2": "battenberg"};
  // Rectangles a1-c1-c2-a2 and c2-d2-d4-c4 share a vertex in c2, the third one is a3-b3-b4-a4.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "a2-h": "1", "b2-h": "1", "c2-h": "1", "c4-h": "1", "a3-h": "1", "a4-h": "1",
    "a1-v": "1", "c1-v": "1", "c2-v": "1", "d2-v": "1", "c3-v": "1", "d3-v": "1", "a3-v": "1", "b3-v": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No shared vertex in marked cell',(suite) => {
  // Another puzzle: black cell d1, marked cell c2.
  let clues = {"d1": "black", "c2": "battenberg"};
  // Rectangles are a1-c1-c2-a2, c3-d3-d4-c4 and a3-b3-b4-a4: only one of them has a vertex in c2.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "a2-h": "1", "b2-h": "1", "c3-h": "1", "c4-h": "1", "a3-h": "1", "a4-h": "1",
    "a1-v": "1", "c1-v": "1", "c3-v": "1", "d3-v": "1", "a3-v": "1", "b3-v": "1"}};

  assert("No shared vertex response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Two rectangles should share a vertex at the marked cell", errors: ["c2"]});
}),

test('Line in black cell',(suite) => {
  let clues = {"a1": "black", "b2": "battenberg"};
  // Extra line from b1 goes to the black cell a1.
  let data = {"connectors": {
    "b1-h": "1", "c1-h": "1", "b2-h": "1", "c2-h": "1", "a2-h": "1", "a4-h": "1", "c3-h": "1", "c4-h": "1", "a1-h": "1",
    "b1-v": "1", "d1-v": "1", "a2-v": "1", "a3-v": "1", "b2-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1"}};

  assert("Line in black cell response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Rectangle can't pass through the black cell", errors: ["a1"]});
}),

test('Not all cells are used',(suite) => {
  let clues = {"a1": "black", "b2": "battenberg"};
  // The rectangle c3-d3-d4-c4 is missing.
  let data = {"connectors": {
    "b1-h": "1", "c1-h": "1", "b2-h": "1", "c2-h": "1", "a2-h": "1", "a4-h": "1",
    "b1-v": "1", "d1-v": "1", "a2-v": "1", "a3-v": "1", "b2-v": "1", "b3-v": "1"}};

  assert("Not all cells are used response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Rectangles should pass through all cells", errors: ["c3"]});
}),

test('Loop is not closed',(suite) => {
  let clues = {"a1": "black", "b2": "battenberg"};
  // The line between d1 and d2 is missing.
  let data = {"connectors": {
    "b1-h": "1", "c1-h": "1", "b2-h": "1", "c2-h": "1", "a2-h": "1", "a4-h": "1", "c3-h": "1", "c4-h": "1",
    "b1-v": "1", "a2-v": "1", "a3-v": "1", "b2-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1"}};

  assert("Loop is not closed response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Rectangles should be a closed loop", errors: ["d1"]});
}),

test('Rectangles overlap',(suite) => {
  let clues = {"a1": "black", "b2": "battenberg"};
  // The third rectangle is c2-d2-d4-c4, its side c2-d2 goes along the side of the first one.
  let data = {"connectors": {
    "b1-h": "1", "c1-h": "1", "b2-h": "1", "c2-h": "1", "a2-h": "1", "a4-h": "1", "c4-h": "1",
    "b1-v": "1", "d1-v": "1", "a2-v": "1", "a3-v": "1", "b2-v": "1", "b3-v": "1", "c2-v": "1", "d2-v": "1", "c3-v": "1", "d3-v": "1"}};

  assert("Rectangles overlap response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Intersection with overlapping is not allowed", errors: ["c2"]});
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
