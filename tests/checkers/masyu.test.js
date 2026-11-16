// Puzzle 5x4 and its solution (W, B are white and black circles,
// the loop goes along the border of the grid):
//   +---W---+---+---B      a1 b1 c1 d1 e1
//   |               |
//   +   .   .   .   +      a2 b2 c2 d2 e2
//   |               |
//   +   .   .   .   W      a3 b3 c3 d3 e3
//   |               |
//   B---+---+---+---+      a4 b4 c4 d4 e4
// Connector "a1-h" joins a1 and b1, connector "a1-v" joins a1 and a2.
checkerTestSuite("masyu", "Masyu",

test('Correct solution',(suite) => {
  let clues = {"b1": "white_circle", "e1": "black_circle", "e3": "white_circle", "a4": "black_circle"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-h": "1", "e1-v": "1", "e2-v": "1", "e3-v": "1",
    "d4-h": "1", "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Correct solution response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"b1": "white_circle", "e1": "black_circle", "e3": "white_circle", "a4": "black_circle"};
  let data = {};

  assert("No loop response").that(Checker.check("5x4", clues, data)).isEqualTo(
    {status: "There should be single loop passing through some cells"});
}),

test('Loop is not closed',(suite) => {
  let clues = {"b1": "white_circle", "e1": "black_circle", "e3": "white_circle", "a4": "black_circle"};
  // No connection between d4 and c4: the line ends in d4.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-h": "1", "e1-v": "1", "e2-v": "1", "e3-v": "1",
    "d4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Loop is not closed response").that(Checker.check("5x4", clues, data)).isEqualTo(
    {status: "There should be single loop without bifurcations", errors: ["d4"]});
}),

test('Loop with bifurcation',(suite) => {
  let clues = {"b1": "white_circle", "e1": "black_circle", "e3": "white_circle", "a4": "black_circle"};
  // Extra line from c1 to c2.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-h": "1", "e1-v": "1", "e2-v": "1", "e3-v": "1",
    "d4-h": "1", "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1", "c1-v": "1"}};

  assert("Loop with bifurcation response").that(Checker.check("5x4", clues, data)).isEqualTo(
    {status: "There should be single loop without bifurcations", errors: ["c1"]});
}),

test('Turn at the white circle',(suite) => {
  // Extra white circle in the corner e4.
  let clues = {"b1": "white_circle", "e1": "black_circle", "e3": "white_circle", "a4": "black_circle", "e4": "white_circle"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-h": "1", "e1-v": "1", "e2-v": "1", "e3-v": "1",
    "d4-h": "1", "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Turn at the white circle response").that(Checker.check("5x4", clues, data)).isEqualTo(
    {status: "Loop shouldn't turn at the white circle", errors: ["e4"]});
}),

test('No turns next to the white circle',(suite) => {
  // Extra white circle in c1: the loop goes straight through both b1 and d1.
  let clues = {"b1": "white_circle", "c1": "white_circle", "e1": "black_circle", "e3": "white_circle", "a4": "black_circle"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-h": "1", "e1-v": "1", "e2-v": "1", "e3-v": "1",
    "d4-h": "1", "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("No turns next to the white circle response").that(Checker.check("5x4", clues, data)).isEqualTo(
    {status: "Loop should turn next to the white circle", errors: ["c1"]});
}),

test('No turn at the black circle',(suite) => {
  // Extra black circle in c4: the loop goes straight through it.
  let clues = {"b1": "white_circle", "e1": "black_circle", "e3": "white_circle", "a4": "black_circle", "c4": "black_circle"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-h": "1", "e1-v": "1", "e2-v": "1", "e3-v": "1",
    "d4-h": "1", "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("No turn at the black circle response").that(Checker.check("5x4", clues, data)).isEqualTo(
    {status: "Loop should turn at the black circle", errors: ["c4"]});
}),

test('Turn right after the black circle',(suite) => {
  let clues = {"b1": "white_circle", "e1": "black_circle", "e3": "white_circle", "a4": "black_circle"};
  // The loop goes a4-a3-b3-b2-a2-a1: it turns in a3, which is next to the black circle a4.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-h": "1", "e1-v": "1", "e2-v": "1", "e3-v": "1",
    "d4-h": "1", "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a3-h": "1", "b2-v": "1", "a2-h": "1", "a1-v": "1"}};

  assert("Turn after the black circle response").that(Checker.check("5x4", clues, data)).isEqualTo(
    {status: "Loop shouldn't turn next to the black circle", errors: ["a3"]});
}),

test('Turn right before the black circle',(suite) => {
  let clues = {"b1": "white_circle", "e1": "black_circle", "e3": "white_circle", "a4": "black_circle"};
  // The loop goes e4-d4-c4-c3-b3-b4-a4: it turns in b4, which is next to the black circle a4.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-h": "1", "e1-v": "1", "e2-v": "1", "e3-v": "1",
    "d4-h": "1", "c4-h": "1", "c3-v": "1", "b3-h": "1", "b3-v": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Turn before the black circle response").that(Checker.check("5x4", clues, data)).isEqualTo(
    {status: "Loop shouldn't turn next to the black circle", errors: ["b4"]});
}),

test('Two loops',(suite) => {
  let clues = {"b1": "white_circle", "e1": "black_circle", "e3": "white_circle", "a4": "black_circle"};
  // Second loop b2-c2-c3-b3 inside the correct one.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-h": "1", "e1-v": "1", "e2-v": "1", "e3-v": "1",
    "d4-h": "1", "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1",
    "b2-h": "1", "c2-v": "1", "b3-h": "1", "b2-v": "1"}};

  assert("Two loops response").that(Checker.check("5x4", clues, data)).isEqualTo(
    {status: "There should be single loop passing through some cells", errors: []});
}),

test('Circle is not visited',(suite) => {
  // Extra white circle in c2, the loop doesn't pass through it.
  let clues = {"b1": "white_circle", "e1": "black_circle", "c2": "white_circle", "e3": "white_circle", "a4": "black_circle"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-h": "1", "e1-v": "1", "e2-v": "1", "e3-v": "1",
    "d4-h": "1", "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Circle is not visited response").that(Checker.check("5x4", clues, data)).isEqualTo(
    {status: "Loop should pass through all cells with circles", errors: ["c2"]});
}),

);
