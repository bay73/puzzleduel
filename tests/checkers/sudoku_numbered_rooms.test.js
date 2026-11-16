// Solution of the 4x4 puzzle:
//   2 3 1 4      a1 b1 c1 d1
//   1 4 2 3      a2 b2 c2 d2
//   3 1 4 2      a3 b3 c3 d3
//   4 2 3 1      a4 b4 c4 d4
// A clue outside the grid is the digit in the Nth cell of the row or column (counting from the clue),
// where N is the digit in the first cell.
// E.g. left clue 3 in the first row: the first digit is 2 and the 2nd cell contains 3.
checkerTestSuite("sudoku_numbered_rooms", "Numbered rooms sudoku",

test('Correct solution',(suite) => {
  let clues = {"top": ["1",null,null,null], "bottom": [null,null,"2",null], "left": ["3",null,"4",null], "right": [null,"4",null,null], "d1": "4"};
  let data = {
    "a1": "2", "b1": "3", "c1": "1",
    "a2": "1", "b2": "4", "c2": "2", "d2": "3",
    "a3": "3", "b3": "1", "c3": "4", "d3": "2",
    "a4": "4", "b4": "2", "c4": "3", "d4": "1",
  };

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digits in area',(suite) => {
  let clues = {"top": ["1",null,null,null], "bottom": [null,null,"2",null], "left": ["3",null,"4",null], "right": [null,"4",null,null], "d1": "4"};
  // d4 is 2 instead of 1, so the bottom right area contains 2 twice.
  let data = {
    "a1": "2", "b1": "3", "c1": "1",
    "a2": "1", "b2": "4", "c2": "2", "d2": "3",
    "a3": "3", "b3": "1", "c3": "4", "d3": "2",
    "a4": "4", "b4": "2", "c4": "3", "d4": "2",
  };

  assert("Repeated digits in area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every area", errors: ["c3", "c4", "d3", "d4"]});
}),

test('Repeated digits in row',(suite) => {
  let clues = {"top": ["1",null,null,null], "bottom": [null,null,"2",null], "left": ["3",null,"4",null], "right": [null,"4",null,null], "d1": "4"};
  // d3 and d4 are swapped: all areas are still correct, but the third row contains 1 twice.
  let data = {
    "a1": "2", "b1": "3", "c1": "1",
    "a2": "1", "b2": "4", "c2": "2", "d2": "3",
    "a3": "3", "b3": "1", "c3": "4", "d3": "1",
    "a4": "4", "b4": "2", "c4": "3", "d4": "2",
  };

  assert("Repeated digits in row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every row", errors: ["a3", "b3", "c3", "d3"]});
}),

test('Repeated digits in column',(suite) => {
  let clues = {"top": ["1",null,null,null], "bottom": [null,null,"2",null], "left": ["3",null,"4",null], "right": [null,"4",null,null], "d1": "4"};
  // c3 and d3 are swapped: all areas and rows are still correct, but column c contains 2 twice.
  let data = {
    "a1": "2", "b1": "3", "c1": "1",
    "a2": "1", "b2": "4", "c2": "2", "d2": "3",
    "a3": "3", "b3": "1", "c3": "2", "d3": "4",
    "a4": "4", "b4": "2", "c4": "3", "d4": "1",
  };

  assert("Repeated digits in column response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every column", errors: ["c1", "c2", "c3", "c4"]});
}),

test('Wrong column clue',(suite) => {
  // Top clue of column a is 3, but the first digit is 2 and the 2nd cell (a2) contains 1.
  let clues = {"top": ["3",null,null,null], "bottom": [null,null,"2",null], "left": ["3",null,"4",null], "right": [null,"4",null,null], "d1": "4"};
  let data = {
    "a1": "2", "b1": "3", "c1": "1",
    "a2": "1", "b2": "4", "c2": "2", "d2": "3",
    "a3": "3", "b3": "1", "c3": "4", "d3": "2",
    "a4": "4", "b4": "2", "c4": "3", "d4": "1",
  };

  assert("Wrong column clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The column clue is not correct", errors: ["a2"]});
}),

test('Wrong row clue',(suite) => {
  // Right clue of the second row is 2, but the first digit from the right is 3
  // and the 3rd cell from the right (b2) contains 4.
  let clues = {"top": ["1",null,null,null], "bottom": [null,null,"2",null], "left": ["3",null,"4",null], "right": [null,"2",null,null], "d1": "4"};
  let data = {
    "a1": "2", "b1": "3", "c1": "1",
    "a2": "1", "b2": "4", "c2": "2", "d2": "3",
    "a3": "3", "b3": "1", "c3": "4", "d3": "2",
    "a4": "4", "b4": "2", "c4": "3", "d4": "1",
  };

  assert("Wrong row clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The row clue is not correct", errors: ["b2"]});
}),

);
