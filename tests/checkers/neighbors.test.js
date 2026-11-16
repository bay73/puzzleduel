// Puzzle 4x4 and its solution (areas of the size 4 are marked by letters):
//   2 . . ?      A A B B      a1 b1 c1 d1
//   . . . .      A A B B      a2 b2 c2 d2
//   . 3 . .      C C C C      a3 b3 c3 d3
//   . . 1 .      D D D D      a4 b4 c4 d4
checkerTestSuite("neighbors", "Neighbors",

test('Correct solution',(suite) => {
  let clues = {"a1": "2", "d1": "?", "b3": "3", "c4": "1"};
  let data = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "c2", "d2"], ["a3", "b3", "c3", "d3"], ["a4", "b4", "c4", "d4"]]};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Areas of different sizes',(suite) => {
  let clues = {"a1": "2", "d1": "?", "b3": "3", "c4": "1"};
  // Cell d3 is moved to the bottom area: the areas have sizes 4, 4, 3 and 5.
  let data = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "c2", "d2"], ["a3", "b3", "c3"], ["d3", "a4", "b4", "c4", "d4"]]};

  assert("Different sizes response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All areas should have the same size", errors: ["a3", "b3", "c3"]});
}),

test('Two clues in one area',(suite) => {
  let clues = {"a1": "2", "d1": "?", "b3": "3", "c4": "1"};
  // Grid is divided to rows, the first row contains clues in a1 and d1.
  let data = {"areas": [["a1", "b1", "c1", "d1"], ["a2", "b2", "c2", "d2"], ["a3", "b3", "c3", "d3"], ["a4", "b4", "c4", "d4"]]};

  assert("Two clues response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each area should contain exactly one clue", errors: ["a1", "b1", "c1", "d1"]});
}),

test('Area without clue',(suite) => {
  let clues = {"a1": "2", "d1": "?", "b3": "3", "c4": "1"};
  // Grid is divided to rows, the second row (which is the first in the list) contains no clues.
  let data = {"areas": [["a2", "b2", "c2", "d2"], ["a1", "b1", "c1", "d1"], ["a3", "b3", "c3", "d3"], ["a4", "b4", "c4", "d4"]]};

  assert("No clues response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each area should contain exactly one clue", errors: ["a2", "b2", "c2", "d2"]});
}),

test('Wrong number of neighbours',(suite) => {
  let clues = {"a1": "2", "d1": "?", "b3": "3", "c4": "1"};
  // Grid is divided to columns, the column a has only one neighbour, but the clue in a1 is 2.
  let data = {"areas": [["a1", "a2", "a3", "a4"], ["b1", "b2", "b3", "b4"], ["c1", "c2", "c3", "c4"], ["d1", "d2", "d3", "d4"]]};

  assert("Wrong clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["a1"]});
}),

test('Cell without area',(suite) => {
  let clues = {"a1": "2", "d1": "?", "b3": "3", "c4": "1"};
  // Solution without the area a4-b4-c4-d4: a4 is the first cell which doesn't belong to any area.
  let data = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "c2", "d2"], ["a3", "b3", "c3", "d3"]]};

  assert("Cell without area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["a4"]});
}),

test('Cell in two areas',(suite) => {
  let clues = {"a1": "2", "d1": "?", "b3": "3", "c4": "1"};
  // Solution with an extra area which consists of the cell a1.
  let data = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "c2", "d2"], ["a3", "b3", "c3", "d3"], ["a4", "b4", "c4", "d4"], ["a1"]]};

  assert("Cell in two areas response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["a1"]});
}),

);
