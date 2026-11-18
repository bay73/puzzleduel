checkerTestSuite("squares_and_rectangles", "Squares and Rectangles",

// Puzzle 4x4 and its solution (W, B are white and black circles, the first white circle is on the edge between b1 and c1):
//   .  . W .  .      a1 b1 c1 d1   - rectangle 4x1 with white circle
//   .  .  .  |.      a2 b2 c2 | d2
//   .  B  .  |W      a3 b3 c3 | d3 - square 3x3 with black circle and rectangle 1x3 with white circle
//   .  .  .  |.      a4 b4 c4 | d4
test('Correct solution',(suite) => {
  let clues = {"edges": {"b1-1": "huge_white_circle"}, "b3": "black_circle", "d3": "white_circle"};
  let data = {"areas":[["a1","b1","c1","d1"],["a2","b2","c2","a3","b3","c3","a4","b4","c4"],["d2","d3","d4"]]};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Touching same size area',(suite) => {
  let clues = {"c1": "black_circle", "c4": "white_circle", "edges": {"a1-1": "huge_black_circle", "d2-2": "huge_white_circle"}, "nodes": {"a3-2": "huge_black_circle"} };
  let data = {"areas":[["a1","b1","a2","b2"],["c1"],["d1","d2","d3","d4"],["c2","c3","c4"],["a3","b3","a4","b4"]]};

  assert("Touching same size area").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Areas of the same size shouldn't share an edge",errors:["a1","b1","a2","b2","a3","b3","a4","b4"]});
}),

test('Incorrect not a rectangle',(suite) => {
  let clues = {"c1": "black_circle", "c4": "white_circle", "edges": {"a1-1": "huge_black_circle", "d2-2": "huge_white_circle"}, "nodes": {"a3-2": "huge_black_circle"} };
  let data = {"areas":[["a1","b1","a2","b2"],["c1"],["d1","d2","d3"],["c2","c3","c4","d4"],["a3","b3","a4","b4"]]};

  assert("Incorrect not a rectangle  response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Each area should have rectangular or square shape","errors":["c2","c3","c4","d4"]});
}),

test('Incorrect unused cells',(suite) => {
  let clues = {"c1": "black_circle", "c4": "white_circle", "edges": {"a1-1": "huge_black_circle", "d2-2": "huge_white_circle"}, "nodes": {"a3-2": "huge_black_circle"} };
  let data = {"areas":[["a1","b1","a2","b2"],["c1"],["d1","d2","d3"],["c2","c3","c4"],["a3","b3","a4","b4"]]};

  assert("Incorrect unused cells response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Each cell should belong to exactly one area","errors": ["d4"]});
}),

test('Cell in two areas',(suite) => {
  let clues = {"c1": "black_circle", "c4": "white_circle", "edges": {"a1-1": "huge_black_circle", "d2-2": "huge_white_circle"}, "nodes": {"a3-2": "huge_black_circle"} };
  // The cell d4 is used in two areas.
  let data = {"areas":[["a1","b1","a2","b2"],["c1"],["d1","d2","d3","d4"],["c2","c3","c4"],["a3","b3","a4","b4"],["d4"]]};

  assert("Cell in two areas response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Each cell should belong to exactly one area","errors": ["d4"]});
}),

test('Two circles in area',(suite) => {
  let clues = {"c1": "black_circle", "c4": "white_circle", "edges": {"a1-1": "huge_black_circle", "d2-2": "huge_white_circle"}, "nodes": {"a3-2": "huge_black_circle"} };
  let data = {"areas":[["a1","b1","a2","b2"],["d1","d2","d3","d4"],["c1","c2","c3","c4"],["a3","b3","a4","b4"]]};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Each area should contain exactly one circle","errors":["c1","c2","c3","c4"]});
}),

test('Incorrect border',(suite) => {
  let clues = {"c1": "black_circle", "c4": "white_circle", "edges": {"a1-1": "huge_black_circle", "d2-2": "huge_white_circle"}, "nodes": {"a3-2": "huge_black_circle"} };
  let data = {"areas":[["a1","b1","a2","b2"],["c1","d1","c2","d2"],["d3","d4"],["c3","c4"],["a3","b3","a4","b4"]]};

  assert("Incorrect border response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Clues should be fully inside a single area","errors":["d2","d3"]});
}),

test('Black circle not in square',(suite) => {
  let clues = {"c1": "black_circle", "c4": "white_circle", "edges": {"a1-1": "huge_black_circle", "d2-2": "huge_white_circle"}, "nodes": {"a3-2": "huge_black_circle"} };
  let data = {"areas":[["a1","b1"],["c1"],["d1","d2","d3","d4"],["c2","c3","c4"],["a2","b2","a3","b3","a4","b4"]]};

  assert("Black circle not in square response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Area with a black circle should be a square","errors":["a1","b1"]});
}),

test('White circle in square',(suite) => {
  let clues = {"c1": "white_circle", "c4": "white_circle", "edges": {"a1-1": "huge_black_circle", "d2-2": "huge_white_circle"}, "nodes": {"a3-2": "huge_black_circle"} };
  let data = {"areas":[["a1","b1","a2","b2"],["c1","c2","c3"],["d1","d2","d3","d4"],["c4"],["a3","b3","a4","b4"]]};

  assert("White circle in square response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Area with a white circle should not be a square","errors":["c4"]});
}),

);
