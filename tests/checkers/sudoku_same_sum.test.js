// Solution of the 4x4 puzzle:
//   2 3 1 4      a1 b1 c1 d1
//   1 4 2 3      a2 b2 c2 d2
//   3 1 4 2      a3 b3 c3 d3
//   4 2 3 1      a4 b4 c4 d4
// Grey regions are a1-b1 (2+3), c2-d2 (2+3) and b4-c4 (2+3), sum of digits in each of them is 5.
// Clue "-" is an empty grey cell, clue "-2" is a grey cell with the given digit 2.
checkerTestSuite("sudoku_same_sum", "Same sum sudoku",

test('Correct solution',(suite) => {
  let clues = {"a1": "-2", "b1": "-", "c2": "-", "d2": "-", "a3": "3", "b4": "-", "c4": "-"};
  let data = {
    "b1": "3", "c1": "1", "d1": "4",
    "a2": "1", "b2": "4", "c2": "2", "d2": "3",
    "b3": "1", "c3": "4", "d3": "2",
    "a4": "4", "b4": "2", "c4": "3", "d4": "1",
  };

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digits in area',(suite) => {
  let clues = {"a1": "-2", "b1": "-", "c2": "-", "d2": "-", "a3": "3", "b4": "-", "c4": "-"};
  // d4 is 2 instead of 1, so the bottom right area contains 2 twice.
  let data = {
    "b1": "3", "c1": "1", "d1": "4",
    "a2": "1", "b2": "4", "c2": "2", "d2": "3",
    "b3": "1", "c3": "4", "d3": "2",
    "a4": "4", "b4": "2", "c4": "3", "d4": "2",
  };

  assert("Repeated digits in area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every area", errors: ["c3", "c4", "d3", "d4"]});
}),

test('Repeated digits in row',(suite) => {
  let clues = {"a1": "-2", "b1": "-", "c2": "-", "d2": "-", "a3": "3", "b4": "-", "c4": "-"};
  // d3 and d4 are swapped: all areas are still correct, but the third row contains 1 twice.
  let data = {
    "b1": "3", "c1": "1", "d1": "4",
    "a2": "1", "b2": "4", "c2": "2", "d2": "3",
    "b3": "1", "c3": "4", "d3": "1",
    "a4": "4", "b4": "2", "c4": "3", "d4": "2",
  };

  assert("Repeated digits in row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every row", errors: ["a3", "b3", "c3", "d3"]});
}),

test('Repeated digits in column',(suite) => {
  let clues = {"a1": "-2", "b1": "-", "c2": "-", "d2": "-", "a3": "3", "b4": "-", "c4": "-"};
  // c3 and d3 are swapped: all areas and rows are still correct, but column c contains 2 twice.
  let data = {
    "b1": "3", "c1": "1", "d1": "4",
    "a2": "1", "b2": "4", "c2": "2", "d2": "3",
    "b3": "1", "c3": "2", "d3": "4",
    "a4": "4", "b4": "2", "c4": "3", "d4": "1",
  };

  assert("Repeated digits in column response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every column", errors: ["c1", "c2", "c3", "c4"]});
}),

test('Different sums in grey regions',(suite) => {
  let clues = {"a1": "-2", "b1": "-", "c2": "-", "d2": "-", "a3": "3", "b4": "-", "c4": "-"};
  // Columns c and d of the solution are swapped: it is still a correct sudoku,
  // but the sum in region b4-c4 is 2+1=3, while the sum in region a1-b1 is 5.
  let data = {
    "b1": "3", "c1": "4", "d1": "1",
    "a2": "1", "b2": "4", "c2": "3", "d2": "2",
    "b3": "1", "c3": "2", "d3": "4",
    "a4": "4", "b4": "2", "c4": "1", "d4": "3",
  };

  assert("Different sums in grey regions response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Sum of digits in each grey region should be the same", errors: ["b4", "c4", "a1", "b1"]});
}),

);
