// Puzzle 5x4 (W is a white circle, B is a black circle) and its solution (letters are areas):
//   W . B . .      A A B B B      a1 b1 c1 d1 e1
//   . B . W W      A A C C B      a2 b2 c2 d2 e2
//   B B . W .      E C C D D      a3 b3 c3 d3 e3
//   . . W . B      E E E D D      a4 b4 c4 d4 e4
checkerTestSuite("two_apiece", "Two Apiece",

test('Correct solution',(suite) => {
  let clues = {"a1": "white_circle", "b2": "black_circle", "c1": "black_circle", "e2": "white_circle", "d2": "white_circle", "b3": "black_circle", "d3": "white_circle", "e4": "black_circle", "a3": "black_circle", "c4": "white_circle"};
  let data = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "e1", "e2"], ["c2", "d2", "b3", "c3"], ["d3", "e3", "d4", "e4"], ["a3", "a4", "b4", "c4"]]};

  assert("Correct solution response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Areas of different size',(suite) => {
  let clues = {"a1": "white_circle", "b2": "black_circle", "c1": "black_circle", "e2": "white_circle", "d2": "white_circle", "b3": "black_circle", "d3": "white_circle", "e4": "black_circle", "a3": "black_circle", "c4": "white_circle"};
  // Cell c2 belongs to the area B instead of C: area B has 5 cells, while area A has 4 cells.
  let data = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "e1", "e2", "c2"], ["d2", "b3", "c3"], ["d3", "e3", "d4", "e4"], ["a3", "a4", "b4", "c4"]]};

  assert("Different size response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "All areas should have the same size", errors: ["c1", "d1", "e1", "e2", "c2"]});
}),

test('Two circles of the same color in the area',(suite) => {
  // White circle in b2 instead of black: area A contains two white circles.
  let clues = {"a1": "white_circle", "b2": "white_circle", "c1": "black_circle", "e2": "white_circle", "d2": "white_circle", "b3": "black_circle", "d3": "white_circle", "e4": "black_circle", "a3": "black_circle", "c4": "white_circle"};
  let data = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "e1", "e2"], ["c2", "d2", "b3", "c3"], ["d3", "e3", "d4", "e4"], ["a3", "a4", "b4", "c4"]]};

  assert("Wrong circles response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "Each area should contain exactly one white circle and one black circle", errors: ["a1", "b1", "a2", "b2"]});
}),

test('Area without black circle',(suite) => {
  // No circle in b2: area A contains only a white circle.
  let clues = {"a1": "white_circle", "c1": "black_circle", "e2": "white_circle", "d2": "white_circle", "b3": "black_circle", "d3": "white_circle", "e4": "black_circle", "a3": "black_circle", "c4": "white_circle"};
  let data = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "e1", "e2"], ["c2", "d2", "b3", "c3"], ["d3", "e3", "d4", "e4"], ["a3", "a4", "b4", "c4"]]};

  assert("Missing circle response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "Each area should contain exactly one white circle and one black circle", errors: ["a1", "b1", "a2", "b2"]});
}),

test('Adjacent areas of the same shape',(suite) => {
  // Puzzle 4x2 is divided into two L-shapes, the second one is the first one rotated by 180 degrees:
  //   W . B .      A A A B
  //   . W . B      A B B B
  let clues = {"a1": "white_circle", "c1": "black_circle", "b2": "white_circle", "d2": "black_circle"};
  let data = {"areas": [["a1", "b1", "c1", "a2"], ["d1", "b2", "c2", "d2"]]};

  assert("Same shape response").that(Checker.check("4x2", clues, data)).isEqualTo({status: "Areas of the same shape shouldn't share an edge", errors: ["a1", "b1", "c1", "a2", "d1", "b2", "c2", "d2"]});
}),

test('Adjacent areas of the mirrored shape',(suite) => {
  // Puzzle 4x3 is divided into L-shape, S-shape and mirrored L-shape, both L-shapes share the edge between c1 and d1:
  //   W . B .      A A A B
  //   . W . W      A C C B
  //   B . . B      C C B B
  let clues = {"a1": "white_circle", "c1": "black_circle", "b2": "white_circle", "a3": "black_circle", "d2": "white_circle", "d3": "black_circle"};
  let data = {"areas": [["a1", "b1", "c1", "a2"], ["d1", "d2", "c3", "d3"], ["b2", "c2", "a3", "b3"]]};

  assert("Mirrored shape response").that(Checker.check("4x3", clues, data)).isEqualTo({status: "Areas of the same shape shouldn't share an edge", errors: ["a1", "b1", "c1", "a2", "d1", "d2", "c3", "d3"]});
}),

test('Cell without area',(suite) => {
  let clues = {"a1": "white_circle", "b2": "black_circle", "c1": "black_circle", "e2": "white_circle", "d2": "white_circle", "b3": "black_circle", "d3": "white_circle", "e4": "black_circle", "a3": "black_circle", "c4": "white_circle"};
  // Solution without the area a3-a4-b4-c4: a3 is the first cell which doesn't belong to any area.
  let data = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "e1", "e2"], ["c2", "d2", "b3", "c3"], ["d3", "e3", "d4", "e4"]]};

  assert("Cell without area response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["a3"]});
}),

test('Cell in two areas',(suite) => {
  let clues = {"a1": "white_circle", "b2": "black_circle", "c1": "black_circle", "e2": "white_circle", "d2": "white_circle", "b3": "black_circle", "d3": "white_circle", "e4": "black_circle", "a3": "black_circle", "c4": "white_circle"};
  // Solution with an extra area which consists of the cell a1.
  let data = {"areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "e1", "e2"], ["c2", "d2", "b3", "c3"], ["d3", "e3", "d4", "e4"], ["a3", "a4", "b4", "c4"], ["a1"]]};

  assert("Cell in two areas response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["a1"]});
}),

);
