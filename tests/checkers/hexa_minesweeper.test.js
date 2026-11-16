// Hexagonal grid 3x3 (19 cells) and the solution (* is a mine).
// A clue shows the number of mines in the neighbouring cells:
//       1  *  2              a1  b1  c1
//     .  .  3  *           a2  b2  c2  d2
//   *  2  *  .  .        a3  b3  c3  d3  e3
//     .  .  2  *           b4  c4  d4  e4
//       *  1  .              c5  d5  e5
checkerTestSuite("hexa_minesweeper", "Hexa minesweeper",

test('Correct solution',(suite) => {
  let clues = {"a1": "1", "c1": "2", "c2": "3", "b3": "2", "d4": "2", "d5": "1"};
  let data = {"b1": "1", "d2": "1", "a3": "1", "c3": "1", "e4": "1", "c5": "1"};

  assert("Correct solution response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "OK"});
}),

test('Too many mines around the clue',(suite) => {
  let clues = {"a1": "1", "c1": "2", "c2": "3", "b3": "2", "d4": "2", "d5": "1"};
  // Extra mine in b4 is the third neighbour of b3 (together with a3 and c3).
  let data = {"b1": "1", "d2": "1", "a3": "1", "c3": "1", "b4": "1", "e4": "1", "c5": "1"};

  assert("Too many mines response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["b3"]});
}),

test('Not enough mines around the clue',(suite) => {
  let clues = {"a1": "1", "c1": "2", "c2": "3", "b3": "2", "d4": "2", "d5": "1"};
  // Without mine in b1 there are no mines around a1.
  let data = {"d2": "1", "a3": "1", "c3": "1", "e4": "1", "c5": "1"};

  assert("Not enough mines response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["a1"]});
}),

);
