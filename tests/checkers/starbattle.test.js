// Puzzle 8x8 with eight areas and its solution (* is a star, x in a1 is a cross given as a clue):
//   A * A * C C C C      a1 b1 c1 d1 e1 f1 g1 h1
//   A A B B C * C *      a2 b2 c2 d2 e2 f2 g2 h2
//   A * B * D D D D      a3 b3 c3 d3 e3 f3 g3 h3
//   B B B B D * D *      a4 b4 c4 d4 e4 f4 g4 h4
//   * E * E G G G G      a5 b5 c5 d5 e5 f5 g5 h5
//   F F F F * G * G      a6 b6 c6 d6 e6 f6 g6 h6
//   * F * F H H H H      a7 b7 c7 d7 e7 f7 g7 h7
//   F F F F * H * H      a8 b8 c8 d8 e8 f8 g8 h8
// (star in d1 belongs to the area B: d1, c2, d2, c3, d3, a4, b4, c4, d4)
checkerTestSuite("starbattle", "Starbattle",

test('Correct solution',(suite) => {
  let clues = {"a1": "cross",
               "areas": [["a1", "b1", "c1", "a2", "b2", "a3", "b3"],
                         ["d1", "c2", "d2", "c3", "d3", "a4", "b4", "c4", "d4"],
                         ["e1", "f1", "g1", "h1", "e2", "f2", "g2", "h2"],
                         ["e3", "f3", "g3", "h3", "e4", "f4", "g4", "h4"],
                         ["a5", "b5", "c5", "d5"],
                         ["a6", "b6", "c6", "d6", "a7", "b7", "c7", "d7", "a8", "b8", "c8", "d8"],
                         ["e5", "f5", "g5", "h5", "e6", "f6", "g6", "h6"],
                         ["e7", "f7", "g7", "h7", "e8", "f8", "g8", "h8"]]};
  let data = {"b1": "star", "d1": "star", "f2": "star", "h2": "star", "b3": "star", "d3": "star", "f4": "star", "h4": "star",
              "a5": "star", "c5": "star", "e6": "star", "g6": "star", "a7": "star", "c7": "star", "e8": "star", "g8": "star"};

  assert("Correct solution response").that(Checker.check("8x8", clues, data)).isEqualTo({status: "OK"});
}),

test('Stars touch',(suite) => {
  let clues = {"a1": "cross",
               "areas": [["a1", "b1", "c1", "a2", "b2", "a3", "b3"],
                         ["d1", "c2", "d2", "c3", "d3", "a4", "b4", "c4", "d4"],
                         ["e1", "f1", "g1", "h1", "e2", "f2", "g2", "h2"],
                         ["e3", "f3", "g3", "h3", "e4", "f4", "g4", "h4"],
                         ["a5", "b5", "c5", "d5"],
                         ["a6", "b6", "c6", "d6", "a7", "b7", "c7", "d7", "a8", "b8", "c8", "d8"],
                         ["e5", "f5", "g5", "h5", "e6", "f6", "g6", "h6"],
                         ["e7", "f7", "g7", "h7", "e8", "f8", "g8", "h8"]]};
  // Star from d1 is moved to c1, where it shares an edge with the star in b1.
  let data = {"b1": "star", "c1": "star", "f2": "star", "h2": "star", "b3": "star", "d3": "star", "f4": "star", "h4": "star",
              "a5": "star", "c5": "star", "e6": "star", "g6": "star", "a7": "star", "c7": "star", "e8": "star", "g8": "star"};

  assert("Stars touch response").that(Checker.check("8x8", clues, data)).isEqualTo({status: "Cells with stars shouldn't touch", errors: ["b1", "c1"]});
}),

test('Stars touch diagonally',(suite) => {
  let clues = {"a1": "cross",
               "areas": [["a1", "b1", "c1", "a2", "b2", "a3", "b3"],
                         ["d1", "c2", "d2", "c3", "d3", "a4", "b4", "c4", "d4"],
                         ["e1", "f1", "g1", "h1", "e2", "f2", "g2", "h2"],
                         ["e3", "f3", "g3", "h3", "e4", "f4", "g4", "h4"],
                         ["a5", "b5", "c5", "d5"],
                         ["a6", "b6", "c6", "d6", "a7", "b7", "c7", "d7", "a8", "b8", "c8", "d8"],
                         ["e5", "f5", "g5", "h5", "e6", "f6", "g6", "h6"],
                         ["e7", "f7", "g7", "h7", "e8", "f8", "g8", "h8"]]};
  // Star from e8 is moved to d8, where it touches the star in c7 by a corner.
  let data = {"b1": "star", "d1": "star", "f2": "star", "h2": "star", "b3": "star", "d3": "star", "f4": "star", "h4": "star",
              "a5": "star", "c5": "star", "e6": "star", "g6": "star", "a7": "star", "c7": "star", "d8": "star", "g8": "star"};

  assert("Stars touch diagonally response").that(Checker.check("8x8", clues, data)).isEqualTo({status: "Cells with stars shouldn't touch", errors: ["c7", "d8"]});
}),

test('Wrong number of stars in row',(suite) => {
  let clues = {"a1": "cross",
               "areas": [["a1", "b1", "c1", "a2", "b2", "a3", "b3"],
                         ["d1", "c2", "d2", "c3", "d3", "a4", "b4", "c4", "d4"],
                         ["e1", "f1", "g1", "h1", "e2", "f2", "g2", "h2"],
                         ["e3", "f3", "g3", "h3", "e4", "f4", "g4", "h4"],
                         ["a5", "b5", "c5", "d5"],
                         ["a6", "b6", "c6", "d6", "a7", "b7", "c7", "d7", "a8", "b8", "c8", "d8"],
                         ["e5", "f5", "g5", "h5", "e6", "f6", "g6", "h6"],
                         ["e7", "f7", "g7", "h7", "e8", "f8", "g8", "h8"]]};
  // Star in h4 is missing, so there is only one star in the fourth row.
  let data = {"b1": "star", "d1": "star", "f2": "star", "h2": "star", "b3": "star", "d3": "star", "f4": "star",
              "a5": "star", "c5": "star", "e6": "star", "g6": "star", "a7": "star", "c7": "star", "e8": "star", "g8": "star"};

  assert("Wrong number of stars in row response").that(Checker.check("8x8", clues, data)).isEqualTo({status: "Each row should have exactly two stars", errors: ["a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4"]});
}),

test('Wrong number of stars in column',(suite) => {
  let clues = {"a1": "cross",
               "areas": [["a1", "b1", "c1", "a2", "b2", "a3", "b3"],
                         ["d1", "c2", "d2", "c3", "d3", "a4", "b4", "c4", "d4"],
                         ["e1", "f1", "g1", "h1", "e2", "f2", "g2", "h2"],
                         ["e3", "f3", "g3", "h3", "e4", "f4", "g4", "h4"],
                         ["a5", "b5", "c5", "d5"],
                         ["a6", "b6", "c6", "d6", "a7", "b7", "c7", "d7", "a8", "b8", "c8", "d8"],
                         ["e5", "f5", "g5", "h5", "e6", "f6", "g6", "h6"],
                         ["e7", "f7", "g7", "h7", "e8", "f8", "g8", "h8"]]};
  // Star from g8 is moved to h8: every row still has two stars, but column g has only one.
  let data = {"b1": "star", "d1": "star", "f2": "star", "h2": "star", "b3": "star", "d3": "star", "f4": "star", "h4": "star",
              "a5": "star", "c5": "star", "e6": "star", "g6": "star", "a7": "star", "c7": "star", "e8": "star", "h8": "star"};

  assert("Wrong number of stars in column response").that(Checker.check("8x8", clues, data)).isEqualTo({status: "Each column should have exactly two stars", errors: ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8"]});
}),

test('Wrong number of stars in area',(suite) => {
  let clues = {"a1": "cross",
               "areas": [["a1", "b1", "c1", "a2", "b2", "a3", "b3"],
                         ["d1", "c2", "d2", "c3", "d3", "a4", "b4", "c4", "d4"],
                         ["e1", "f1", "g1", "h1", "e2", "f2", "g2", "h2"],
                         ["e3", "f3", "g3", "h3", "e4", "f4", "g4", "h4"],
                         ["a5", "b5", "c5", "d5"],
                         ["a6", "b6", "c6", "d6", "a7", "b7", "c7", "d7", "a8", "b8", "c8", "d8"],
                         ["e5", "f5", "g5", "h5", "e6", "f6", "g6", "h6"],
                         ["e7", "f7", "g7", "h7", "e8", "f8", "g8", "h8"]]};
  // Mirrored solution: stars don't touch, every row and column has two stars,
  // but the area A (the first one) has only one star in a2.
  let data = {"e1": "star", "g1": "star", "a2": "star", "c2": "star", "e3": "star", "g3": "star", "a4": "star", "c4": "star",
              "f5": "star", "h5": "star", "b6": "star", "d6": "star", "f7": "star", "h7": "star", "b8": "star", "d8": "star"};

  assert("Wrong number of stars in area response").that(Checker.check("8x8", clues, data)).isEqualTo({status: "Each outlined area should have exactly two stars", errors: ["a1", "b1", "c1", "a2", "b2", "a3", "b3"]});
}),

);
