// Puzzle 4x4 (digits 1-2, each digit two times in every row and column) and its solution.
// Outside clue is the sum of digits between the first digit from this side and its second copy.
//       2 . . 4
//   4   1 2 2 1   .       a1 b1 c1 d1
//   2   2 1 1 2   .       a2 b2 c2 d2
//   0   1 1 2 2   .       a3 b3 c3 d3
//   .   2 2 1 1   0       a4 b4 c4 d4
//       1 . . .
// Digit 1 in a1 is given.
checkerTestSuite("x_sandwich", "X-Sandwich",

test('Correct solution',(suite) => {
  let clues = {"a1": "1", "top": ["2", null, null, "4"], "bottom": ["1", null, null, null], "left": ["4", "2", "0", null], "right": [null, null, null, "0"]};
  let data = {
    "b1": "2", "c1": "2", "d1": "1",
    "a2": "2", "b2": "1", "c2": "1", "d2": "2",
    "a3": "1", "b3": "1", "c3": "2", "d3": "2",
    "a4": "2", "b4": "2", "c4": "1", "d4": "1"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Digit three times in the row',(suite) => {
  let clues = {"a1": "1", "top": ["2", null, null, "4"], "bottom": ["1", null, null, null], "left": ["4", "2", "0", null], "right": [null, null, null, "0"]};
  // Digit 2 in d1 instead of 1: the first row contains 2 three times.
  let data = {
    "b1": "2", "c1": "2", "d1": "2",
    "a2": "2", "b2": "1", "c2": "1", "d2": "2",
    "a3": "1", "b3": "1", "c3": "2", "d3": "2",
    "a4": "2", "b4": "2", "c4": "1", "d4": "1"};

  assert("Wrong row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly two times in every row", errors: ["a1", "b1", "c1", "d1"]});
}),

test('Empty cell',(suite) => {
  let clues = {"a1": "1", "top": ["2", null, null, "4"], "bottom": ["1", null, null, null], "left": ["4", "2", "0", null], "right": [null, null, null, "0"]};
  // Cell c2 is empty, the second row contains 1 only once.
  let data = {
    "b1": "2", "c1": "2", "d1": "1",
    "a2": "2", "b2": "1", "d2": "2",
    "a3": "1", "b3": "1", "c3": "2", "d3": "2",
    "a4": "2", "b4": "2", "c4": "1", "d4": "1"};

  assert("Empty cell response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly two times in every row", errors: ["a2", "b2", "c2", "d2"]});
}),

test('Digit three times in the column',(suite) => {
  let clues = {"a1": "1", "top": ["2", null, null, "4"], "bottom": ["1", null, null, null], "left": ["4", "2", "0", null], "right": [null, null, null, "0"]};
  // Digits in b3 and c3 are swapped: rows are still correct, but column b contains 2 three times.
  let data = {
    "b1": "2", "c1": "2", "d1": "1",
    "a2": "2", "b2": "1", "c2": "1", "d2": "2",
    "a3": "1", "b3": "2", "c3": "1", "d3": "2",
    "a4": "2", "b4": "2", "c4": "1", "d4": "1"};

  assert("Wrong column response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly two times in every column", errors: ["b1", "b2", "b3", "b4"]});
}),

test('Wrong sum for the column clue',(suite) => {
  let clues = {"a1": "1", "top": ["2", null, null, "4"], "bottom": ["1", null, null, null], "left": ["4", "2", "0", null], "right": [null, null, null, "0"]};
  // Rows 2 and 3 are swapped: column a is 1-1-2-2, there is nothing between two 1's, but the top clue is 2.
  let data = {
    "b1": "2", "c1": "2", "d1": "1",
    "a2": "1", "b2": "1", "c2": "2", "d2": "2",
    "a3": "2", "b3": "1", "c3": "1", "d3": "2",
    "a4": "2", "b4": "2", "c4": "1", "d4": "1"};

  assert("Wrong column sum response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Wrong sum in the column", errors: ["a1", "a2"]});
}),

test('Wrong sum for the row clue',(suite) => {
  let clues = {"a1": "1", "top": ["2", null, null, "4"], "bottom": ["1", null, null, null], "left": ["4", "2", "0", null], "right": [null, null, null, "0"]};
  // Columns b and c are swapped: row 3 is 1-2-1-2, there is 2 between two 1's, but the left clue is 0.
  let data = {
    "b1": "2", "c1": "2", "d1": "1",
    "a2": "2", "b2": "1", "c2": "1", "d2": "2",
    "a3": "1", "b3": "2", "c3": "1", "d3": "2",
    "a4": "2", "b4": "1", "c4": "2", "d4": "1"};

  assert("Wrong row sum response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Wrong sum in the row", errors: ["a3", "b3", "c3"]});
}),

);
