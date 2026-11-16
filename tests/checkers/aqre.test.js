// Puzzle 4x4 (areas are 2x2 quadrants, the number is the clue of the area, x is a cross)
// and its solution (# is a shaded cell):
//   2 . | . .      # # # .
//   . . | . .      . . # #
//   ----+----      . # # .
//   3 . | 1 .      # # . .
//   . . | . x
checkerTestSuite("aqre", "Aqre",

test('Correct solution',(suite) => {
  let clues = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "c2", "d2"], ["a3", "b3", "a4", "b4"], ["c3", "d3", "c4", "d4"]],
               "a1": "2", "a3": "3", "c3": "1", "d4": "cross"};
  let data = {"a1": "1", "b1": "1", "c1": "1", "c2": "1", "d2": "1", "b3": "1", "c3": "1", "a4": "1", "b4": "1"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Shaded area is not connected',(suite) => {
  let clues = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "c2", "d2"], ["a3", "b3", "a4", "b4"], ["c3", "d3", "c4", "d4"]],
               "a1": "2", "a3": "3", "c3": "1", "d4": "cross"};
  // Cell b3 is not shaded, so a4 and b4 are separated from the others.
  let data = {"a1": "1", "b1": "1", "c1": "1", "c2": "1", "d2": "1", "c3": "1", "a4": "1", "b4": "1"};

  assert("Not connected response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Shaded area should be connected"});
}),

test('Wrong number of shaded cells in the area',(suite) => {
  let clues = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "c2", "d2"], ["a3", "b3", "a4", "b4"], ["c3", "d3", "c4", "d4"]],
               "a1": "2", "a3": "3", "c3": "1", "d4": "cross"};
  // Extra shaded cell a2: three shaded cells in the top left area with clue 2.
  let data = {"a1": "1", "b1": "1", "c1": "1", "a2": "1", "c2": "1", "d2": "1", "b3": "1", "c3": "1", "a4": "1", "b4": "1"};

  assert("Wrong clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["a1", "b1", "a2", "b2"]});
}),

test('Four shaded cells in a row',(suite) => {
  let clues = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "c2", "d2"], ["a3", "b3", "a4", "b4"], ["c3", "d3", "c4", "d4"]],
               "a1": "2", "a3": "3", "c3": "1", "d4": "cross"};
  // Extra shaded cell d1: the whole first row is shaded.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "c2": "1", "d2": "1", "b3": "1", "c3": "1", "a4": "1", "b4": "1"};

  assert("Four shaded response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Four cells of the same color shouldn't form a continious line", errors: ["a1", "b1", "c1", "d1"]});
}),

test('Four unshaded cells in a column',(suite) => {
  let clues = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "c2", "d2"], ["a3", "b3", "a4", "b4"], ["c3", "d3", "c4", "d4"]],
               "a1": "2", "a3": "3", "c3": "1", "d4": "cross"};
  // Cell d2 is not shaded: the whole column d is unshaded.
  let data = {"a1": "1", "b1": "1", "c1": "1", "c2": "1", "b3": "1", "c3": "1", "a4": "1", "b4": "1"};

  assert("Four unshaded response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Four cells of the same color shouldn't form a continious line", errors: ["d1", "d2", "d3", "d4"]});
}),

);
