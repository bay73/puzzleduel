// Puzzle 4x4 and its solution (W, B are white and black circles,
// the loop goes along the border of the grid):
//   + W W +      a1 b1 c1 d1
//   B . . B      a2 b2 c2 d2
//   B . . B      a3 b3 c3 d3
//   + W - +      a4 b4 c4 d4
// Connector "a1-h" joins a1 and b1, connector "a1-v" joins a1 and a2.
checkerTestSuite("kuroshiro", "Kuroshiro",

test('Correct solution',(suite) => {
  let clues = {"b1": "white_circle", "c1": "white_circle", "a2": "black_circle", "d2": "black_circle",
               "a3": "black_circle", "d3": "black_circle", "b4": "white_circle"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "d2-v": "1", "d3-v": "1",
    "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"b1": "white_circle", "c1": "white_circle", "a2": "black_circle", "d2": "black_circle",
               "a3": "black_circle", "d3": "black_circle", "b4": "white_circle"};
  let data = {};

  assert("No loop response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "There should be single loop passing through some cells"});
}),

test('Loop is not closed',(suite) => {
  let clues = {"b1": "white_circle", "c1": "white_circle", "a2": "black_circle", "d2": "black_circle",
               "a3": "black_circle", "d3": "black_circle", "b4": "white_circle"};
  // No connection between d2 and d3: the line ends in d2.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "d3-v": "1",
    "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Loop is not closed response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "There should be single loop without bifurcations", errors: ["d2"]});
}),

test('Loop with bifurcation',(suite) => {
  let clues = {"b1": "white_circle", "c1": "white_circle", "a2": "black_circle", "d2": "black_circle",
               "a3": "black_circle", "d3": "black_circle", "b4": "white_circle"};
  // Extra line from b1 to b2.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "d2-v": "1", "d3-v": "1",
    "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1", "b1-v": "1"}};

  assert("Loop with bifurcation response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "There should be single loop without bifurcations", errors: ["b1"]});
}),

test('No turn between circles of different colors',(suite) => {
  // Circle c1 is black now: the loop goes straight from white b1 to black c1.
  let clues = {"b1": "white_circle", "c1": "black_circle", "a2": "black_circle", "d2": "black_circle",
               "a3": "black_circle", "d3": "black_circle", "b4": "white_circle"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "d2-v": "1", "d3-v": "1",
    "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("No turn between different colors response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "Loop should turn exactly once between the white and black circles", errors: ["c1", "b1"]});
}),

test('Turn between circles of the same color',(suite) => {
  // Circle d2 is white now: the loop turns in d1 between white c1 and white d2.
  let clues = {"b1": "white_circle", "c1": "white_circle", "a2": "black_circle", "d2": "white_circle",
               "a3": "black_circle", "d3": "black_circle", "b4": "white_circle"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "d2-v": "1", "d3-v": "1",
    "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Turn between same colors response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "Loop should not turn between the circles of the same color", errors: ["d2", "c1"]});
}),

test('Turns between circles of the same color at the loop start',(suite) => {
  // No circles in a2 and a3: the loop turns in a4 and a1 between white b4 and white b1.
  let clues = {"b1": "white_circle", "c1": "white_circle", "d2": "black_circle",
               "d3": "black_circle", "b4": "white_circle"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "d2-v": "1", "d3-v": "1",
    "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Turn between same colors response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "Loop should not turn between the circles of the same color", errors: ["b1", "b4"]});
}),

test('Two loops',(suite) => {
  let clues = {"b1": "white_circle", "c1": "white_circle", "a2": "black_circle", "d2": "black_circle",
               "a3": "black_circle", "d3": "black_circle", "b4": "white_circle"};
  // Second loop b2-c2-c3-b3 inside the correct one.
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "d2-v": "1", "d3-v": "1",
    "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1",
    "b2-h": "1", "c2-v": "1", "b3-h": "1", "b2-v": "1"}};

  assert("Two loops response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "There should be single loop passing through some cells", errors: []});
}),

test('Circle is not visited',(suite) => {
  // Extra black circle in b2, the loop doesn't pass through it.
  let clues = {"b1": "white_circle", "c1": "white_circle", "a2": "black_circle", "d2": "black_circle",
               "a3": "black_circle", "d3": "black_circle", "b4": "white_circle", "b2": "black_circle"};
  let data = {"connectors": {
    "a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "d2-v": "1", "d3-v": "1",
    "c4-h": "1", "b4-h": "1", "a4-h": "1", "a3-v": "1", "a2-v": "1", "a1-v": "1"}};

  assert("Circle is not visited response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "Loop should pass through all cells with circles", errors: ["b2"]});
}),

);
