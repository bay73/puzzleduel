// Puzzle 5x4 and its solution (# is a black cell, two rectangles cross each other in c2 and c3).
// The clues are placed at the nodes between 4 cells and show the number of rectangles around the node:
//   #  #  ┌─────┐      a1 b1 c1 d1 e1
//     0        1
//   ┌─────┼──┐  │      a2 b2 c2 d2 e2
//     1        2
//   └─────┼──┘  │      a3 b3 c3 d3 e3
//
//   #  #  └─────┘      a4 b4 c4 d4 e4
// The clue <cell>-2 is placed at the bottom right corner of the cell.
// The rectangles are submitted as the list of connectors: <cell>-h connects the cell with its right neighbour,
// <cell>-v connects the cell with its bottom neighbour.
checkerTestSuite("ring_ring_nested", "Ring-Ring Nested",

test('Correct solution',(suite) => {
  let clues = {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "nodes": {"a1-2": "0", "c1-2": "1", "a2-2": "1", "c2-2": "2"}};
  let data = {"connectors": {
    "c1-h": "1", "d1-h": "1", "c4-h": "1", "d4-h": "1", "a2-h": "1", "b2-h": "1", "c2-h": "1", "a3-h": "1", "b3-h": "1", "c3-h": "1",
    "c1-v": "1", "e1-v": "1", "c2-v": "1", "e2-v": "1", "c3-v": "1", "e3-v": "1", "a2-v": "1", "d2-v": "1"}};

  assert("Correct solution response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Wrong clue',(suite) => {
  // The node between c2 and d3 is inside of both rectangles, but the clue is 1.
  let clues = {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "nodes": {"a1-2": "0", "c1-2": "1", "a2-2": "1", "c2-2": "1"}};
  let data = {"connectors": {
    "c1-h": "1", "d1-h": "1", "c4-h": "1", "d4-h": "1", "a2-h": "1", "b2-h": "1", "c2-h": "1", "a3-h": "1", "b3-h": "1", "c3-h": "1",
    "c1-v": "1", "e1-v": "1", "c2-v": "1", "e2-v": "1", "c3-v": "1", "e3-v": "1", "a2-v": "1", "d2-v": "1"}};

  assert("Wrong clue response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["c2", "d2", "c3", "d3"]});
}),

test('Line in black cell',(suite) => {
  let clues = {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "nodes": {"a1-2": "0", "c1-2": "1", "a2-2": "1", "c2-2": "2"}};
  // Extra line from a2 goes to the black cell a1.
  let data = {"connectors": {
    "c1-h": "1", "d1-h": "1", "c4-h": "1", "d4-h": "1", "a2-h": "1", "b2-h": "1", "c2-h": "1", "a3-h": "1", "b3-h": "1", "c3-h": "1",
    "c1-v": "1", "e1-v": "1", "c2-v": "1", "e2-v": "1", "c3-v": "1", "e3-v": "1", "a2-v": "1", "d2-v": "1", "a1-v": "1"}};

  assert("Line in black cell response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "Rectangle can't pass through the black cell", errors: ["a1"]});
}),

test('Not all cells are used',(suite) => {
  let clues = {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "nodes": {"a1-2": "0", "c1-2": "1", "a2-2": "1", "c2-2": "2"}};
  // The rectangle a2-d2-d3-a3 is missing.
  let data = {"connectors": {
    "c1-h": "1", "d1-h": "1", "c4-h": "1", "d4-h": "1",
    "c1-v": "1", "e1-v": "1", "c2-v": "1", "e2-v": "1", "c3-v": "1", "e3-v": "1"}};

  assert("Not all cells are used response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "Rectangles should pass through all cells", errors: ["a2"]});
}),

test('Loop is not closed',(suite) => {
  let clues = {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "nodes": {"a1-2": "0", "c1-2": "1", "a2-2": "1", "c2-2": "2"}};
  // The line between e1 and e2 is missing.
  let data = {"connectors": {
    "c1-h": "1", "d1-h": "1", "c4-h": "1", "d4-h": "1", "a2-h": "1", "b2-h": "1", "c2-h": "1", "a3-h": "1", "b3-h": "1", "c3-h": "1",
    "c1-v": "1", "c2-v": "1", "e2-v": "1", "c3-v": "1", "e3-v": "1", "a2-v": "1", "d2-v": "1"}};

  assert("Loop is not closed response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "Rectangles should be a closed loop", errors: ["e1"]});
}),

test('Rectangles overlap',(suite) => {
  let clues = {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "nodes": {"a1-2": "0", "c1-2": "1", "a2-2": "1", "c2-2": "2"}};
  // The second rectangle is a2-c2-c3-a3, its side c2-c3 goes along the side of the first one.
  let data = {"connectors": {
    "c1-h": "1", "d1-h": "1", "c4-h": "1", "d4-h": "1", "a2-h": "1", "b2-h": "1", "a3-h": "1", "b3-h": "1",
    "c1-v": "1", "e1-v": "1", "c2-v": "1", "e2-v": "1", "c3-v": "1", "e3-v": "1", "a2-v": "1"}};

  assert("Rectangles overlap response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "Intersection with overlapping is not allowed", errors: ["c2"]});
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
