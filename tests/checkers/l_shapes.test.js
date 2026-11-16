// Puzzle 4x4 and its solution (W, B are white and black circles):
//   . | .   .   B      a1 b1 c1 d1
//     +---+---+
//   . | B   . | .      a2 b2 c2 d2
//     +   +---+
//   . | . | . | .      a3 b3 c3 d3
//     +---+   +---
//   W   . | B   .      a4 b4 c4 d4
checkerTestSuite("l_shapes", "L-Shapes",

test('Correct solution',(suite) => {
  let clues = {"d1": "black_circle", "b2": "black_circle", "a4": "white_circle", "c4": "black_circle"};
  let data = {"areas": [["a1","a2","a3","a4","b4"], ["b1","c1","d1","d2","d3"], ["b2","c2","b3"], ["c3","c4","d4"]]};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Area with two circles',(suite) => {
  // Extra white circle in b3: area b2-c2-b3 contains two circles.
  let clues = {"d1": "black_circle", "b2": "black_circle", "b3": "white_circle", "a4": "white_circle", "c4": "black_circle"};
  let data = {"areas": [["a1","a2","a3","a4","b4"], ["b1","c1","d1","d2","d3"], ["b2","c2","b3"], ["c3","c4","d4"]]};

  assert("Area with two circles response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "Each area should contain exactly one circle", errors: ["b2","c2","b3"]});
}),

test('Area without circles',(suite) => {
  // No circle in area b2-c2-b3.
  let clues = {"d1": "black_circle", "a4": "white_circle", "c4": "black_circle"};
  let data = {"areas": [["a1","a2","a3","a4","b4"], ["b1","c1","d1","d2","d3"], ["b2","c2","b3"], ["c3","c4","d4"]]};

  assert("Area without circles response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "Each area should contain exactly one circle", errors: ["b2","c2","b3"]});
}),

test('Area is not L-shaped',(suite) => {
  let clues = {"d1": "black_circle", "b2": "black_circle", "a4": "white_circle", "c4": "black_circle"};
  // Cell c3 is moved to the area with b2, which becomes a 2x2 square.
  let data = {"areas": [["a1","a2","a3","a4","b4"], ["b1","c1","d1","d2","d3"], ["b2","c2","b3","c3"], ["c4","d4"]]};

  assert("Area is not L-shaped response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "Each area should be L-shaped", errors: ["b2","c2","b3","c3"]});
}),

test('Straight area',(suite) => {
  // Area a1-a4 is a straight line, cell b4 is attached to L-shape c3-c4-d4, which is not L-shape anymore.
  let clues = {"d1": "black_circle", "b2": "black_circle", "a4": "white_circle", "c4": "black_circle"};
  let data = {"areas": [["a1","a2","a3","a4"], ["b1","c1","d1","d2","d3"], ["b2","c2","b3"], ["c3","b4","c4","d4"]]};

  assert("Straight area response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "Each area should be L-shaped", errors: ["a1","a2","a3","a4"]});
}),

test('Circle is not in the corner',(suite) => {
  // Circle of the area b2-c2-b3 is in c2 instead of the corner b2.
  let clues = {"d1": "black_circle", "c2": "black_circle", "a4": "white_circle", "c4": "black_circle"};
  let data = {"areas": [["a1","a2","a3","a4","b4"], ["b1","c1","d1","d2","d3"], ["b2","c2","b3"], ["c3","c4","d4"]]};

  assert("Circle is not in the corner response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "Each area should contain a circle in the corner", errors: ["b2","c2","b3"]});
}),

test('White circle in L-shape with equal legs',(suite) => {
  // Circle b2 is white, but both legs of the area b2-c2-b3 have the same length.
  let clues = {"d1": "black_circle", "b2": "white_circle", "a4": "white_circle", "c4": "black_circle"};
  let data = {"areas": [["a1","a2","a3","a4","b4"], ["b1","c1","d1","d2","d3"], ["b2","c2","b3"], ["c3","c4","d4"]]};

  assert("White circle response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "L-shape with a white circle should not have equal legs", errors: ["b2","c2","b3"]});
}),

test('Black circle in L-shape with different legs',(suite) => {
  // Circle a4 is black, but the legs of the area a1-a4-b4 have different length.
  let clues = {"d1": "black_circle", "b2": "black_circle", "a4": "black_circle", "c4": "black_circle"};
  let data = {"areas": [["a1","a2","a3","a4","b4"], ["b1","c1","d1","d2","d3"], ["b2","c2","b3"], ["c3","c4","d4"]]};

  assert("Black circle response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "L-shape with a black circle should have equal legs", errors: ["a1","a2","a3","a4","b4"]});
}),

test('Cell without area',(suite) => {
  let clues = {"d1": "black_circle", "b2": "black_circle", "a4": "white_circle", "c4": "black_circle"};
  // Solution without the area c3-c4-d4: c3 is the first cell which doesn't belong to any area.
  let data = {"areas": [["a1", "a2", "a3", "a4", "b4"], ["b1", "c1", "d1", "d2", "d3"], ["b2", "c2", "b3"]]};

  assert("Cell without area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["c3"]});
}),

test('Cell in two areas',(suite) => {
  let clues = {"d1": "black_circle", "b2": "black_circle", "a4": "white_circle", "c4": "black_circle"};
  // Solution with an extra area which consists of the cell a1.
  let data = {"areas": [["a1", "a2", "a3", "a4", "b4"], ["b1", "c1", "d1", "d2", "d3"], ["b2", "c2", "b3"], ["c3", "c4", "d4"], ["a1"]]};

  assert("Cell in two areas response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["a1"]});
}),

);
