// Solution of the 6x6 puzzle (areas are 3x2). All cells with digits from 3 to 6 are connected:
//   5 1 2 3 4 6
//   4 3 6 1 2 5
//   2 4 1 6 5 3
//   3 6 5 4 1 2
//   6 5 4 2 3 1
//   1 2 3 5 6 4
checkerTestSuite("sudoku_citywalk", "Citywalk Sudoku",

test('Correct solution',(suite) => {
  let clues = {"c3": "1", "f3": "3", "b4": "6", "e4": "1", "d5": "2", "a6": "1"};
  let data = {"a1": "5", "b1": "1", "c1": "2", "d1": "3", "e1": "4", "f1": "6",
              "a2": "4", "b2": "3", "c2": "6", "d2": "1", "e2": "2", "f2": "5",
              "a3": "2", "b3": "4", "d3": "6", "e3": "5",
              "a4": "3", "c4": "5", "d4": "4", "f4": "2",
              "a5": "6", "b5": "5", "c5": "4", "e5": "3", "f5": "1",
              "b6": "2", "c6": "3", "d6": "5", "e6": "6", "f6": "4"};

  assert("Correct solution response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digit in area',(suite) => {
  let clues = {"c3": "1", "f3": "3", "b4": "6", "e4": "1", "d5": "2", "a6": "1"};
  // Digits in a1 and d1 are exchanged, so 3 is twice in the top left area.
  let data = {"a1": "3", "b1": "1", "c1": "2", "d1": "5", "e1": "4", "f1": "6",
              "a2": "4", "b2": "3", "c2": "6", "d2": "1", "e2": "2", "f2": "5",
              "a3": "2", "b3": "4", "d3": "6", "e3": "5",
              "a4": "3", "c4": "5", "d4": "4", "f4": "2",
              "a5": "6", "b5": "5", "c5": "4", "e5": "3", "f5": "1",
              "b6": "2", "c6": "3", "d6": "5", "e6": "6", "f6": "4"};

  assert("Repeated digit in area response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "All digits should be exactly once in every area", errors: ["a1", "a2", "b1", "b2", "c1", "c2"]});
}),

test('Repeated digit in row',(suite) => {
  let clues = {"c3": "1", "f3": "3", "b4": "6", "e4": "1", "d5": "2", "a6": "1"};
  // Digits in a1 and a2 are exchanged: all areas are correct, but 4 is twice in the first row.
  let data = {"a1": "4", "b1": "1", "c1": "2", "d1": "3", "e1": "4", "f1": "6",
              "a2": "5", "b2": "3", "c2": "6", "d2": "1", "e2": "2", "f2": "5",
              "a3": "2", "b3": "4", "d3": "6", "e3": "5",
              "a4": "3", "c4": "5", "d4": "4", "f4": "2",
              "a5": "6", "b5": "5", "c5": "4", "e5": "3", "f5": "1",
              "b6": "2", "c6": "3", "d6": "5", "e6": "6", "f6": "4"};

  assert("Repeated digit in row response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "All digits should be exactly once in every row", errors: ["a1", "b1", "c1", "d1", "e1", "f1"]});
}),

test('Repeated digit in column',(suite) => {
  let clues = {"c3": "1", "f3": "3", "b4": "6", "e4": "1", "d5": "2", "a6": "1"};
  // Digits in a1 and b1 are exchanged: all areas and rows are correct, but 1 is twice in the first column.
  let data = {"a1": "1", "b1": "5", "c1": "2", "d1": "3", "e1": "4", "f1": "6",
              "a2": "4", "b2": "3", "c2": "6", "d2": "1", "e2": "2", "f2": "5",
              "a3": "2", "b3": "4", "d3": "6", "e3": "5",
              "a4": "3", "c4": "5", "d4": "4", "f4": "2",
              "a5": "6", "b5": "5", "c5": "4", "e5": "3", "f5": "1",
              "b6": "2", "c6": "3", "d6": "5", "e6": "6", "f6": "4"};

  assert("Repeated digit in column response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "All digits should be exactly once in every column", errors: ["a1", "a2", "a3", "a4", "a5", "a6"]});
}),

test('Not connected',(suite) => {
  let clues = {"c3": "1", "f3": "3", "b4": "6", "e4": "1", "d5": "2", "a6": "1"};
  // First two rows are exchanged. It is still valid sudoku, but cells a1, b1, c1, a2 (digits 4, 3, 6, 5)
  // are surrounded by 1 and 2 and separated from other cells with big digits.
  let data = {"a1": "4", "b1": "3", "c1": "6", "d1": "1", "e1": "2", "f1": "5",
              "a2": "5", "b2": "1", "c2": "2", "d2": "3", "e2": "4", "f2": "6",
              "a3": "2", "b3": "4", "d3": "6", "e3": "5",
              "a4": "3", "c4": "5", "d4": "4", "f4": "2",
              "a5": "6", "b5": "5", "c5": "4", "e5": "3", "f5": "1",
              "b6": "2", "c6": "3", "d6": "5", "e6": "6", "f6": "4"};

  assert("Not connected response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "Cells with digits 3,4,5,6,7 should form single connected area", errors: ["a1", "b1", "c1", "a2"]});
}),

);
