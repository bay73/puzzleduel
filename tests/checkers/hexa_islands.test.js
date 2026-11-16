// Hexagonal grid 5x5 (61 cells) and the solution (# is a black cell):
//           #  .  .  .  #                      a1  b1  c1  d1  e1
//         .  #  .  .  #  .                  a2  b2  c2  d2  e2  f2
//       .  .  #  .  #  .  .              a3  b3  c3  d3  e3  f3  g3
//     .  .  .  #  #  .  .  .          a4  b4  c4  d4  e4  f4  g4  h4
//   #  #  #  #  #  #  #  #  #      a5  b5  c5  d5  e5  f5  g5  h5  i5
//     .  .  .  #  #  .  .  .          b6  c6  d6  e6  f6  g6  h6  i6
//       .  .  #  .  #  .  .              c7  d7  e7  f7  g7  h7  i7
//         .  #  .  .  #  .                  d8  e8  f8  g8  h8  i8
//           #  .  .  .  #                      e9  f9  g9  h9  i9
// Black cells in the corners (a1, e1, a5, i5, e9, i9) and in the center (e5) are given.
// Neighbours of e5 are e4, f5, f6, e6, d5, d4.
checkerTestSuite("hexa_islands", "Hexa islands",

test('Correct solution',(suite) => {
  let clues = {"a1": "1", "e1": "1", "a5": "1", "e5": "1", "i5": "1", "e9": "1", "i9": "1"};
  let data = {"b2": "1", "e2": "1", "c3": "1", "e3": "1", "d4": "1", "e4": "1", "b5": "1", "c5": "1", "d5": "1", "f5": "1", "g5": "1", "h5": "1", "e6": "1", "f6": "1", "e7": "1", "g7": "1", "e8": "1", "h8": "1"};

  assert("Correct solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "OK"});
}),

test('Island is too small',(suite) => {
  let clues = {"a1": "1", "e1": "1", "a5": "1", "e5": "1", "i5": "1", "e9": "1", "i9": "1"};
  // Extra black cell b1: only 5 cells are left in the top island.
  let data = {"b1": "1", "b2": "1", "e2": "1", "c3": "1", "e3": "1", "d4": "1", "e4": "1", "b5": "1", "c5": "1", "d5": "1", "f5": "1", "g5": "1", "h5": "1", "e6": "1", "f6": "1", "e7": "1", "g7": "1", "e8": "1", "h8": "1"};

  assert("Small island response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "An island must consist of 6 cells", errors: ["c1", "d1", "d2", "c2", "d3"]});
}),

test('Island is too big',(suite) => {
  let clues = {"a1": "1", "e1": "1", "a5": "1", "e5": "1", "i5": "1", "e9": "1", "i9": "1"};
  // Cell b2 is not black: it joins the top island (b1, c1, d1, c2, d2, d3) with the left one (a2, a3, b3, a4, b4, c4).
  let data = {"e2": "1", "c3": "1", "e3": "1", "d4": "1", "e4": "1", "b5": "1", "c5": "1", "d5": "1", "f5": "1", "g5": "1", "h5": "1", "e6": "1", "f6": "1", "e7": "1", "g7": "1", "e8": "1", "h8": "1"};

  assert("Big island response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "An island must consist of 6 cells", errors: ["b1", "c1", "d1", "d2", "c2", "b2", "a2", "a3", "b3", "b4", "a4", "c4", "d3"]});
}),

test('Wrong number of islands',(suite) => {
  let clues = {"a1": "1", "e1": "1", "a5": "1", "e5": "1", "i5": "1", "e9": "1", "i9": "1"};
  // All cells of the top island (b1, c1, d1, c2, d2, d3) are black, so there are only 5 islands.
  let data = {"b1": "1", "c1": "1", "d1": "1", "b2": "1", "c2": "1", "d2": "1", "e2": "1", "c3": "1", "d3": "1", "e3": "1", "d4": "1", "e4": "1", "b5": "1", "c5": "1", "d5": "1", "f5": "1", "g5": "1", "h5": "1", "e6": "1", "f6": "1", "e7": "1", "g7": "1", "e8": "1", "h8": "1"};

  assert("Wrong number of islands response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "There should be 6 white islands", errors: []});
}),

);
