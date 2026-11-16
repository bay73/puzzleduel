// Solution of the 4x4 puzzle:
//   1 2 3 4      a1 b1 c1 d1
//   3 4 1 2      a2 b2 c2 d2
//   2 1 4 3      a3 b3 c3 d3
//   4 3 2 1      a4 b4 c4 d4
// Digit 2 (b1, d2, a3, c4) does not repeat on any diagonal, like queens which do not attack each other.
checkerTestSuite("sudoku_queen", "Queen sudoku",

test('Correct solution',(suite) => {
  let clues = {"a1": "1", "c1": "3", "d2": "2"};
  let data = {
    "b1": "2", "d1": "4",
    "a2": "3", "b2": "4", "c2": "1",
    "a3": "2", "b3": "1", "c3": "4", "d3": "3",
    "a4": "4", "b4": "3", "c4": "2", "d4": "1",
  };

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digits in area',(suite) => {
  let clues = {"a1": "1", "c1": "3", "d2": "2"};
  // d4 is 2 instead of 1, so the bottom right area contains 2 twice.
  let data = {
    "b1": "2", "d1": "4",
    "a2": "3", "b2": "4", "c2": "1",
    "a3": "2", "b3": "1", "c3": "4", "d3": "3",
    "a4": "4", "b4": "3", "c4": "2", "d4": "2",
  };

  assert("Repeated digits in area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every area", errors: ["c3", "c4", "d3", "d4"]});
}),

test('Repeated digits in row',(suite) => {
  let clues = {"a1": "1", "c1": "3", "d2": "2"};
  // d3 and d4 are swapped: all areas are still correct, but the third row contains 1 twice.
  let data = {
    "b1": "2", "d1": "4",
    "a2": "3", "b2": "4", "c2": "1",
    "a3": "2", "b3": "1", "c3": "4", "d3": "1",
    "a4": "4", "b4": "3", "c4": "2", "d4": "3",
  };

  assert("Repeated digits in row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every row", errors: ["a3", "b3", "c3", "d3"]});
}),

test('Repeated digits in column',(suite) => {
  let clues = {"a1": "1", "c1": "3", "d2": "2"};
  // c3 and d3 are swapped: all areas and rows are still correct, but column c contains 3 twice.
  let data = {
    "b1": "2", "d1": "4",
    "a2": "3", "b2": "4", "c2": "1",
    "a3": "2", "b3": "1", "c3": "3", "d3": "4",
    "a4": "4", "b4": "3", "c4": "2", "d4": "1",
  };

  assert("Repeated digits in column response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every column", errors: ["c1", "c2", "c3", "c4"]});
}),

test('Every digit repeats on a diagonal',(suite) => {
  let clues = {"a1": "1", "c1": "3", "d2": "2"};
  // Correct sudoku, but every digit has exactly one pair on the same diagonal:
  // 1 - c2 and d3, 2 - d2 and c3, 3 - a2 and b3, 4 - b2 and a3.
  let data = {
    "b1": "2", "d1": "4",
    "a2": "3", "b2": "4", "c2": "1",
    "a3": "4", "b3": "3", "c3": "2", "d3": "1",
    "a4": "2", "b4": "1", "c4": "4", "d4": "3",
  };

  assert("Every digit repeats on a diagonal response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be a digits which does not repeat on any diagonal", errors: ["c2", "d3", "d2", "c3", "a2", "b3", "b2", "a3"]});
}),

);
