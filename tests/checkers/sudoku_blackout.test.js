// Solution of the 4x4 puzzle (# is a black cell):
//   1 # 3 4
//   3 4 1 2
//   2 1 # 3
//   4 3 2 1
checkerTestSuite("sudoku_blackout", "Blackout Sudoku",

test('Correct solution',(suite) => {
  let clues = {"b1": "black", "c3": "black", "d2": "2", "a4": "4"};
  let data = {"a1": "1", "c1": "3", "d1": "4",
              "a2": "3", "b2": "4", "c2": "1",
              "a3": "2", "b3": "1", "d3": "3",
              "b4": "3", "c4": "2", "d4": "1"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Empty cell',(suite) => {
  let clues = {"b1": "black", "c3": "black", "d2": "2", "a4": "4"};
  // Cell d4 is not filled.
  let data = {"a1": "1", "c1": "3", "d1": "4",
              "a2": "3", "b2": "4", "c2": "1",
              "a3": "2", "b3": "1", "d3": "3",
              "b4": "3", "c4": "2"};

  assert("Empty cell response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All cells should be filled", errors: ["d4"]});
}),

test('Repeated digit in area',(suite) => {
  let clues = {"b1": "black", "c3": "black", "d2": "2", "a4": "4"};
  // 1 is twice in the top left area (a1 and a2).
  let data = {"a1": "1", "c1": "3", "d1": "4",
              "a2": "1", "b2": "4", "c2": "1",
              "a3": "2", "b3": "1", "d3": "3",
              "b4": "3", "c4": "2", "d4": "1"};

  assert("Repeated digit in area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be at most once in every area", errors: ["a1", "a2", "b1", "b2"]});
}),

test('Repeated digit in row',(suite) => {
  let clues = {"b1": "black", "c3": "black", "d2": "2", "a4": "4"};
  // Digits in c1 and c2 are exchanged: all areas are correct, but 1 is twice in the first row.
  let data = {"a1": "1", "c1": "1", "d1": "4",
              "a2": "3", "b2": "4", "c2": "3",
              "a3": "2", "b3": "1", "d3": "3",
              "b4": "3", "c4": "2", "d4": "1"};

  assert("Repeated digit in row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be at most once in every row", errors: ["a1", "b1", "c1", "d1"]});
}),

test('Repeated digit in column',(suite) => {
  let clues = {"b1": "black", "c3": "black", "d2": "2", "a4": "4"};
  // Digits in a2 and b2 are exchanged: all areas and rows are correct, but 4 is twice in the first column.
  let data = {"a1": "1", "c1": "3", "d1": "4",
              "a2": "4", "b2": "3", "c2": "1",
              "a3": "2", "b3": "1", "d3": "3",
              "b4": "3", "c4": "2", "d4": "1"};

  assert("Repeated digit in column response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be at most once in every column", errors: ["a1", "a2", "a3", "a4"]});
}),

);
