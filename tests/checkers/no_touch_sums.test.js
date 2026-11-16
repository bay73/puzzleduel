// Puzzle 4x4 with digits 1-3 and its solution (sums are given for some rows and for all columns):
//   2 . 1 .  3      a1 b1 c1 d1
//   . . . .         a2 b2 c2 d2
//   . 3 . 1  4      a3 b3 c3 d3
//   . . . .         a4 b4 c4 d4
//   2 3 1 1
checkerTestSuite("no_touch_sums", "No touch sums",

test('Correct solution',(suite) => {
  let clues = {"bottom": ["2", "3", "1", "1"], "right": ["3", null, "4", null]};
  let data = {"a1": "2", "c1": "1", "b3": "3", "d3": "1"};

  assert("Correct solution response").that(Checker.check("4x4-3", clues, data)).isEqualTo({status: "OK"});
}),

test('Digits touch diagonally',(suite) => {
  let clues = {"bottom": ["2", "3", "1", "1"], "right": ["3", null, "4", null]};
  // Digit 3 is placed to b2 instead of b3 and touches the digits in a1 and c1 by corner.
  let data = {"a1": "2", "c1": "1", "b2": "3", "d3": "1"};

  assert("Digits touch response").that(Checker.check("4x4-3", clues, data)).isEqualTo({status: "Cells with digits shouldn't touch", errors: ["a1", "b2"]});
}),

test('Digits touch by side',(suite) => {
  let clues = {"bottom": ["2", "3", "1", "1"], "right": ["3", null, "4", null]};
  // Extra digit in c3 shares sides with the digits in b3 and d3.
  let data = {"a1": "2", "c1": "1", "b3": "3", "c3": "1", "d3": "1"};

  assert("Digits touch response").that(Checker.check("4x4-3", clues, data)).isEqualTo({status: "Cells with digits shouldn't touch", errors: ["b3", "c3"]});
}),

test('Wrong sum in column',(suite) => {
  let clues = {"bottom": ["2", "3", "1", "1"], "right": ["3", null, "4", null]};
  // Digit in c1 is 2, but the sum in the column c should be 1.
  let data = {"a1": "2", "c1": "2", "b3": "3", "d3": "1"};

  assert("Wrong column sum response").that(Checker.check("4x4-3", clues, data)).isEqualTo({status: "Wrong sum for the column", errors: ["c1", "c2", "c3", "c4"]});
}),

test('Wrong sum in row',(suite) => {
  let clues = {"bottom": ["2", "3", "1", "1"], "right": ["3", null, "4", null]};
  // Digit 1 is placed to d4 instead of d3: sum in the third row is 3 instead of 4.
  let data = {"a1": "2", "c1": "1", "b3": "3", "d4": "1"};

  assert("Wrong row sum response").that(Checker.check("4x4-3", clues, data)).isEqualTo({status: "Wrong sum for the row", errors: ["a3", "b3", "c3", "d3"]});
}),

);
