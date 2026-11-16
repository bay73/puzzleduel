// Puzzle 4x4 and its solution (the clue is the sum of width and height of the rectangle):
//   3 │ .   . │ 4      a1 b1 c1 d1
//     │       │
//   . │ 4   . │ .      a2 b2 c2 d2
//   ──┴───────┤
//   .   .   . │ .      a3 b3 c3 d3
//             ├──
//   .   .   5 │ 2      a4 b4 c4 d4
checkerTestSuite("recto", "Recto",

test('Correct solution',(suite) => {
  let clues = {"a1": "3", "d1": "4", "b2": "4", "c4": "5", "d4": "2"};
  let data = {"areas": [["a1", "a2"], ["b1", "c1", "b2", "c2"], ["d1", "d2", "d3"], ["a3", "b3", "c3", "a4", "b4", "c4"], ["d4"]]};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Area is not a rectangle',(suite) => {
  let clues = {"a1": "3", "d1": "4", "b2": "4", "c4": "5", "d4": "2"};
  // Cell d4 is joined to the area in two bottom rows.
  let data = {"areas": [["a1", "a2"], ["b1", "c1", "b2", "c2"], ["d1", "d2", "d3"], ["a3", "b3", "c3", "a4", "b4", "c4", "d4"]]};

  assert("Area is not a rectangle response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each area should have rectangular or square shape", errors: ["a3", "b3", "c3", "a4", "b4", "c4", "d4"]});
}),

test('Area without clue',(suite) => {
  let clues = {"a1": "3", "d1": "4", "b2": "4", "c4": "5", "d4": "2"};
  // The bottom rectangle is split to two parts, and a3-c3 doesn't contain a clue.
  let data = {"areas": [["a1", "a2"], ["b1", "c1", "b2", "c2"], ["d1", "d2", "d3"], ["a3", "b3", "c3"], ["a4", "b4", "c4"], ["d4"]]};

  assert("Area without clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each area should contain exactly one clue", errors: ["a3", "b3", "c3"]});
}),

test('Area with two clues',(suite) => {
  let clues = {"a1": "3", "d1": "4", "b2": "4", "c4": "5", "d4": "2"};
  // The whole column d is one rectangle with two clues.
  let data = {"areas": [["a1", "a2"], ["b1", "c1", "b2", "c2"], ["d1", "d2", "d3", "d4"], ["a3", "b3", "c3", "a4", "b4", "c4"]]};

  assert("Area with two clues response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each area should contain exactly one clue", errors: ["d1", "d2", "d3", "d4"]});
}),

test('Wrong size of the rectangle',(suite) => {
  // Rectangle d1-d3 has width 1 and height 3, the sum is 4, not 5.
  let clues = {"a1": "3", "d1": "5", "b2": "4", "c4": "5", "d4": "2"};
  let data = {"areas": [["a1", "a2"], ["b1", "c1", "b2", "c2"], ["d1", "d2", "d3"], ["a3", "b3", "c3", "a4", "b4", "c4"], ["d4"]]};

  assert("Wrong size response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Clue should show the sum of side length of the rectangle", errors: ["d1", "d2", "d3"]});
}),

test('Cell without area',(suite) => {
  let clues = {"a1": "3", "d1": "4", "b2": "4", "c4": "5", "d4": "2"};
  // Solution without the area d4: d4 is the first cell which doesn't belong to any area.
  let data = {"areas": [["a1", "a2"], ["b1", "c1", "b2", "c2"], ["d1", "d2", "d3"], ["a3", "b3", "c3", "a4", "b4", "c4"]]};

  assert("Cell without area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["d4"]});
}),

test('Cell in two areas',(suite) => {
  let clues = {"a1": "3", "d1": "4", "b2": "4", "c4": "5", "d4": "2"};
  // Solution with an extra area which consists of the cell a1.
  let data = {"areas": [["a1", "a2"], ["b1", "c1", "b2", "c2"], ["d1", "d2", "d3"], ["a3", "b3", "c3", "a4", "b4", "c4"], ["d4"], ["a1"]]};

  assert("Cell in two areas response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["a1"]});
}),

);
