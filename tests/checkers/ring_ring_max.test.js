// Puzzle 5x4 and its solution (# is a black cell, two rectangles cross each other in c2 and c3).
// The clues at the bottom and at the right show the length of the longest rectangle side in the column or the row
// (the length is the number of connectors, so the side c1-c4 has length 3):
//   #  #  ┌─────┐   2      a1 b1 c1 d1 e1
//   ┌─────┼──┐  │   3      a2 b2 c2 d2 e2
//   └─────┼──┘  │   3      a3 b3 c3 d3 e3
//   #  #  └─────┘   2      a4 b4 c4 d4 e4
//   1  0  3  1  3
// The rectangles are submitted as the list of connectors: <cell>-h connects the cell with its right neighbour,
// <cell>-v connects the cell with its bottom neighbour.
checkerTestSuite("ring_ring_max", "Ring-Ring Max",

test('Correct solution',(suite) => {
  let clues = {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "bottom": ["1", "0", "3", "1", "3"], "right": ["2", "3", "3", "2"]};
  let data = {"connectors": {
    "c1-h": "1", "d1-h": "1", "c4-h": "1", "d4-h": "1", "a2-h": "1", "b2-h": "1", "c2-h": "1", "a3-h": "1", "b3-h": "1", "c3-h": "1",
    "c1-v": "1", "e1-v": "1", "c2-v": "1", "e2-v": "1", "c3-v": "1", "e3-v": "1", "a2-v": "1", "d2-v": "1"}};

  assert("Correct solution response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Wrong clue for the column',(suite) => {
  // The only vertical side in the column a is a2-a3 of length 1, not 2.
  let clues = {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "bottom": ["2", "0", "3", "1", "3"], "right": ["2", "3", "3", "2"]};
  let data = {"connectors": {
    "c1-h": "1", "d1-h": "1", "c4-h": "1", "d4-h": "1", "a2-h": "1", "b2-h": "1", "c2-h": "1", "a3-h": "1", "b3-h": "1", "c3-h": "1",
    "c1-v": "1", "e1-v": "1", "c2-v": "1", "e2-v": "1", "c3-v": "1", "e3-v": "1", "a2-v": "1", "d2-v": "1"}};

  assert("Wrong column clue response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "Wrong length of the longest line in the column", col: 0, errors: ["a1", "a2", "a3", "a4"]});
}),

test('Wrong clue for the row',(suite) => {
  // The only horizontal side in the row 1 is c1-e1 of length 2, not 3.
  let clues = {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "bottom": ["1", "0", "3", "1", "3"], "right": ["3", "3", "3", "2"]};
  let data = {"connectors": {
    "c1-h": "1", "d1-h": "1", "c4-h": "1", "d4-h": "1", "a2-h": "1", "b2-h": "1", "c2-h": "1", "a3-h": "1", "b3-h": "1", "c3-h": "1",
    "c1-v": "1", "e1-v": "1", "c2-v": "1", "e2-v": "1", "c3-v": "1", "e3-v": "1", "a2-v": "1", "d2-v": "1"}};

  assert("Wrong row clue response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "Wrong length of the longest line in the row", row: 0, errors: ["a1", "b1", "c1", "d1", "e1"]});
}),

test('Line in black cell',(suite) => {
  let clues = {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "bottom": ["1", "0", "3", "1", "3"], "right": ["2", "3", "3", "2"]};
  // Extra line from a2 goes to the black cell a1.
  let data = {"connectors": {
    "c1-h": "1", "d1-h": "1", "c4-h": "1", "d4-h": "1", "a2-h": "1", "b2-h": "1", "c2-h": "1", "a3-h": "1", "b3-h": "1", "c3-h": "1",
    "c1-v": "1", "e1-v": "1", "c2-v": "1", "e2-v": "1", "c3-v": "1", "e3-v": "1", "a2-v": "1", "d2-v": "1", "a1-v": "1"}};

  assert("Line in black cell response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "Rectangle can't pass through the black cell", errors: ["a1"]});
}),

test('Not all cells are used',(suite) => {
  let clues = {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "bottom": ["1", "0", "3", "1", "3"], "right": ["2", "3", "3", "2"]};
  // The rectangle a2-d2-d3-a3 is missing.
  let data = {"connectors": {
    "c1-h": "1", "d1-h": "1", "c4-h": "1", "d4-h": "1",
    "c1-v": "1", "e1-v": "1", "c2-v": "1", "e2-v": "1", "c3-v": "1", "e3-v": "1"}};

  assert("Not all cells are used response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "Rectangles should pass through all cells", errors: ["a2"]});
}),

test('Loop is not closed',(suite) => {
  let clues = {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "bottom": ["1", "0", "3", "1", "3"], "right": ["2", "3", "3", "2"]};
  // The line between e1 and e2 is missing.
  let data = {"connectors": {
    "c1-h": "1", "d1-h": "1", "c4-h": "1", "d4-h": "1", "a2-h": "1", "b2-h": "1", "c2-h": "1", "a3-h": "1", "b3-h": "1", "c3-h": "1",
    "c1-v": "1", "c2-v": "1", "e2-v": "1", "c3-v": "1", "e3-v": "1", "a2-v": "1", "d2-v": "1"}};

  assert("Loop is not closed response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "Rectangles should be a closed loop", errors: ["e1"]});
}),

test('Rectangles overlap',(suite) => {
  let clues = {"a1": "black", "b1": "black", "a4": "black", "b4": "black", "bottom": ["1", "0", "3", "1", "3"], "right": ["2", "3", "3", "2"]};
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
