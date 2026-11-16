// Puzzle 5x4 (# is a black cell, B is a black circle, W is a white circle):
//   B . . # #      a1 b1 c1 d1 e1
//   . . . . .      a2 b2 c2 d2 e2
//   . . . # .      a3 b3 c3 d3 e3
//   # . . . W      a4 b4 c4 d4 e4
// Solution: square a1-c3 and rectangle b2-e4, which cross each other in c2 and b3:
//   +--+--+  #  #
//   |  +--+--+--+
//   +--+--+  #  |
//   #  +--+--+--+
checkerTestSuite("ring_ring_square_rectangle", "Ring-ring (squares and rectangles)",

test('Correct solution',(suite) => {
  let clues = {"a1": "black_circle", "d1": "black", "e1": "black", "d3": "black", "a4": "black", "e4": "white_circle"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "a1-v": "1", "c1-v": "1", "a2-v": "1", "c2-v": "1", "a3-h": "1", "b3-h": "1",
    "b2-h": "1", "c2-h": "1", "d2-h": "1", "b2-v": "1", "e2-v": "1", "b3-v": "1", "e3-v": "1", "b4-h": "1", "c4-h": "1", "d4-h": "1"}};

  assert("Correct solution response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Rectangle passes through the black cell',(suite) => {
  // Cell b1 is black, but the side of the square a1-c3 goes through it.
  let clues = {"a1": "black_circle", "b1": "black", "d1": "black", "e1": "black", "d3": "black", "a4": "black", "e4": "white_circle"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "a1-v": "1", "c1-v": "1", "a2-v": "1", "c2-v": "1", "a3-h": "1", "b3-h": "1",
    "b2-h": "1", "c2-h": "1", "d2-h": "1", "b2-v": "1", "e2-v": "1", "b3-v": "1", "e3-v": "1", "b4-h": "1", "c4-h": "1", "d4-h": "1"}};

  assert("Black cell response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "Rectangle can't pass through the black cell", errors: ["b1"]});
}),

test('Rectangles cross at a circle',(suite) => {
  // The circle in c2 is at the crossing of two rectangles.
  let clues = {"a1": "black_circle", "d1": "black", "e1": "black", "c2": "white_circle", "d3": "black", "a4": "black", "e4": "white_circle"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "a1-v": "1", "c1-v": "1", "a2-v": "1", "c2-v": "1", "a3-h": "1", "b3-h": "1",
    "b2-h": "1", "c2-h": "1", "d2-h": "1", "b2-v": "1", "e2-v": "1", "b3-v": "1", "e3-v": "1", "b4-h": "1", "c4-h": "1", "d4-h": "1"}};

  assert("Crossing at circle response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "Two rectangles can't cross at a circle", errors: ["c2"]});
}),

test('Circle is not at a corner',(suite) => {
  // The circle in b1 is in the middle of the side of the square a1-c3.
  let clues = {"a1": "black_circle", "b1": "black_circle", "d1": "black", "e1": "black", "d3": "black", "a4": "black", "e4": "white_circle"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "a1-v": "1", "c1-v": "1", "a2-v": "1", "c2-v": "1", "a3-h": "1", "b3-h": "1",
    "b2-h": "1", "c2-h": "1", "d2-h": "1", "b2-v": "1", "e2-v": "1", "b3-v": "1", "e3-v": "1", "b4-h": "1", "c4-h": "1", "d4-h": "1"}};

  assert("Circle not at corner response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "Circle should be at a corner of the rectangle", errors: ["b1"]});
}),

test('Cell is not visited',(suite) => {
  // Cell d3 is not black here and no rectangle passes through it.
  let clues = {"a1": "black_circle", "d1": "black", "e1": "black", "a4": "black", "e4": "white_circle"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "a1-v": "1", "c1-v": "1", "a2-v": "1", "c2-v": "1", "a3-h": "1", "b3-h": "1",
    "b2-h": "1", "c2-h": "1", "d2-h": "1", "b2-v": "1", "e2-v": "1", "b3-v": "1", "e3-v": "1", "b4-h": "1", "c4-h": "1", "d4-h": "1"}};

  assert("Not visited cell response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "Rectangles should pass through all cells", errors: ["d3"]});
}),

test('Rectangle is not closed',(suite) => {
  let clues = {"a1": "black_circle", "d1": "black", "e1": "black", "d3": "black", "a4": "black", "e4": "white_circle"};
  // The line between b4 and c4 is missing.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "a1-v": "1", "c1-v": "1", "a2-v": "1", "c2-v": "1", "a3-h": "1", "b3-h": "1",
    "b2-h": "1", "c2-h": "1", "d2-h": "1", "b2-v": "1", "e2-v": "1", "b3-v": "1", "e3-v": "1", "c4-h": "1", "d4-h": "1"}};

  assert("Not closed response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "Rectangles should be a closed loop", errors: ["b4"]});
}),

test('Lines overlap',(suite) => {
  // Cell d3 is not black here.
  let clues = {"a1": "black_circle", "d1": "black", "e1": "black", "a4": "black", "e4": "white_circle"};
  // Extra line from d2 to d3 makes a T-junction in d2.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "a1-v": "1", "c1-v": "1", "a2-v": "1", "c2-v": "1", "a3-h": "1", "b3-h": "1",
    "b2-h": "1", "c2-h": "1", "d2-h": "1", "b2-v": "1", "e2-v": "1", "b3-v": "1", "e3-v": "1", "b4-h": "1", "c4-h": "1", "d4-h": "1",
    "d2-v": "1"}};

  assert("Overlapping response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "Intersection with overlapping is not allowed", errors: ["d2"]});
}),

test('Loop is not a rectangle',(suite) => {
  // Grid 4x4 without clues. The single loop visits all cells, but it has 8 corners:
  //   +--+--+--+
  //   |  +--+  |
  //   |  |  |  |
  //   +--+  +--+
  let clues = {};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "a1-v": "1", "d1-v": "1",
    "a2-v": "1", "b2-h": "1", "b2-v": "1", "c2-v": "1", "d2-v": "1",
    "a3-v": "1", "b3-v": "1", "c3-v": "1", "d3-v": "1",
    "a4-h": "1", "c4-h": "1"}};

  assert("Not a rectangle response").that(Checker.check("4x4", clues, data)).isEqualTo({
    status: "This loop is not a rectangle",
    errors: ["a1", "b1", "c1", "d1", "d2", "d3", "d4", "c4", "c3", "c2", "b2", "b3", "b4", "a4", "a3", "a2", "a1"]});
}),

test('Circles of different colors on one rectangle',(suite) => {
  // Corners a1 and c3 of the same square have circles of different colors.
  let clues = {"a1": "black_circle", "d1": "black", "e1": "black", "c3": "white_circle", "d3": "black", "a4": "black", "e4": "white_circle"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "a1-v": "1", "c1-v": "1", "a2-v": "1", "c2-v": "1", "a3-h": "1", "b3-h": "1",
    "b2-h": "1", "c2-h": "1", "d2-h": "1", "b2-v": "1", "e2-v": "1", "b3-v": "1", "e3-v": "1", "b4-h": "1", "c4-h": "1", "d4-h": "1"}};

  assert("Different colors response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "One rectangle can't pass throw circles of different colors", errors: ["a1", "c3"]});
}),

test('Square with a white circle',(suite) => {
  // The circle in a1 is white, but a1-c3 is a square.
  let clues = {"a1": "white_circle", "d1": "black", "e1": "black", "d3": "black", "a4": "black", "e4": "white_circle"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "a1-v": "1", "c1-v": "1", "a2-v": "1", "c2-v": "1", "a3-h": "1", "b3-h": "1",
    "b2-h": "1", "c2-h": "1", "d2-h": "1", "b2-v": "1", "e2-v": "1", "b3-v": "1", "e3-v": "1", "b4-h": "1", "c4-h": "1", "d4-h": "1"}};

  assert("White circle response").that(Checker.check("5x4", clues, data)).isEqualTo({
    status: "Rectangle with a white circle can not be a square",
    errors: ["a1", "b1", "c1", "c2", "c3", "b3", "a3", "a2", "a1"]});
}),

test('Non-square rectangle with a black circle',(suite) => {
  // The circle in e4 is black, but b2-e4 is not a square.
  let clues = {"a1": "black_circle", "d1": "black", "e1": "black", "d3": "black", "a4": "black", "e4": "black_circle"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "a1-v": "1", "c1-v": "1", "a2-v": "1", "c2-v": "1", "a3-h": "1", "b3-h": "1",
    "b2-h": "1", "c2-h": "1", "d2-h": "1", "b2-v": "1", "e2-v": "1", "b3-v": "1", "e3-v": "1", "b4-h": "1", "c4-h": "1", "d4-h": "1"}};

  assert("Black circle response").that(Checker.check("5x4", clues, data)).isEqualTo({
    status: "Rectangle with a black circle must be a square",
    errors: ["b2", "c2", "d2", "e2", "e3", "e4", "d4", "c4", "b4", "b3", "b2"]});
}),

);
