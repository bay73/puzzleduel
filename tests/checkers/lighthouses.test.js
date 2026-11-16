// Puzzle 5x5 and its solution (* is a boat, x is a cell which is known to be empty):
//   2 . * . x      a1 b1 c1 d1 e1
//   . . . . .      a2 b2 c2 d2 e2
//   * . . . *      a3 b3 c3 d3 e3
//   . . . . .      a4 b4 c4 d4 e4
//   . . 1 . 1      a5 b5 c5 d5 e5
checkerTestSuite("lighthouses", "Lighthouses",

test('Correct solution',(suite) => {
  let clues = {"a1": "2", "e1": "cross", "c5": "1", "e5": "1"};
  let data = {"c1": "boat", "a3": "boat", "e3": "boat"};

  assert("Correct solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "OK"});
}),

test('Boats touch each other',(suite) => {
  let clues = {"a1": "2", "e1": "cross", "c5": "1", "e5": "1"};
  // Extra boat in d2 touches boats c1 and e3 diagonally.
  let data = {"c1": "boat", "d2": "boat", "a3": "boat", "e3": "boat"};

  assert("Boats touch each other response").that(Checker.check("5x5", clues, data)).isEqualTo(
    {status: "Cells with boats shouldn't touch each other and lighthouses", errors: ["d2", "c1"]});
}),

test('Boat touches lighthouse',(suite) => {
  let clues = {"a1": "2", "e1": "cross", "c5": "1", "e5": "1"};
  // Boat is in b1 instead of c1, it is next to the lighthouse a1.
  let data = {"b1": "boat", "a3": "boat", "e3": "boat"};

  assert("Boat touches lighthouse response").that(Checker.check("5x5", clues, data)).isEqualTo(
    {status: "Cells with boats shouldn't touch each other and lighthouses", errors: ["a1", "b1"]});
}),

test('Wrong number of boats seen from the lighthouse',(suite) => {
  let clues = {"a1": "2", "e1": "cross", "c5": "1", "e5": "1"};
  // Without boat in e3 there are no boats in row 5 and column e.
  let data = {"c1": "boat", "a3": "boat"};

  assert("Wrong clue response").that(Checker.check("5x5", clues, data)).isEqualTo(
    {status: "The clue is not correct", errors: ["e5"]});
}),

);
