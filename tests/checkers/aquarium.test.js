// Puzzle 4x4 (letters mark the areas, numbers are clues outside the grid)
// and its solution (# is a filled cell):
//   A A B B  0      . . . .
//   A C B B  3      # . # #
//   C C C B  1      . . . #
//   C D D D  4      # # # #
//   2 1 2 3
checkerTestSuite("aquarium", "Aquarium",

test('Correct solution',(suite) => {
  let clues = {"areas": [["a1", "b1", "a2"], ["c1", "d1", "c2", "d2", "d3"], ["b2", "a3", "b3", "c3", "a4"], ["b4", "c4", "d4"]],
               "bottom": ["2", "1", "2", "3"], "right": ["0", "3", "1", "4"]};
  let data = {"a2": "1", "c2": "1", "d2": "1", "d3": "1", "a4": "1", "b4": "1", "c4": "1", "d4": "1"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Area is not filled from the bottom',(suite) => {
  let clues = {"areas": [["a1", "b1", "a2"], ["c1", "d1", "c2", "d2", "d3"], ["b2", "a3", "b3", "c3", "a4"], ["b4", "c4", "d4"]],
               "bottom": ["2", "1", "2", "3"], "right": ["0", "3", "1", "4"]};
  // Cell a1 is filled instead of a2, which is below it in the same area.
  let data = {"a1": "1", "c2": "1", "d2": "1", "d3": "1", "a4": "1", "b4": "1", "c4": "1", "d4": "1"};

  assert("Not from the bottom response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The cells must be filled up from the bottom up in the area", errors: ["a1", "b1", "a2"]});
}),

test('Level is not the same within the area',(suite) => {
  let clues = {"areas": [["a1", "b1", "a2"], ["c1", "d1", "c2", "d2", "d3"], ["b2", "a3", "b3", "c3", "a4"], ["b4", "c4", "d4"]],
               "bottom": ["2", "1", "2", "3"], "right": ["0", "3", "1", "4"]};
  // Cell c2 is not filled, but d2 in the same row of the same area is filled.
  let data = {"a2": "1", "d2": "1", "d3": "1", "a4": "1", "b4": "1", "c4": "1", "d4": "1"};

  assert("Different levels response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The cells must be filled up from the bottom up in the area", errors: ["c1", "d1", "c2", "d2", "d3"]});
}),

test('Wrong number of filled cells in the column',(suite) => {
  let clues = {"areas": [["a1", "b1", "a2"], ["c1", "d1", "c2", "d2", "d3"], ["b2", "a3", "b3", "c3", "a4"], ["b4", "c4", "d4"]],
               "bottom": ["2", "1", "2", "3"], "right": ["0", "3", "1", "4"]};
  // Row 3 of area C (a3, b3, c3) is also filled: three filled cells in column a.
  let data = {"a2": "1", "c2": "1", "d2": "1", "a3": "1", "b3": "1", "c3": "1", "d3": "1", "a4": "1", "b4": "1", "c4": "1", "d4": "1"};

  assert("Wrong column response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Wrong number of blackened cells in the column", errors: ["a1", "a2", "a3", "a4"]});
}),

test('Wrong number of filled cells in the row',(suite) => {
  // There is one filled cell in row 3, but the clue requires two.
  let clues = {"areas": [["a1", "b1", "a2"], ["c1", "d1", "c2", "d2", "d3"], ["b2", "a3", "b3", "c3", "a4"], ["b4", "c4", "d4"]],
               "bottom": ["2", "1", "2", "3"], "right": ["0", "3", "2", "4"]};
  let data = {"a2": "1", "c2": "1", "d2": "1", "d3": "1", "a4": "1", "b4": "1", "c4": "1", "d4": "1"};

  assert("Wrong row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Wrong number of blackened cells in the row", errors: ["a3", "b3", "c3", "d3"]});
}),

);
