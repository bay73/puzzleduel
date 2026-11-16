// Solution of the 6x6 puzzle (areas are 3x2). Each of two main diagonals contains exactly three different digits:
// 1, 3, 4 in a1-f6 and 2, 3, 4 in a6-f1.
//   1 2 4 5 6 3
//   6 3 5 4 2 1
//   3 6 1 2 4 5
//   4 5 2 1 3 6
//   5 4 6 3 1 2
//   2 1 3 6 5 4
checkerTestSuite("sudoku_antidiagonal", "Antidiagonal Sudoku",

test('Correct solution',(suite) => {
  let clues = {"e1": "6", "c2": "5", "b3": "6", "d4": "1", "a5": "5", "f5": "2", "c6": "3"};
  let data = {"a1": "1", "b1": "2", "c1": "4", "d1": "5", "f1": "3",
              "a2": "6", "b2": "3", "d2": "4", "e2": "2", "f2": "1",
              "a3": "3", "c3": "1", "d3": "2", "e3": "4", "f3": "5",
              "a4": "4", "b4": "5", "c4": "2", "e4": "3", "f4": "6",
              "b5": "4", "c5": "6", "d5": "3", "e5": "1",
              "a6": "2", "b6": "1", "d6": "6", "e6": "5", "f6": "4"};

  assert("Correct solution response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digit in area',(suite) => {
  let clues = {"e1": "6", "c2": "5", "b3": "6", "d4": "1", "a5": "5", "f5": "2", "c6": "3"};
  // Digits in a1 and d1 are exchanged, so 5 is twice in the top left area.
  let data = {"a1": "5", "b1": "2", "c1": "4", "d1": "1", "f1": "3",
              "a2": "6", "b2": "3", "d2": "4", "e2": "2", "f2": "1",
              "a3": "3", "c3": "1", "d3": "2", "e3": "4", "f3": "5",
              "a4": "4", "b4": "5", "c4": "2", "e4": "3", "f4": "6",
              "b5": "4", "c5": "6", "d5": "3", "e5": "1",
              "a6": "2", "b6": "1", "d6": "6", "e6": "5", "f6": "4"};

  assert("Repeated digit in area response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "All digits should be exactly once in every area", errors: ["a1", "a2", "b1", "b2", "c1", "c2"]});
}),

test('Repeated digit in row',(suite) => {
  let clues = {"e1": "6", "c2": "5", "b3": "6", "d4": "1", "a5": "5", "f5": "2", "c6": "3"};
  // Digits in a1 and a2 are exchanged: all areas are correct, but 6 is twice in the first row.
  let data = {"a1": "6", "b1": "2", "c1": "4", "d1": "5", "f1": "3",
              "a2": "1", "b2": "3", "d2": "4", "e2": "2", "f2": "1",
              "a3": "3", "c3": "1", "d3": "2", "e3": "4", "f3": "5",
              "a4": "4", "b4": "5", "c4": "2", "e4": "3", "f4": "6",
              "b5": "4", "c5": "6", "d5": "3", "e5": "1",
              "a6": "2", "b6": "1", "d6": "6", "e6": "5", "f6": "4"};

  assert("Repeated digit in row response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "All digits should be exactly once in every row", errors: ["a1", "b1", "c1", "d1", "e1", "f1"]});
}),

test('Repeated digit in column',(suite) => {
  let clues = {"e1": "6", "c2": "5", "b3": "6", "d4": "1", "a5": "5", "f5": "2", "c6": "3"};
  // Digits in a1 and b1 are exchanged: all areas and rows are correct, but 2 is twice in the first column.
  let data = {"a1": "2", "b1": "1", "c1": "4", "d1": "5", "f1": "3",
              "a2": "6", "b2": "3", "d2": "4", "e2": "2", "f2": "1",
              "a3": "3", "c3": "1", "d3": "2", "e3": "4", "f3": "5",
              "a4": "4", "b4": "5", "c4": "2", "e4": "3", "f4": "6",
              "b5": "4", "c5": "6", "d5": "3", "e5": "1",
              "a6": "2", "b6": "1", "d6": "6", "e6": "5", "f6": "4"};

  assert("Repeated digit in column response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "All digits should be exactly once in every column", errors: ["a1", "a2", "a3", "a4", "a5", "a6"]});
}),

test('Four different digits in the diagonal a1-f6',(suite) => {
  // Valid sudoku, the diagonal a6-f1 contains three different digits (5, 1, 2),
  // but the diagonal a1-f6 contains four: 1, 3, 6, 5.
  //   1 2 4 3 6 5
  //   6 3 5 1 2 4
  //   3 6 1 5 4 2
  //   4 5 2 6 3 1
  //   2 1 3 4 5 6
  //   5 4 6 2 1 3
  let clues = {};
  let data = {
    "a1": "1", "b1": "2", "c1": "4", "d1": "3", "e1": "6", "f1": "5",
    "a2": "6", "b2": "3", "c2": "5", "d2": "1", "e2": "2", "f2": "4",
    "a3": "3", "b3": "6", "c3": "1", "d3": "5", "e3": "4", "f3": "2",
    "a4": "4", "b4": "5", "c4": "2", "d4": "6", "e4": "3", "f4": "1",
    "a5": "2", "b5": "1", "c5": "3", "d5": "4", "e5": "5", "f5": "6",
    "a6": "5", "b6": "4", "c6": "6", "d6": "2", "e6": "1", "f6": "3",
  };

  assert("Wrong diagonal a1-f6 response").that(Checker.check("6x6", clues, data)).isEqualTo(
    {status: "The diagonal should contain exactly three different digits", errors: ["a1", "b2", "c3", "d4", "e5", "f6"]});
}),

test('Four different digits in the diagonal a6-f1',(suite) => {
  // Valid sudoku, the diagonal a1-f6 contains three different digits (1, 3, 4),
  // but the diagonal a6-f1 contains four: 5, 1, 2, 6.
  //   1 2 4 5 3 6
  //   6 3 5 4 1 2
  //   3 6 1 2 5 4
  //   4 5 2 1 6 3
  //   2 1 3 6 4 5
  //   5 4 6 3 2 1
  let clues = {};
  let data = {
    "a1": "1", "b1": "2", "c1": "4", "d1": "5", "e1": "3", "f1": "6",
    "a2": "6", "b2": "3", "c2": "5", "d2": "4", "e2": "1", "f2": "2",
    "a3": "3", "b3": "6", "c3": "1", "d3": "2", "e3": "5", "f3": "4",
    "a4": "4", "b4": "5", "c4": "2", "d4": "1", "e4": "6", "f4": "3",
    "a5": "2", "b5": "1", "c5": "3", "d5": "6", "e5": "4", "f5": "5",
    "a6": "5", "b6": "4", "c6": "6", "d6": "3", "e6": "2", "f6": "1",
  };

  assert("Wrong diagonal a6-f1 response").that(Checker.check("6x6", clues, data)).isEqualTo(
    {status: "The diagonal should contain exactly three different digits", errors: ["a6", "b5", "c4", "d3", "e2", "f1"]});
}),

);
