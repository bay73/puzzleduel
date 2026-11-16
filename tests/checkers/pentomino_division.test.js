// Puzzle 5x4 and its solution (areas are marked by letters of pentominoes):
//   . . I . .      I I I I I      a1 b1 c1 d1 e1
//   . . . . .      U U X U U      a2 b2 c2 d2 e2
//   . . . . .      U X X X U      a3 b3 c3 d3 e3
//   . . . . .      U U X U U      a4 b4 c4 d4 e4
checkerTestSuite("pentomino_division", "Pentomino division",

test('Correct solution',(suite) => {
  let clues = {"c1": "I"};
  let data = {"areas": [["a1", "b1", "c1", "d1", "e1"], ["a2", "b2", "a3", "a4", "b4"], ["c2", "b3", "c3", "d3", "c4"], ["d2", "e2", "e3", "d4", "e4"]]};

  assert("Correct solution response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Area of ten cells',(suite) => {
  let clues = {"c1": "I"};
  // Areas X and the right U are not separated.
  let data = {"areas": [["a1", "b1", "c1", "d1", "e1"], ["a2", "b2", "a3", "a4", "b4"], ["c2", "d2", "e2", "b3", "c3", "d3", "e3", "c4", "d4", "e4"]]};

  assert("Not pentomino response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "Each marked area should form a pentomino", errors: ["c2", "d2", "e2", "b3", "c3", "d3", "e3", "c4", "d4", "e4"]});
}),

test('Shape does not match the letter',(suite) => {
  let clues = {"c1": "I"};
  // Rows 1-2 are divided to two L pentominoes, rows 3-4 are I pentominoes:
  //   L L L L l
  //   L l l l l
  //   I I I I I
  //   i i i i i
  // The letter I in c1 is inside of L pentomino.
  let data = {"areas": [["a1", "b1", "c1", "d1", "a2"], ["e1", "b2", "c2", "d2", "e2"], ["a3", "b3", "c3", "d3", "e3"], ["a4", "b4", "c4", "d4", "e4"]]};

  assert("Wrong shape response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "The shape is not correct", errors: ["a1", "b1", "c1", "d1", "a2"]});
}),

test('Same pentominoes share an edge',(suite) => {
  let clues = {"c1": "I"};
  // Each row is an I pentomino.
  let data = {"areas": [["a1", "b1", "c1", "d1", "e1"], ["a2", "b2", "c2", "d2", "e2"], ["a3", "b3", "c3", "d3", "e3"], ["a4", "b4", "c4", "d4", "e4"]]};

  assert("Same shapes response").that(Checker.check("5x4", clues, data)).isEqualTo({status: "Areas of the same shape shouldn't share an edge", errors: ["a1", "b1", "c1", "d1", "e1", "a2", "b2", "c2", "d2", "e2"]});
}),

);
