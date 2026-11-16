// Puzzle 4x4 (H and T are given head and tail of the snake). Cells of the snake are striped:
// the head is dark, the next cell is bright, then dark again and so on.
// Clues to the right show the number of dark cells in the row,
// clues at the bottom show the number of bright cells in the column.
// Puzzle and its solution (D is a dark cell of the snake, b is a bright cell):
//   . . H .  1      . b D .      a1 b1 c1 d1
//   . . . .  1      . D . .      a2 b2 c2 d2
//   . . . T  1      . b D b      a3 b3 c3 d3
//   . . . .  0      . . . .      a4 b4 c4 d4
//         1
checkerTestSuite("snake_striped", "Striped snake",

test('Correct solution',(suite) => {
  let clues = {"c1": "black", "d3": "black", "bottom": [null, null, null, "1"], "right": ["1", "1", "1", "0"]};
  let data = {"b1": "black", "b2": "black", "b3": "black", "c3": "black"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Snake with bifurcation',(suite) => {
  let clues = {"c1": "black", "d3": "black", "bottom": [null, null, null, "1"], "right": ["1", "1", "1", "0"]};
  // Extra cell a3 is attached to the snake in b3.
  let data = {"b1": "black", "b2": "black", "b3": "black", "c3": "black", "a3": "black"};

  assert("Bifurcation response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Black cells should form single snake without bifurcations", errors: ["b3"]});
}),

test('Separate shaded cell',(suite) => {
  let clues = {"c1": "black", "d3": "black", "bottom": [null, null, null, "1"], "right": ["1", "1", "1", "0"]};
  // Extra cell a4 is not connected to the snake.
  let data = {"b1": "black", "b2": "black", "b3": "black", "c3": "black", "a4": "black"};

  assert("Separate cell response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All black cells should be part of single snake", errors: ["a4"]});
}),

test('Snake touches itself',(suite) => {
  let clues = {"c1": "black", "d3": "black", "bottom": [null, null, null, "1"], "right": ["1", "1", "1", "0"]};
  // The snake c1-b1-b2-a2-a4-c4-c3-d3 touches itself diagonally in b2 and c3:
  //   . # # .
  //   # # . .
  //   # . # #
  //   # # # .
  let data = {"b1": "black", "b2": "black", "a2": "black", "a3": "black", "a4": "black", "b4": "black", "c4": "black", "c3": "black"};

  assert("Touching response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Snake shouldn't touch itself", errors: ["c3", "b2"]});
}),

test('Wrong number of bright cells in the column',(suite) => {
  let clues = {"c1": "black", "d3": "black", "bottom": [null, null, null, "1"], "right": ["1", "1", "1", "0"]};
  // The snake c1-d1-d2-d3 has two bright cells (d1 and d3) in the last column.
  let data = {"d1": "black", "d2": "black"};

  assert("Wrong column response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Wrong number of blackened cells in the column", errors: ["d1", "d2", "d3", "d4"]});
}),

test('Wrong number of dark cells in the row',(suite) => {
  let clues = {"c1": "black", "d3": "black", "bottom": [null, null, null, "1"], "right": ["1", "1", "1", "0"]};
  // The snake goes along the border of the grid: c1-a1-a4-d4-d3.
  // The only bright cell in the last column is d3, but there are two dark cells (a1 and c1) in the first row.
  let data = {"b1": "black", "a1": "black", "a2": "black", "a3": "black", "a4": "black", "b4": "black", "c4": "black", "d4": "black"};

  assert("Wrong row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Wrong number of blackened cells in the row", errors: ["a1", "b1", "c1", "d1"]});
}),

);
