// Puzzle 5x5 with the snake of length 9 (B is a black circle, W is a white circle, x is a cross)
// and its solution (# is a snake cell):
//   . . . . .      # . . # #      a1 b1 c1 d1 e1
//   . . . . .      # . . # .      a2 b2 c2 d2 e2
//   B . W . .      # # # # .      a3 b3 c3 d3 e3
//   . . . x .      . . . . .      a4 b4 c4 d4 e4
//   . . . . .      . . . . .      a5 b5 c5 d5 e5
checkerTestSuite("snake_dutch", "Dutch snake",

test('Correct solution',(suite) => {
  let clues = {"a3": "black_circle", "c3": "white_circle", "d4": "cross"};
  let data = {"a1": "1", "a2": "1", "a3": "1", "b3": "1", "c3": "1", "d3": "1", "d2": "1", "d1": "1", "e1": "1"};

  assert("Correct solution response").that(Checker.check("5x5-9", clues, data)).isEqualTo({status: "OK"});
}),

test('Snake goes through the crossed cell',(suite) => {
  let clues = {"a3": "black_circle", "c3": "white_circle", "d4": "cross"};
  // The snake turns down in d3 and goes through the cross in d4.
  let data = {"a1": "1", "a2": "1", "a3": "1", "b3": "1", "c3": "1", "d3": "1", "d4": "1", "d5": "1", "e5": "1"};

  assert("Crossed cell response").that(Checker.check("5x5-9", clues, data)).isEqualTo({status: "Snake can't go through crossed cell", errors: ["d4"]});
}),

test('Snake goes straight through the black circle',(suite) => {
  let clues = {"a3": "black_circle", "c3": "white_circle", "d4": "cross"};
  // The snake a2-a4-c4-c1-d1 doesn't turn in a3:
  //   . . # # .
  //   # . # . .
  //   # . # . .
  //   # # # . .
  //   . . . . .
  let data = {"a2": "1", "a3": "1", "a4": "1", "b4": "1", "c4": "1", "c3": "1", "c2": "1", "c1": "1", "d1": "1"};

  assert("Black circle response").that(Checker.check("5x5-9", clues, data)).isEqualTo({status: "Snake should turn in the cell with black circle", errors: ["a3"]});
}),

test('Snake turns in the white circle',(suite) => {
  let clues = {"a3": "black_circle", "c3": "white_circle", "d4": "cross"};
  // The snake a1-a3-c3-c5-e5 turns in c3.
  let data = {"a1": "1", "a2": "1", "a3": "1", "b3": "1", "c3": "1", "c4": "1", "c5": "1", "d5": "1", "e5": "1"};

  assert("White circle response").that(Checker.check("5x5-9", clues, data)).isEqualTo({status: "Snake should go straight through the cell with white circle", errors: ["c3"]});
}),

test('No head and tail',(suite) => {
  let clues = {"a3": "black_circle", "c3": "white_circle", "d4": "cross"};
  // Shaded cells form a closed loop around the rectangle a1-d3.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "d2": "1", "d3": "1", "c3": "1", "b3": "1", "a3": "1", "a2": "1"};

  assert("No head response").that(Checker.check("5x5-9", clues, data)).isEqualTo({status: "Snake should have a head and a tail", errors: []});
}),

test('Snake with bifurcation',(suite) => {
  let clues = {"a3": "black_circle", "c3": "white_circle", "d4": "cross"};
  // Extra cell c4 is attached to the snake in c3.
  let data = {"a1": "1", "a2": "1", "a3": "1", "b3": "1", "c3": "1", "d3": "1", "d2": "1", "d1": "1", "e1": "1", "c4": "1"};

  assert("Bifurcation response").that(Checker.check("5x5-9", clues, data)).isEqualTo({status: "Black cells should form single snake without bifurcations", errors: ["c3"]});
}),

test('Separate shaded cell',(suite) => {
  let clues = {"a3": "black_circle", "c3": "white_circle", "d4": "cross"};
  // Extra cell e5 is not connected to the snake.
  let data = {"a1": "1", "a2": "1", "a3": "1", "b3": "1", "c3": "1", "d3": "1", "d2": "1", "d1": "1", "e1": "1", "e5": "1"};

  assert("Separate cell response").that(Checker.check("5x5-9", clues, data)).isEqualTo({status: "All black cells should be part of single snake", errors: ["e5"]});
}),

test('Snake touches itself',(suite) => {
  let clues = {"a3": "black_circle", "c3": "white_circle", "d4": "cross"};
  // The snake a2-a3-d3-d1-b1 touches itself diagonally in a2 and b1:
  //   . # # # .
  //   # . . # .
  //   # # # # .
  //   . . . . .
  //   . . . . .
  let data = {"a2": "1", "a3": "1", "b3": "1", "c3": "1", "d3": "1", "d2": "1", "d1": "1", "c1": "1", "b1": "1"};

  assert("Touching response").that(Checker.check("5x5-9", clues, data)).isEqualTo({status: "Snake shouldn't touch itself", errors: ["a2", "b1"]});
}),

test('Wrong length of the snake',(suite) => {
  let clues = {"a3": "black_circle", "c3": "white_circle", "d4": "cross"};
  // Without e1 the length of the snake is 8.
  let data = {"a1": "1", "a2": "1", "a3": "1", "b3": "1", "c3": "1", "d3": "1", "d2": "1", "d1": "1"};

  assert("Wrong length response").that(Checker.check("5x5-9", clues, data)).isEqualTo({status: "The length of the snake should be exactly equal to the given value", errors: []});
}),

);
