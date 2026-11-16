// Puzzle 4x4 with two areas (rows 1-2 and rows 3-4) and its solution
// (# is a black cell, x is a cell which is given as white):
//   # . . x      a1 b1 c1 d1
//   # # # .      a2 b2 c2 d2
//   ---------
//   . . # .      a3 b3 c3 d3
//   . # # #      a4 b4 c4 d4
checkerTestSuite("lits", "LITS",

test('Correct solution',(suite) => {
  let clues = {"areas": [["a1","b1","c1","d1","a2","b2","c2","d2"], ["a3","b3","c3","d3","a4","b4","c4","d4"]], "d1": "cross"};
  let data = {"a1": "1", "a2": "1", "b2": "1", "c2": "1", "c3": "1", "b4": "1", "c4": "1", "d4": "1"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Black 2x2 square',(suite) => {
  let clues = {"areas": [["a1","b1","c1","d1","a2","b2","c2","d2"], ["a3","b3","c3","d3","a4","b4","c4","d4"]], "d1": "cross"};
  // Extra black cell in b3.
  let data = {"a1": "1", "a2": "1", "b2": "1", "c2": "1", "b3": "1", "c3": "1", "b4": "1", "c4": "1", "d4": "1"};

  assert("Black 2x2 square response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "No 2x2 black squares are allowed", errors: ["b2", "c2", "b3", "c3"]});
}),

test('Black area is not connected',(suite) => {
  let clues = {"areas": [["a1","b1","c1","d1","a2","b2","c2","d2"], ["a3","b3","c3","d3","a4","b4","c4","d4"]], "d1": "cross"};
  // Tetromino in the bottom area is a4-b4-c4-d4, it doesn't touch the tetromino in the top area.
  let data = {"a1": "1", "a2": "1", "b2": "1", "c2": "1", "a4": "1", "b4": "1", "c4": "1", "d4": "1"};

  assert("Black area is not connected response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "Black area should be connected"});
}),

test('Three black cells in the area',(suite) => {
  let clues = {"areas": [["a1","b1","c1","d1","a2","b2","c2","d2"], ["a3","b3","c3","d3","a4","b4","c4","d4"]], "d1": "cross"};
  // Cell d4 is not black.
  let data = {"a1": "1", "a2": "1", "b2": "1", "c2": "1", "c3": "1", "b4": "1", "c4": "1"};

  assert("Three black cells response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "Black cells in each area should form valid tetromino", errors: ["a3","b3","c3","d3","a4","b4","c4","d4"]});
}),

test('Black cells in the area are not a tetromino',(suite) => {
  let clues = {"areas": [["a1","b1","c1","d1","a2","b2","c2","d2"], ["a3","b3","c3","d3","a4","b4","c4","d4"]], "d1": "cross"};
  // Four black cells of the bottom area are a3 and c3-c4-d4, they are not connected inside the area.
  let data = {"a1": "1", "a2": "1", "b2": "1", "c2": "1", "a3": "1", "c3": "1", "c4": "1", "d4": "1"};

  assert("Not a tetromino response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "Black cells in each area should form valid tetromino", errors: ["a3","b3","c3","d3","a4","b4","c4","d4"]});
}),

test('Same tetrominoes share an edge',(suite) => {
  let clues = {"areas": [["a1","b1","c1","d1","a2","b2","c2","d2"], ["a3","b3","c3","d3","a4","b4","c4","d4"]], "d1": "cross"};
  // Tetromino in the bottom area is c3-a4-b4-c4: it is L as the one in the top area.
  let data = {"a1": "1", "a2": "1", "b2": "1", "c2": "1", "c3": "1", "a4": "1", "b4": "1", "c4": "1"};

  assert("Same tetrominoes response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "Tetromino of the same type shoudln't share an edge", errors: ["c2", "c3"]});
}),

);
