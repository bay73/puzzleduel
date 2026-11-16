// Solution of the 4x4 puzzle. Shaded cells b1, c1, b2, b3 (clue starts with "-") form an extra region
// which contains digits 2, 3, 4, 1.
//   1 2 3 4
//   3 4 1 2
//   2 1 4 3
//   4 3 2 1
checkerTestSuite("sudoku_extra_regions", "Extra Regions Sudoku",

test('Correct solution',(suite) => {
  let clues = {"a1": "1", "d1": "4", "b1": "-", "c1": "-", "b2": "-", "b3": "-", "d4": "1"};
  let data = {"b1": "2", "c1": "3",
              "a2": "3", "b2": "4", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "c3": "4", "d3": "3",
              "a4": "4", "b4": "3", "c4": "2"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digit in area',(suite) => {
  let clues = {"a1": "1", "d1": "4", "b1": "-", "c1": "-", "b2": "-", "b3": "-", "d4": "1"};
  // Digits in b1 and c1 are exchanged, so 3 is twice in the top left area.
  let data = {"b1": "3", "c1": "2",
              "a2": "3", "b2": "4", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "c3": "4", "d3": "3",
              "a4": "4", "b4": "3", "c4": "2"};

  assert("Repeated digit in area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every area", errors: ["a1", "a2", "b1", "b2"]});
}),

test('Repeated digit in row',(suite) => {
  let clues = {"a1": "1", "d1": "4", "b1": "-", "c1": "-", "b2": "-", "b3": "-", "d4": "1"};
  // Digits in b1 and b2 are exchanged: all areas are correct, but 4 is twice in the first row.
  let data = {"b1": "4", "c1": "3",
              "a2": "3", "b2": "2", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "c3": "4", "d3": "3",
              "a4": "4", "b4": "3", "c4": "2"};

  assert("Repeated digit in row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every row", errors: ["a1", "b1", "c1", "d1"]});
}),

test('Repeated digit in column',(suite) => {
  let clues = {"a1": "1", "d1": "4", "b1": "-", "c1": "-", "b2": "-", "b3": "-", "d4": "1"};
  // Digits in a2 and b2 are exchanged: all areas and rows are correct, but 4 is twice in the first column.
  let data = {"b1": "2", "c1": "3",
              "a2": "4", "b2": "3", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "c3": "4", "d3": "3",
              "a4": "4", "b4": "3", "c4": "2"};

  assert("Repeated digit in column response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every column", errors: ["a1", "a2", "a3", "a4"]});
}),

test('Repeated digit in shaded region',(suite) => {
  let clues = {"a1": "1", "d1": "4", "b1": "-", "c1": "-", "b2": "-", "b3": "-", "d4": "1"};
  // Valid sudoku, but shaded region contains 3 twice (c1 and b2).
  let data = {"b1": "2", "c1": "3",
              "a2": "4", "b2": "3", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "c3": "4", "d3": "3",
              "a4": "3", "b4": "4", "c4": "2"};

  assert("Repeated digit in shaded region response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in shaded area", errors: ["b1", "c1", "b2", "b3"]});
}),

);
