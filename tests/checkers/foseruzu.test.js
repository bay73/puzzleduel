// Puzzle 4x4 with areas of size 4 and its solution (letters show areas).
// A clue shows the number of borders around the cell (including the grid border):
//   2 . . .      A A A B      a1 b1 c1 d1
//   . . 3 .      A C B B      a2 b2 c2 d2
//   . 2 . .      C C D B      a3 b3 c3 d3
//   . . 1 .      C D D D      a4 b4 c4 d4
checkerTestSuite("foseruzu", "Foseruzu",

test('Correct solution',(suite) => {
  let clues = {"a1": "2", "c2": "3", "b3": "2", "c4": "1"};
  let data = {"areas": [["a1", "b1", "c1", "a2"], ["d1", "c2", "d2", "d3"], ["b2", "a3", "b3", "a4"], ["c3", "b4", "c4", "d4"]]};

  assert("Correct solution response").that(Checker.check("4x4-4", clues, data)).isEqualTo({status: "OK"});
}),

test('Area of wrong size',(suite) => {
  let clues = {"a1": "2", "c2": "3", "b3": "2", "c4": "1"};
  // Cell a2 is moved from area A to area C, so area A has only 3 cells.
  let data = {"areas": [["a1", "b1", "c1"], ["d1", "c2", "d2", "d3"], ["a2", "b2", "a3", "b3", "a4"], ["c3", "b4", "c4", "d4"]]};

  assert("Wrong size response").that(Checker.check("4x4-4", clues, data)).isEqualTo({status: "Each area should have the required size", errors: ["a1", "b1", "c1"]});
}),

test('Wrong number of borders around the clue',(suite) => {
  // Cell c4 has only one border (the grid border at the bottom), but the clue requires two.
  let clues = {"a1": "2", "c2": "3", "b3": "2", "c4": "2"};
  let data = {"areas": [["a1", "b1", "c1", "a2"], ["d1", "c2", "d2", "d3"], ["b2", "a3", "b3", "a4"], ["c3", "b4", "c4", "d4"]]};

  assert("Wrong clue response").that(Checker.check("4x4-4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["c4"]});
}),

test('Cell without area',(suite) => {
  let clues = {"a1": "2", "c2": "3", "b3": "2", "c4": "1"};
  // Solution without the area c3-b4-c4-d4: c3 is the first cell which doesn't belong to any area.
  let data = {"areas": [["a1", "b1", "c1", "a2"], ["d1", "c2", "d2", "d3"], ["b2", "a3", "b3", "a4"]]};

  assert("Cell without area response").that(Checker.check("4x4-4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["c3"]});
}),

test('Cell in two areas',(suite) => {
  let clues = {"a1": "2", "c2": "3", "b3": "2", "c4": "1"};
  // Solution with an extra area which consists of the cell a1.
  let data = {"areas": [["a1", "b1", "c1", "a2"], ["d1", "c2", "d2", "d3"], ["b2", "a3", "b3", "a4"], ["c3", "b4", "c4", "d4"], ["a1"]]};

  assert("Cell in two areas response").that(Checker.check("4x4-4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["a1"]});
}),

);
