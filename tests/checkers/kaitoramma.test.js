// Puzzle 4x4 and its solution (W, B are white and black circles):
//   W . | . B      a1 b1 c1 d1
//   . . | . .      a2 b2 c2 d2
//   ----+----
//   . B | W .      a3 b3 c3 d3
//   . . | . W      a4 b4 c4 d4
checkerTestSuite("kaitoramma", "Kaitoramma",

test('Correct solution',(suite) => {
  let clues = {"a1": "white_circle", "d1": "black_circle", "b3": "black_circle", "c3": "white_circle", "d4": "white_circle"};
  let data = {"areas": [["a1","b1","a2","b2"], ["c1","d1","c2","d2"], ["a3","b3","a4","b4"], ["c3","d3","c4","d4"]]};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Area is not a rectangle',(suite) => {
  let clues = {"a1": "white_circle", "d1": "black_circle", "b3": "black_circle", "c3": "white_circle", "d4": "white_circle"};
  // Cell c3 is attached to the bottom left area, which makes it non-rectangular.
  let data = {"areas": [["a1","b1","a2","b2"], ["c1","d1","c2","d2"], ["a3","b3","a4","b4","c3"], ["d3","c4","d4"]]};

  assert("Area is not a rectangle response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "Each area should have rectangular or square shape", errors: ["a3","b3","a4","b4","c3"]});
}),

test('Area without circles',(suite) => {
  // There are no circles in the bottom right area.
  let clues = {"a1": "white_circle", "d1": "black_circle", "b3": "black_circle"};
  let data = {"areas": [["a1","b1","a2","b2"], ["c1","d1","c2","d2"], ["a3","b3","a4","b4"], ["c3","d3","c4","d4"]]};

  assert("Area without circles response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "Each area should contain at least one circle", errors: ["c3","d3","c4","d4"]});
}),

test('Circles of different color in one area',(suite) => {
  let clues = {"a1": "white_circle", "d1": "black_circle", "b3": "black_circle", "c3": "white_circle", "d4": "white_circle"};
  // Horizontal line only: the bottom area contains black circle b3 and white circles c3, d4.
  let data = {"areas": [["a1","b1","c1","d1","a2","b2","c2","d2"], ["a3","b3","c3","d3","a4","b4","c4","d4"]]};

  assert("Different colors response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "The area should not contain circles of different color", errors: ["a1","b1","c1","d1","a2","b2","c2","d2"]});
}),

test('Line ends inside the grid',(suite) => {
  // All areas are rectangles with circles of one color,
  // but the vertical line divides only the top half of the grid.
  let clues = {"a1": "white_circle", "d1": "black_circle", "b3": "black_circle"};
  let data = {"areas": [["a1","b1","a2","b2"], ["c1","d1","c2","d2"], ["a3","b3","c3","d3","a4","b4","c4","d4"]]};

  assert("Line ends inside the grid response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "The dividing lines must start and end on the grid boundary", errors: []});
}),

);
