// Puzzle 4x4 (W - white circle, B - black circle) and its solution (areas are marked with digits):
//   W . W B      1 1 2 2
//   . B W .      1 1 3 3
//   B . . .      4 4 3 3
//   . W . B      4 4 3 3
checkerTestSuite("black_white", "Black and white",

test('Correct solution',(suite) => {
  let clues = {"a1": "white_circle", "c1": "white_circle", "d1": "black_circle", "b2": "black_circle", "c2": "white_circle", "a3": "black_circle", "b4": "white_circle", "d4": "black_circle"};
  let data = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1"], ["c2", "d2", "c3", "d3", "c4", "d4"], ["a3", "b3", "a4", "b4"]]};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Area is not a rectangle',(suite) => {
  // No circles in c1 and d1 for this test, so both L-shaped areas have one white and one black circle.
  let clues = {"a1": "white_circle", "b2": "black_circle", "c2": "white_circle", "a3": "black_circle", "b4": "white_circle", "d4": "black_circle"};
  // The top left area is a1-b1-c1-d1-a2-b2.
  let data = {"areas": [["a1", "b1", "c1", "d1", "a2", "b2"], ["c2", "d2", "c3", "d3", "c4", "d4"], ["a3", "b3", "a4", "b4"]]};

  assert("Not rectangle response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each area should have rectangular or square shape", errors: ["a1", "b1", "c1", "d1", "a2", "b2"]});
}),

test('Area with two circles of each color',(suite) => {
  let clues = {"a1": "white_circle", "c1": "white_circle", "d1": "black_circle", "b2": "black_circle", "c2": "white_circle", "a3": "black_circle", "b4": "white_circle", "d4": "black_circle"};
  // Areas 2 and 3 are not divided: rectangle 2x4 contains four circles.
  let data = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "c2", "d2", "c3", "d3", "c4", "d4"], ["a3", "b3", "a4", "b4"]]};

  assert("Four circles response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each area should contain exactly one white circle and one black circle", errors: ["c1", "d1", "c2", "d2", "c3", "d3", "c4", "d4"]});
}),

test('Area with one circle',(suite) => {
  let clues = {"a1": "white_circle", "c1": "white_circle", "d1": "black_circle", "b2": "black_circle", "c2": "white_circle", "a3": "black_circle", "b4": "white_circle", "d4": "black_circle"};
  // Area 1 is divided into two rows: a1-b1 has only white circle.
  let data = {"areas": [["a1", "b1"], ["a2", "b2"], ["c1", "d1"], ["c2", "d2", "c3", "d3", "c4", "d4"], ["a3", "b3", "a4", "b4"]]};

  assert("One circle response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each area should contain exactly one white circle and one black circle", errors: ["a1", "b1"]});
}),

test('Area with two circles of the same color',(suite) => {
  // Circle in d1 is white, so area c1-d1 has two white circles.
  let clues = {"a1": "white_circle", "c1": "white_circle", "d1": "white_circle", "b2": "black_circle", "c2": "white_circle", "a3": "black_circle", "b4": "white_circle", "d4": "black_circle"};
  let data = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1"], ["c2", "d2", "c3", "d3", "c4", "d4"], ["a3", "b3", "a4", "b4"]]};

  assert("Same color response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each area should contain exactly one white circle and one black circle", errors: ["c1", "d1"]});
}),

test('Cell without area',(suite) => {
  let clues = {"a1": "white_circle", "c1": "white_circle", "d1": "black_circle", "b2": "black_circle", "c2": "white_circle", "a3": "black_circle", "b4": "white_circle", "d4": "black_circle"};
  // Solution without the area a3-b3-a4-b4: a3 is the first cell which doesn't belong to any area.
  let data = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1"], ["c2", "d2", "c3", "d3", "c4", "d4"]]};

  assert("Cell without area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["a3"]});
}),

test('Cell in two areas',(suite) => {
  let clues = {"a1": "white_circle", "c1": "white_circle", "d1": "black_circle", "b2": "black_circle", "c2": "white_circle", "a3": "black_circle", "b4": "white_circle", "d4": "black_circle"};
  // Solution with an extra area which consists of the cell a1.
  let data = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1"], ["c2", "d2", "c3", "d3", "c4", "d4"], ["a3", "b3", "a4", "b4"], ["a1"]]};

  assert("Cell in two areas response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["a1"]});
}),

);
