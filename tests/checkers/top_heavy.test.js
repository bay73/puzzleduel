// Puzzle 4x4 with digits 1-3 (dimension "4x4-3") and its solution (x is an empty cell):
//   3 2 1 x      a1 b1 c1 d1
//   2 1 x 3      a2 b2 c2 d2
//   1 x 3 2      a3 b3 c3 d3
//   x 3 2 1      a4 b4 c4 d4
// Clues are 3 in a1, 3 in c3 and the cross in d1.
checkerTestSuite("top_heavy", "Top Heavy",

test('Correct solution',(suite) => {
  let clues = {"a1": "3", "c3": "3", "d1": "cross"};
  let data = {"b1": "2", "c1": "1", "a2": "2", "b2": "1", "d2": "3", "a3": "1", "d3": "2", "b4": "3", "c4": "2", "d4": "1"};

  assert("Correct solution response").that(Checker.check("4x4-3", clues, data)).isEqualTo({status: "OK"});
}),

test('Bigger digit below',(suite) => {
  let clues = {"a1": "3", "c3": "3", "d1": "cross"};
  // Digits in a2 and a3 are swapped: 1 in a2 is above 2 in a3.
  let data = {"b1": "2", "c1": "1", "a2": "1", "b2": "1", "d2": "3", "a3": "2", "d3": "2", "b4": "3", "c4": "2", "d4": "1"};

  assert("Bigger digit below response").that(Checker.check("4x4-3", clues, data)).isEqualTo({status: "Bigger number can't be in the below adjacent cell", errors: ["a2", "a3"]});
}),

test('Digit is repeated in the column',(suite) => {
  let clues = {"a1": "3", "c3": "3", "d1": "cross"};
  // Digit 2 in d4 instead of 1: column d contains 2 twice and doesn't contain 1.
  let data = {"b1": "2", "c1": "1", "a2": "2", "b2": "1", "d2": "3", "a3": "1", "d3": "2", "b4": "3", "c4": "2", "d4": "2"};

  assert("Wrong column response").that(Checker.check("4x4-3", clues, data)).isEqualTo({status: "All digits should be exactly once in every column", errors: ["d1", "d2", "d3", "d4"]});
}),

test('Digit is repeated in the row',(suite) => {
  let clues = {"a1": "3", "c3": "3", "d1": "cross"};
  // Column b is filled as 3-2-1-empty (the same as column a): the column is correct, but the first row contains 3 twice.
  let data = {"b1": "3", "c1": "1", "a2": "2", "b2": "2", "d2": "3", "a3": "1", "b3": "1", "d3": "2", "c4": "2", "d4": "1"};

  assert("Wrong row response").that(Checker.check("4x4-3", clues, data)).isEqualTo({status: "All digits should be exactly once in every row", errors: ["a1", "b1", "c1", "d1"]});
}),

);
