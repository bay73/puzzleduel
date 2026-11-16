// Solution of the 4x4 puzzle:
//   2 3 1 4      a1 b1 c1 d1
//   1 4 2 3      a2 b2 c2 d2
//   3 1 4 2      a3 b3 c3 d3
//   4 2 3 1      a4 b4 c4 d4
// A clue outside the grid is the position (counting from the clue) of the cell which contains
// the position of digit 1 in this row or column.
// E.g. left clue 2 in the first row: the 2nd cell contains 3, and 1 is in the 3rd cell.
checkerTestSuite("sudoku_index_to_one", "Index to one sudoku",

test('Correct solution',(suite) => {
  let clues = {"top": [null,"1",null,null], "bottom": ["2",null,null,null], "left": ["2",null,null,null], "right": ["4",null,null,null], "d2": "3"};
  let data = {
    "a1": "2", "b1": "3", "c1": "1", "d1": "4",
    "a2": "1", "b2": "4", "c2": "2",
    "a3": "3", "b3": "1", "c3": "4", "d3": "2",
    "a4": "4", "b4": "2", "c4": "3", "d4": "1",
  };

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Wrong column clue',(suite) => {
  // Bottom clue of column a is 1: the 1st cell from the bottom (a4) contains 4,
  // but the 4th cell from the bottom (a1) is 2, not 1.
  let clues = {"top": [null,"1",null,null], "bottom": ["1",null,null,null], "left": ["2",null,null,null], "right": ["4",null,null,null], "d2": "3"};
  let data = {
    "a1": "2", "b1": "3", "c1": "1", "d1": "4",
    "a2": "1", "b2": "4", "c2": "2",
    "a3": "3", "b3": "1", "c3": "4", "d3": "2",
    "a4": "4", "b4": "2", "c4": "3", "d4": "1",
  };

  assert("Wrong column clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The column clue is not correct", errors: ["a4", "a1"]});
}),

test('Wrong row clue',(suite) => {
  // Left clue of the first row is 1: the 1st cell (a1) contains 2, but the 2nd cell (b1) is 3, not 1.
  let clues = {"top": [null,"1",null,null], "bottom": ["2",null,null,null], "left": ["1",null,null,null], "right": ["4",null,null,null], "d2": "3"};
  let data = {
    "a1": "2", "b1": "3", "c1": "1", "d1": "4",
    "a2": "1", "b2": "4", "c2": "2",
    "a3": "3", "b3": "1", "c3": "4", "d3": "2",
    "a4": "4", "b4": "2", "c4": "3", "d4": "1",
  };

  assert("Wrong row clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The row clue is not correct", errors: ["a1", "b1"]});
}),

test('Repeated digits in area',(suite) => {
  let clues = {"top": [null,"1",null,null], "bottom": ["2",null,null,null], "left": ["2",null,null,null], "right": ["4",null,null,null], "d2": "3"};
  // d4 is 2 instead of 1, so the bottom right area contains 2 twice.
  let data = {
    "a1": "2", "b1": "3", "c1": "1", "d1": "4",
    "a2": "1", "b2": "4", "c2": "2",
    "a3": "3", "b3": "1", "c3": "4", "d3": "2",
    "a4": "4", "b4": "2", "c4": "3", "d4": "2",
  };

  assert("Repeated digits in area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every area", errors: ["c3", "c4", "d3", "d4"]});
}),

test('Repeated digits in row',(suite) => {
  let clues = {"top": [null,"1",null,null], "bottom": ["2",null,null,null], "left": ["2",null,null,null], "right": ["4",null,null,null], "d2": "3"};
  // d3 and d4 are swapped: all areas are still correct, but the third row contains 1 twice.
  let data = {
    "a1": "2", "b1": "3", "c1": "1", "d1": "4",
    "a2": "1", "b2": "4", "c2": "2",
    "a3": "3", "b3": "1", "c3": "4", "d3": "1",
    "a4": "4", "b4": "2", "c4": "3", "d4": "2",
  };

  assert("Repeated digits in row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every row", errors: ["a3", "b3", "c3", "d3"]});
}),

test('Repeated digits in column',(suite) => {
  let clues = {"top": [null,"1",null,null], "bottom": ["2",null,null,null], "left": ["2",null,null,null], "right": ["4",null,null,null], "d2": "3"};
  // c3 and d3 are swapped: all areas and rows are still correct, but column c contains 2 twice.
  let data = {
    "a1": "2", "b1": "3", "c1": "1", "d1": "4",
    "a2": "1", "b2": "4", "c2": "2",
    "a3": "3", "b3": "1", "c3": "2", "d3": "4",
    "a4": "4", "b4": "2", "c4": "3", "d4": "1",
  };

  assert("Repeated digits in column response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every column", errors: ["c1", "c2", "c3", "c4"]});
}),

test('Empty cell used by the column clue',(suite) => {
  let clues = {"top": [null,"1",null,null], "bottom": ["2",null,null,null], "left": ["2",null,null,null], "right": ["4",null,null,null], "d2": "3"};
  // a3 is empty: it is the 2nd cell from the bottom of column a, which is used by the bottom clue.
  // The grid is checked before the clues, so the area with the empty cell is reported.
  let data = {
    "a1": "2", "b1": "3", "c1": "1", "d1": "4",
    "a2": "1", "b2": "4", "c2": "2",
    "b3": "1", "c3": "4", "d3": "2",
    "a4": "4", "b4": "2", "c4": "3", "d4": "1",
  };

  assert("Empty cell response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every area", errors: ["a3", "a4", "b3", "b4"]});
}),

test('Empty cell used by the row clue',(suite) => {
  // Left clue of the third row is 1: the 1st cell of the row (a3) is empty.
  let clues = {"top": [null,"1",null,null], "left": [null,null,"1",null], "d2": "3"};
  let data = {
    "a1": "2", "b1": "3", "c1": "1", "d1": "4",
    "a2": "1", "b2": "4", "c2": "2",
    "b3": "1", "c3": "4", "d3": "2",
    "a4": "4", "b4": "2", "c4": "3", "d4": "1",
  };

  assert("Empty cell response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every area", errors: ["a3", "a4", "b3", "b4"]});
}),

test('Empty grid',(suite) => {
  let clues = {"top": [null,"1",null,null], "bottom": ["2",null,null,null], "left": ["2",null,null,null], "right": ["4",null,null,null], "d2": "3"};
  let data = {};

  assert("Empty grid response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every area", errors: ["a1", "a2", "b1", "b2"]});
}),

);
