// Puzzle 4x4 and its solution (# is a blackened cell):
//   . . # 2      a1 b1 c1 d1
//   . 7 . .      a2 b2 c2 d2
//   # . 4 #      a3 b3 c3 d3
//   . . . .      a4 b4 c4 d4
checkerTestSuite("kuromasu", "Kuromasu",

test('Correct solution',(suite) => {
  let clues = {"d1": "2", "b2": "7", "c3": "4"};
  let data = {"c1": "1", "a3": "1", "d3": "1"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('White area is not connected',(suite) => {
  let clues = {"d1": "2", "b2": "7", "c3": "4"};
  // Extra black cell in b4 cuts off the white cell a4.
  let data = {"c1": "1", "a3": "1", "d3": "1", "b4": "1"};

  assert("White area is not connected response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "White area should be connected"});
}),

test('Black cells share an edge',(suite) => {
  let clues = {"d1": "2", "b2": "7", "c3": "4"};
  // Extra black cell in a2 is adjacent to a3.
  let data = {"c1": "1", "a2": "1", "a3": "1", "d3": "1"};

  assert("Black cells share an edge response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "Blackened cells shouldn't sharing an edge", errors: ["a2", "a3"]});
}),

test('Wrong number of visible cells',(suite) => {
  let clues = {"d1": "2", "b2": "7", "c3": "4"};
  // Without black cell in a3 there are 5 cells visible from c3 (c2, c3, c4, b3, a3).
  let data = {"c1": "1", "d3": "1"};

  assert("Wrong clue response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "The clue is not correct", errors: ["c3"]});
}),

);
