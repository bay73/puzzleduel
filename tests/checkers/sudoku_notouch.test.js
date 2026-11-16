// Solution of the 6x6 puzzle (areas are 3x2 rectangles):
//   1 2 3 4 5 6      a1 b1 c1 d1 e1 f1
//   4 5 6 1 2 3      a2 b2 c2 d2 e2 f2
//   2 1 4 3 6 5      a3 b3 c3 d3 e3 f3
//   3 6 5 2 1 4      a4 b4 c4 d4 e4 f4
//   5 4 1 6 3 2      a5 b5 c5 d5 e5 f5
//   6 3 2 5 4 1      a6 b6 c6 d6 e6 f6
checkerTestSuite("sudoku_notouch", "No touch sudoku",

test('Correct solution',(suite) => {
  let clues = {"a1": "1", "f1": "6", "e2": "2", "a3": "2"};
  let data = {
    "b1": "2", "c1": "3", "d1": "4", "e1": "5",
    "a2": "4", "b2": "5", "c2": "6", "d2": "1", "f2": "3",
    "b3": "1", "c3": "4", "d3": "3", "e3": "6", "f3": "5",
    "a4": "3", "b4": "6", "c4": "5", "d4": "2", "e4": "1", "f4": "4",
    "a5": "5", "b5": "4", "c5": "1", "d5": "6", "e5": "3", "f5": "2",
    "a6": "6", "b6": "3", "c6": "2", "d6": "5", "e6": "4", "f6": "1",
  };

  assert("Correct solution response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digits in column',(suite) => {
  let clues = {"a1": "1", "f1": "6", "e2": "2", "a3": "2"};
  // b1 and c1 are swapped: all rows and areas are still correct, but column b contains 3 twice.
  let data = {
    "b1": "3", "c1": "2", "d1": "4", "e1": "5",
    "a2": "4", "b2": "5", "c2": "6", "d2": "1", "f2": "3",
    "b3": "1", "c3": "4", "d3": "3", "e3": "6", "f3": "5",
    "a4": "3", "b4": "6", "c4": "5", "d4": "2", "e4": "1", "f4": "4",
    "a5": "5", "b5": "4", "c5": "1", "d5": "6", "e5": "3", "f5": "2",
    "a6": "6", "b6": "3", "c6": "2", "d6": "5", "e6": "4", "f6": "1",
  };

  assert("Repeated digits in column response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "All digits should be exactly once in every column", errors: ["b1", "b2", "b3", "b4", "b5", "b6"]});
}),

test('Repeated digits in row',(suite) => {
  let clues = {"a1": "1", "f1": "6", "e2": "2", "a3": "2"};
  // b1 and b2 are swapped: all columns and areas are still correct, but the first row contains 5 twice.
  let data = {
    "b1": "5", "c1": "3", "d1": "4", "e1": "5",
    "a2": "4", "b2": "2", "c2": "6", "d2": "1", "f2": "3",
    "b3": "1", "c3": "4", "d3": "3", "e3": "6", "f3": "5",
    "a4": "3", "b4": "6", "c4": "5", "d4": "2", "e4": "1", "f4": "4",
    "a5": "5", "b5": "4", "c5": "1", "d5": "6", "e5": "3", "f5": "2",
    "a6": "6", "b6": "3", "c6": "2", "d6": "5", "e6": "4", "f6": "1",
  };

  assert("Repeated digits in row response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "All digits should be exactly once in every row", errors: ["a1", "b1", "c1", "d1", "e1", "f1"]});
}),

test('Repeated digits in area',(suite) => {
  let clues = {"a1": "1", "f1": "6", "e2": "2", "a3": "2"};
  // Rows 4 and 5 are swapped: all rows and columns are still correct, but area a3-c4 contains 1 and 4 twice.
  let data = {
    "b1": "2", "c1": "3", "d1": "4", "e1": "5",
    "a2": "4", "b2": "5", "c2": "6", "d2": "1", "f2": "3",
    "b3": "1", "c3": "4", "d3": "3", "e3": "6", "f3": "5",
    "a4": "5", "b4": "4", "c4": "1", "d4": "6", "e4": "3", "f4": "2",
    "a5": "3", "b5": "6", "c5": "5", "d5": "2", "e5": "1", "f5": "4",
    "a6": "6", "b6": "3", "c6": "2", "d6": "5", "e6": "4", "f6": "1",
  };

  assert("Repeated digits in area response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "All digits should be exactly once in every area", errors: ["a3", "a4", "b3", "b4", "c3", "c4"]});
}),

test('Same digits touch diagonally',(suite) => {
  let clues = {"a1": "1", "f1": "6", "e2": "2", "a3": "2"};
  // Correct sudoku, but there is 1 both in d2 and c3 (it is the only pair of touching equal digits):
  //   1 2 3 4 5 6
  //   4 5 6 1 2 3
  //   2 3 1 5 6 4
  //   5 6 4 2 3 1
  //   3 1 5 6 4 2
  //   6 4 2 3 1 5
  let data = {
    "b1": "2", "c1": "3", "d1": "4", "e1": "5",
    "a2": "4", "b2": "5", "c2": "6", "d2": "1", "f2": "3",
    "b3": "3", "c3": "1", "d3": "5", "e3": "6", "f3": "4",
    "a4": "5", "b4": "6", "c4": "4", "d4": "2", "e4": "3", "f4": "1",
    "a5": "3", "b5": "1", "c5": "5", "d5": "6", "e5": "4", "f5": "2",
    "a6": "6", "b6": "4", "c6": "2", "d6": "3", "e6": "1", "f6": "5",
  };

  assert("Same digits touch diagonally response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "Two cells sharing a point should contain different digits", errors: ["d2", "c3"]});
}),

);
