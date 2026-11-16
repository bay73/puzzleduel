// Puzzle 4x4 (H and T are given head and tail of the snake, x is a cross)
// and its solution (# is a snake cell):
//   . . H 1      . # # 1      a1 b1 c1 d1
//   . . x 3      . # . 3      a2 b2 c2 d2
//   . . . T      . # # #      a3 b3 c3 d3
//   . . . .      . . . .      a4 b4 c4 d4
checkerTestSuite("snake_minesweeper", "Minesweeper snake",

test('Correct solution',(suite) => {
  let clues = {"c1": "black", "d1": "1", "c2": "cross", "d2": "3", "d3": "black"};
  let data = {"b1": "black", "b2": "black", "b3": "black", "c3": "black"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Wrong number of snake cells around the clue',(suite) => {
  let clues = {"c1": "black", "d1": "1", "c2": "cross", "d2": "3", "d3": "black"};
  // The snake goes along the border of the grid: c1-a1-a4-d4-d3. There are only two snake cells around d2.
  let data = {"b1": "black", "a1": "black", "a2": "black", "a3": "black", "a4": "black", "b4": "black", "c4": "black", "d4": "black"};

  assert("Wrong clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["d2"]});
}),

test('Snake with bifurcation',(suite) => {
  let clues = {"c1": "black", "d1": "1", "c2": "cross", "d2": "3", "d3": "black"};
  // Extra cell a3 is attached to the snake in b3.
  let data = {"b1": "black", "b2": "black", "b3": "black", "c3": "black", "a3": "black"};

  assert("Bifurcation response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Black cells should form single snake without bifurcations", errors: ["b3"]});
}),

test('Separate shaded cell',(suite) => {
  let clues = {"c1": "black", "d1": "1", "c2": "cross", "d2": "3", "d3": "black"};
  // Extra cell a4 is not connected to the snake.
  let data = {"b1": "black", "b2": "black", "b3": "black", "c3": "black", "a4": "black"};

  assert("Separate cell response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All black cells should be part of single snake", errors: ["a4"]});
}),

test('Snake touches itself',(suite) => {
  let clues = {"c1": "black", "d1": "1", "c2": "cross", "d2": "3", "d3": "black"};
  // The snake c1-b1-b2-a2-a4-c4-c3-d3 touches itself diagonally in b2 and c3:
  //   . # # 1
  //   # # . 3
  //   # . # #
  //   # # # .
  let data = {"b1": "black", "b2": "black", "a2": "black", "a3": "black", "a4": "black", "b4": "black", "c4": "black", "c3": "black"};

  assert("Touching response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Snake shouldn't touch itself", errors: ["c3", "b2"]});
}),

);
