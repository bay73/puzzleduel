// Puzzle 4x4 (areas are marked by letters) and its solution (# is a shaded cell):
//   A A A B      # # . #      a1 b1 c1 d1
//   A A B B      . . . #      a2 b2 c2 d2
//   C C D B      # . # .      a3 b3 c3 d3
//   C C D D      # . # .      a4 b4 c4 d4
checkerTestSuite("norinori", "Norinori",

test('Correct solution',(suite) => {
  let clues = {"areas": [["a1", "b1", "c1", "a2", "b2"], ["d1", "c2", "d2", "d3"], ["a3", "b3", "a4", "b4"], ["c3", "c4", "d4"]]};
  let data = {"a1": "1", "b1": "1", "d1": "1", "d2": "1", "a3": "1", "a4": "1", "c3": "1", "c4": "1"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Three shaded cells in a row',(suite) => {
  let clues = {"areas": [["a1", "b1", "c1", "a2", "b2"], ["d1", "c2", "d2", "d3"], ["a3", "b3", "a4", "b4"], ["c3", "c4", "d4"]]};
  // Extra shaded cell c1: the cell b1 has two shaded neighbours.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "d2": "1", "a3": "1", "a4": "1", "c3": "1", "c4": "1"};

  assert("Not a domino response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Shaded cells should form a domino", errors: ["a1", "c1", "b1"]});
}),

test('Single shaded cell',(suite) => {
  let clues = {"areas": [["a1", "b1", "c1", "a2", "b2"], ["d1", "c2", "d2", "d3"], ["a3", "b3", "a4", "b4"], ["c3", "c4", "d4"]]};
  // Cell c4 is not shaded, so the cell c3 has no shaded neighbours.
  let data = {"a1": "1", "b1": "1", "d1": "1", "d2": "1", "a3": "1", "a4": "1", "c3": "1"};

  assert("Single cell response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Shaded cells should form a domino", errors: ["c3"]});
}),

test('Wrong number of shaded cells in the area',(suite) => {
  let clues = {"areas": [["a1", "b1", "c1", "a2", "b2"], ["d1", "c2", "d2", "d3"], ["a3", "b3", "a4", "b4"], ["c3", "c4", "d4"]]};
  // Domino c3-c4 is missing, there are no shaded cells in the area D.
  let data = {"a1": "1", "b1": "1", "d1": "1", "d2": "1", "a3": "1", "a4": "1"};

  assert("Wrong area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The area should contain exactly 2 shaded cells", errors: ["c3", "c4", "d4"]});
}),

);
