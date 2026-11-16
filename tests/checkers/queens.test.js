// Puzzle 4x4 and its solution (Q is a queen, x is a cell which can't contain a queen).
// The clue shows the number of queens which attack the cell.
//   Q . . .      a1 b1 c1 d1
//   . 2 . Q      a2 b2 c2 d2
//   1 1 . .      a3 b3 c3 d3
//   . . Q x      a4 b4 c4 d4
checkerTestSuite("queens", "Queens",

test('Correct solution',(suite) => {
  let clues = {"b2": "2", "a3": "1", "b3": "1", "d4": "cross"};
  let data = {"a1": "queen", "d2": "queen", "c4": "queen"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Not enough queens',(suite) => {
  let clues = {"b2": "2", "a3": "1", "b3": "1", "d4": "cross"};
  // Without the queen in c4 nothing attacks b3.
  let data = {"a1": "queen", "d2": "queen"};

  assert("Not enough queens response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["b3"]});
}),

test('Too many queens',(suite) => {
  let clues = {"b2": "2", "a3": "1", "b3": "1", "d4": "cross"};
  // Extra queen in c1 attacks b2 by diagonal, so it is attacked by 3 queens.
  let data = {"a1": "queen", "c1": "queen", "d2": "queen", "c4": "queen"};

  assert("Too many queens response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["b2"]});
}),

);
