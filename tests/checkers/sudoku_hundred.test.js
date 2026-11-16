// Solution of the 6x6 puzzle (areas are 3x2) with required sum 46. Digits in brackets are in shaded cells
// (clue starts with "-"), adjacent shaded cells form one number: 41+5, 46, 5+41, 46, 12+34, 43+2+1.
//    6  [4] [1]  3   2  [5]
//    3   5   2   1  [4] [6]
//   [5]  6   3  [4] [1]  2
//    2   1  [4] [6]  5   3
//   [1] [2]  6   5  [3] [4]
//   [4] [3]  5  [2]  6  [1]
checkerTestSuite("sudoku_hundred", "Hundred Sudoku",

test('Correct solution',(suite) => {
  let clues = {"b1": "-", "c1": "-", "f1": "-", "e2": "-", "f2": "-", "a3": "-", "c3": "3", "d3": "-", "e3": "-", "c4": "-4", "d4": "-", "a5": "-", "b5": "-2", "e5": "-", "f5": "-", "a6": "-", "b6": "-", "d6": "-", "e6": "6", "f6": "-"};
  let data = {"a1": "6", "b1": "4", "c1": "1", "d1": "3", "e1": "2", "f1": "5",
              "a2": "3", "b2": "5", "c2": "2", "d2": "1", "e2": "4", "f2": "6",
              "a3": "5", "b3": "6", "d3": "4", "e3": "1", "f3": "2",
              "a4": "2", "b4": "1", "d4": "6", "e4": "5", "f4": "3",
              "a5": "1", "c5": "6", "d5": "5", "e5": "3", "f5": "4",
              "a6": "4", "b6": "3", "c6": "5", "d6": "2", "f6": "1"};

  assert("Correct solution response").that(Checker.check("6x6-46", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digit in area',(suite) => {
  let clues = {"b1": "-", "c1": "-", "f1": "-", "e2": "-", "f2": "-", "a3": "-", "c3": "3", "d3": "-", "e3": "-", "c4": "-4", "d4": "-", "a5": "-", "b5": "-2", "e5": "-", "f5": "-", "a6": "-", "b6": "-", "d6": "-", "e6": "6", "f6": "-"};
  // Digits in a1 and d1 are exchanged, so 3 is twice in the top left area.
  let data = {"a1": "3", "b1": "4", "c1": "1", "d1": "6", "e1": "2", "f1": "5",
              "a2": "3", "b2": "5", "c2": "2", "d2": "1", "e2": "4", "f2": "6",
              "a3": "5", "b3": "6", "d3": "4", "e3": "1", "f3": "2",
              "a4": "2", "b4": "1", "d4": "6", "e4": "5", "f4": "3",
              "a5": "1", "c5": "6", "d5": "5", "e5": "3", "f5": "4",
              "a6": "4", "b6": "3", "c6": "5", "d6": "2", "f6": "1"};

  assert("Repeated digit in area response").that(Checker.check("6x6-46", clues, data)).isEqualTo({status: "All digits should be exactly once in every area", errors: ["a1", "a2", "b1", "b2", "c1", "c2"]});
}),

test('Repeated digit in row',(suite) => {
  let clues = {"b1": "-", "c1": "-", "f1": "-", "e2": "-", "f2": "-", "a3": "-", "c3": "3", "d3": "-", "e3": "-", "c4": "-4", "d4": "-", "a5": "-", "b5": "-2", "e5": "-", "f5": "-", "a6": "-", "b6": "-", "d6": "-", "e6": "6", "f6": "-"};
  // Digits in a1 and a2 are exchanged: all areas are correct, but 3 is twice in the first row.
  let data = {"a1": "3", "b1": "4", "c1": "1", "d1": "3", "e1": "2", "f1": "5",
              "a2": "6", "b2": "5", "c2": "2", "d2": "1", "e2": "4", "f2": "6",
              "a3": "5", "b3": "6", "d3": "4", "e3": "1", "f3": "2",
              "a4": "2", "b4": "1", "d4": "6", "e4": "5", "f4": "3",
              "a5": "1", "c5": "6", "d5": "5", "e5": "3", "f5": "4",
              "a6": "4", "b6": "3", "c6": "5", "d6": "2", "f6": "1"};

  assert("Repeated digit in row response").that(Checker.check("6x6-46", clues, data)).isEqualTo({status: "All digits should be exactly once in every row", errors: ["a1", "b1", "c1", "d1", "e1", "f1"]});
}),

test('Repeated digit in column',(suite) => {
  let clues = {"b1": "-", "c1": "-", "f1": "-", "e2": "-", "f2": "-", "a3": "-", "c3": "3", "d3": "-", "e3": "-", "c4": "-4", "d4": "-", "a5": "-", "b5": "-2", "e5": "-", "f5": "-", "a6": "-", "b6": "-", "d6": "-", "e6": "6", "f6": "-"};
  // Digits in a1 and b1 are exchanged: all areas and rows are correct, but 4 is twice in the first column.
  let data = {"a1": "4", "b1": "6", "c1": "1", "d1": "3", "e1": "2", "f1": "5",
              "a2": "3", "b2": "5", "c2": "2", "d2": "1", "e2": "4", "f2": "6",
              "a3": "5", "b3": "6", "d3": "4", "e3": "1", "f3": "2",
              "a4": "2", "b4": "1", "d4": "6", "e4": "5", "f4": "3",
              "a5": "1", "c5": "6", "d5": "5", "e5": "3", "f5": "4",
              "a6": "4", "b6": "3", "c6": "5", "d6": "2", "f6": "1"};

  assert("Repeated digit in column response").that(Checker.check("6x6-46", clues, data)).isEqualTo({status: "All digits should be exactly once in every column", errors: ["a1", "a2", "a3", "a4", "a5", "a6"]});
}),

test('Wrong sum in row',(suite) => {
  let clues = {"b1": "-", "c1": "-", "f1": "-", "e2": "-", "f2": "-", "a3": "-", "c3": "3", "d3": "-", "e3": "-", "c4": "-4", "d4": "-", "a5": "-", "b5": "-2", "e5": "-", "f5": "-", "a6": "-", "b6": "-", "d6": "-", "e6": "6", "f6": "-"};
  // First two rows are exchanged. It is still valid sudoku, but the sum in the first row is 52+6=58.
  let data = {"a1": "3", "b1": "5", "c1": "2", "d1": "1", "e1": "4", "f1": "6",
              "a2": "6", "b2": "4", "c2": "1", "d2": "3", "e2": "2", "f2": "5",
              "a3": "5", "b3": "6", "d3": "4", "e3": "1", "f3": "2",
              "a4": "2", "b4": "1", "d4": "6", "e4": "5", "f4": "3",
              "a5": "1", "c5": "6", "d5": "5", "e5": "3", "f5": "4",
              "a6": "4", "b6": "3", "c6": "5", "d6": "2", "f6": "1"};

  assert("Wrong sum in row response").that(Checker.check("6x6-46", clues, data)).isEqualTo({status: "Sum of the numbers in the row in not correct", errors: ["b1", "c1", "f1"]});
}),

);
