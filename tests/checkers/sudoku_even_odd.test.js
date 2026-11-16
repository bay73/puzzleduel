// Solution of the 4x4 puzzle. Cells with even digits are shaded (clue starts with "-"), others are white.
//   1 2 3 4
//   3 4 1 2
//   2 1 4 3
//   4 3 2 1
checkerTestSuite("sudoku_even_odd", "Even-Odd Sudoku",

test('Correct solution',(suite) => {
  let clues = {"a1": "1", "b1": "-", "d1": "-4", "b2": "-", "d2": "-", "a3": "-", "c3": "-", "a4": "-", "c4": "-"};
  let data = {"b1": "2", "c1": "3",
              "a2": "3", "b2": "4", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "c3": "4", "d3": "3",
              "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digit in area',(suite) => {
  let clues = {"a1": "1", "b1": "-", "d1": "-4", "b2": "-", "d2": "-", "a3": "-", "c3": "-", "a4": "-", "c4": "-"};
  // Digits in b1 and c1 are exchanged, so 3 is twice in the top left area.
  let data = {"b1": "3", "c1": "2",
              "a2": "3", "b2": "4", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "c3": "4", "d3": "3",
              "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Repeated digit in area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every area", errors: ["a1", "a2", "b1", "b2"]});
}),

test('Repeated digit in row',(suite) => {
  let clues = {"a1": "1", "b1": "-", "d1": "-4", "b2": "-", "d2": "-", "a3": "-", "c3": "-", "a4": "-", "c4": "-"};
  // Digits in b1 and b2 are exchanged: all areas are correct, but 4 is twice in the first row.
  let data = {"b1": "4", "c1": "3",
              "a2": "3", "b2": "2", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "c3": "4", "d3": "3",
              "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Repeated digit in row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every row", errors: ["a1", "b1", "c1", "d1"]});
}),

test('Repeated digit in column',(suite) => {
  let clues = {"a1": "1", "b1": "-", "d1": "-4", "b2": "-", "d2": "-", "a3": "-", "c3": "-", "a4": "-", "c4": "-"};
  // Digits in a2 and b2 are exchanged: all areas and rows are correct, but 4 is twice in the first column.
  let data = {"b1": "2", "c1": "3",
              "a2": "4", "b2": "3", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "c3": "4", "d3": "3",
              "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Repeated digit in column response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every column", errors: ["a1", "a2", "a3", "a4"]});
}),

test('Odd digit in shaded cell',(suite) => {
  let clues = {"a1": "1", "b1": "-", "d1": "-4", "b2": "-", "d2": "-", "a3": "-", "c3": "-", "a4": "-", "c4": "-"};
  // Valid sudoku (2 and 3 are exchanged everywhere), but shaded cell b1 contains 3.
  let data = {"b1": "3", "c1": "2",
              "a2": "2", "b2": "4", "c2": "1", "d2": "3",
              "a3": "3", "b3": "1", "c3": "4", "d3": "2",
              "a4": "4", "b4": "2", "c4": "3", "d4": "1"};

  assert("Odd digit in shaded cell response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Shaded cell should contain even digit", errors: ["b1"]});
}),

test('Even digit in white cell',(suite) => {
  let clues = {"a1": "1", "b1": "-", "d1": "-4", "b2": "-", "d2": "-", "a3": "-", "c3": "-", "a4": "-", "c4": "-"};
  // Valid sudoku, but white cell a2 contains 4.
  let data = {"b1": "2", "c1": "3",
              "a2": "4", "b2": "3", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "c3": "4", "d3": "3",
              "a4": "3", "b4": "4", "c4": "2", "d4": "1"};

  assert("Even digit in white cell response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "White cell should contain odd digit", errors: ["a2"]});
}),

);
