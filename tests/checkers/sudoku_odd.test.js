// Solution of the 4x4 puzzle (shaded cells are c1, d2 and a3, they should contain odd digits):
//   2 3 1 4      a1 b1 c1 d1
//   1 4 2 3      a2 b2 c2 d2
//   3 1 4 2      a3 b3 c3 d3
//   4 2 3 1      a4 b4 c4 d4
// Clue "-" is an empty shaded cell, clue "-3" is a shaded cell with the given digit 3.
checkerTestSuite("sudoku_odd", "Odd sudoku",

test('Correct solution',(suite) => {
  let clues = {"c1": "-", "b2": "4", "d2": "-3", "a3": "-"};
  let data = {
    "a1": "2", "b1": "3", "c1": "1", "d1": "4",
    "a2": "1", "c2": "2",
    "a3": "3", "b3": "1", "c3": "4", "d3": "2",
    "a4": "4", "b4": "2", "c4": "3", "d4": "1",
  };

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digits in area',(suite) => {
  let clues = {"c1": "-", "b2": "4", "d2": "-3", "a3": "-"};
  // d4 is 2 instead of 1, so the bottom right area contains 2 twice.
  let data = {
    "a1": "2", "b1": "3", "c1": "1", "d1": "4",
    "a2": "1", "c2": "2",
    "a3": "3", "b3": "1", "c3": "4", "d3": "2",
    "a4": "4", "b4": "2", "c4": "3", "d4": "2",
  };

  assert("Repeated digits in area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every area", errors: ["c3", "c4", "d3", "d4"]});
}),

test('Repeated digits in row',(suite) => {
  let clues = {"c1": "-", "b2": "4", "d2": "-3", "a3": "-"};
  // d3 and d4 are swapped: all areas are still correct, but the third row contains 1 twice.
  let data = {
    "a1": "2", "b1": "3", "c1": "1", "d1": "4",
    "a2": "1", "c2": "2",
    "a3": "3", "b3": "1", "c3": "4", "d3": "1",
    "a4": "4", "b4": "2", "c4": "3", "d4": "2",
  };

  assert("Repeated digits in row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every row", errors: ["a3", "b3", "c3", "d3"]});
}),

test('Repeated digits in column',(suite) => {
  let clues = {"c1": "-", "b2": "4", "d2": "-3", "a3": "-"};
  // c3 and d3 are swapped: all areas and rows are still correct, but column c contains 2 twice.
  let data = {
    "a1": "2", "b1": "3", "c1": "1", "d1": "4",
    "a2": "1", "c2": "2",
    "a3": "3", "b3": "1", "c3": "2", "d3": "4",
    "a4": "4", "b4": "2", "c4": "3", "d4": "1",
  };

  assert("Repeated digits in column response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every column", errors: ["c1", "c2", "c3", "c4"]});
}),

test('Even digit in shaded cell',(suite) => {
  let clues = {"c1": "-", "b2": "4", "d2": "-3", "a3": "-"};
  // Rows 3 and 4 of the solution are swapped: it is still a correct sudoku, but shaded a3 contains 4.
  let data = {
    "a1": "2", "b1": "3", "c1": "1", "d1": "4",
    "a2": "1", "c2": "2",
    "a3": "4", "b3": "2", "c3": "3", "d3": "1",
    "a4": "3", "b4": "1", "c4": "4", "d4": "2",
  };

  assert("Even digit in shaded cell response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Shaded cell should contain odd digit", errors: ["a3"]});
}),

);
