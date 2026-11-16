// Puzzle 4x4 and its solution (* is a mine, x is a cell marked by the author as empty):
//   1 * 2 .      a1 b1 c1 d1
//   . . . *      a2 b2 c2 d2
//   . 1 1 .      a3 b3 c3 d3
//   * . . x      a4 b4 c4 d4
checkerTestSuite("minesweeper_classic", "Minesweeper",

test('Correct solution',(suite) => {
  let clues = {"a1": "1", "c1": "2", "b3": "1", "c3": "1", "d4": "cross"};
  let data = {"b1": "mine", "d2": "mine", "a4": "mine"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Not enough mines around the clue',(suite) => {
  let clues = {"a1": "1", "c1": "2", "b3": "1", "c3": "1", "d4": "cross"};
  // Without mine in a4 there are no mines around b3.
  let data = {"b1": "mine", "d2": "mine"};

  assert("Not enough mines response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["b3"]});
}),

test('Too many mines around the clue',(suite) => {
  let clues = {"a1": "1", "c1": "2", "b3": "1", "c3": "1", "d4": "cross"};
  // Extra mine in d1 is the third mine around c1.
  let data = {"b1": "mine", "d1": "mine", "d2": "mine", "a4": "mine"};

  assert("Too many mines response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["c1"]});
}),

);
