// Puzzle 4x3 with dominoes 0-0, 0-1, 0-2, 1-1, 1-2, 2-2 and its solution:
//   0 0 1 2      a1 b1 c1 d1      0-0 1-2
//   0 2 1 0      a2 b2 c2 d2      0 2 1 0
//   1 2 1 2      a3 b3 c3 d3      | | | |
//                                 1 2 1 2
checkerTestSuite("domino_hunt", "Domino Hunt",

test('Correct solution',(suite) => {
  let clues = {"a1": "0", "b1": "0", "c1": "1", "d1": "2", "a2": "0", "b2": "2", "c2": "1", "d2": "0", "a3": "1", "b3": "2", "c3": "1", "d3": "2"};
  let data = {"areas": [["a1","b1"],["c1","d1"],["a2","a3"],["b2","b3"],["c2","c3"],["d2","d3"]]};

  assert("Correct solution response").that(Checker.check("4x3-012", clues, data)).isEqualTo({status: "OK"});
}),

test('Area of four cells',(suite) => {
  let clues = {"a1": "0", "b1": "0", "c1": "1", "d1": "2", "a2": "0", "b2": "2", "c2": "1", "d2": "0", "a3": "1", "b3": "2", "c3": "1", "d3": "2"};
  // The first row is not divided into dominoes.
  let data = {"areas": [["a1","b1","c1","d1"],["a2","a3"],["b2","b3"],["c2","c3"],["d2","d3"]]};

  assert("Big area response").that(Checker.check("4x3-012", clues, data)).isEqualTo({status: "Each area should contain two cells", errors: ["a1", "b1", "c1", "d1"]});
}),

test('Domino used twice',(suite) => {
  let clues = {"a1": "0", "b1": "0", "c1": "1", "d1": "2", "a2": "0", "b2": "2", "c2": "1", "d2": "0", "a3": "1", "b3": "2", "c3": "1", "d3": "2"};
  // Horizontal dominoes a2-b2 (0-2) and a3-b3 (1-2) instead of vertical ones.
  // Domino 1-2 is used in c1-d1 and in a3-b3, domino 0-2 is used in a2-b2 and in d2-d3.
  let data = {"areas": [["a1","b1"],["c1","d1"],["a2","b2"],["a3","b3"],["c2","c3"],["d2","d3"]]};

  assert("Domino used twice response").that(Checker.check("4x3-012", clues, data)).isEqualTo({status: "Each domino should be used once", errors: ["a3", "b3", "c1", "d1"]});
}),

);
