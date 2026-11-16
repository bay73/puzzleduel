// Puzzle 5x5 with one star in every row and column ("5x5-1") and its solution (* is a star):
//   * A B B B      a1 b1 c1 d1 e1
//   A C * C B      a2 b2 c2 d2 e2
//   A C D D *      a3 b3 c3 d3 e3
//   D * D E E      a4 b4 c4 d4 e4
//   D E E * E      a5 b5 c5 d5 e5
checkerTestSuite("starbattle_smallregions", "Starbattle (Small Regions)",

test('Correct solution',(suite) => {
  let clues = {"areas": [["a1", "b1", "a2", "a3"],
                         ["c1", "d1", "e1", "e2", "e3"],
                         ["b2", "c2", "d2", "b3"],
                         ["c3", "d3", "a4", "b4", "c4", "a5"],
                         ["d4", "e4", "b5", "c5", "d5", "e5"]]};
  let data = {"a1": "star", "c2": "star", "e3": "star", "b4": "star", "d5": "star"};

  assert("Correct solution response").that(Checker.check("5x5-1", clues, data)).isEqualTo({status: "OK"});
}),

test('Stars touch',(suite) => {
  let clues = {"areas": [["a1", "b1", "a2", "a3"],
                         ["c1", "d1", "e1", "e2", "e3"],
                         ["b2", "c2", "d2", "b3"],
                         ["c3", "d3", "a4", "b4", "c4", "a5"],
                         ["d4", "e4", "b5", "c5", "d5", "e5"]]};
  // Star from c2 is moved to b2, where it touches the star in a1 by a corner.
  let data = {"a1": "star", "b2": "star", "e3": "star", "b4": "star", "d5": "star"};

  assert("Stars touch response").that(Checker.check("5x5-1", clues, data)).isEqualTo({status: "Cells with stars shouldn't touch", errors: ["a1", "b2"]});
}),

test('Wrong number of stars in row',(suite) => {
  let clues = {"areas": [["a1", "b1", "a2", "a3"],
                         ["c1", "d1", "e1", "e2", "e3"],
                         ["b2", "c2", "d2", "b3"],
                         ["c3", "d3", "a4", "b4", "c4", "a5"],
                         ["d4", "e4", "b5", "c5", "d5", "e5"]]};
  // Star in e3 is missing, so there are no stars in the third row.
  let data = {"a1": "star", "c2": "star", "b4": "star", "d5": "star"};

  assert("Wrong number of stars in row response").that(Checker.check("5x5-1", clues, data)).isEqualTo({status: "Wrong number of stars in the row", errors: ["a3", "b3", "c3", "d3", "e3"]});
}),

test('Wrong number of stars in column',(suite) => {
  let clues = {"areas": [["a1", "b1", "a2", "a3"],
                         ["c1", "d1", "e1", "e2", "e3"],
                         ["b2", "c2", "d2", "b3"],
                         ["c3", "d3", "a4", "b4", "c4", "a5"],
                         ["d4", "e4", "b5", "c5", "d5", "e5"]]};
  // Star from b4 is moved to a4: every row still has one star, but column a has two.
  let data = {"a1": "star", "c2": "star", "e3": "star", "a4": "star", "d5": "star"};

  assert("Wrong number of stars in column response").that(Checker.check("5x5-1", clues, data)).isEqualTo({status: "Wrong number of stars in the column", errors: ["a1", "a2", "a3", "a4", "a5"]});
}),

test('Wrong number of stars in area',(suite) => {
  let clues = {"areas": [["a1", "b1", "a2", "a3"],
                         ["c1", "d1", "e1", "e2", "e3"],
                         ["b2", "c2", "d2", "b3"],
                         ["c3", "d3", "a4", "b4", "c4", "a5"],
                         ["d4", "e4", "b5", "c5", "d5", "e5"]]};
  // Stars don't touch, every row and column has one star, but the area A (the first one) has two stars: b1 and a3.
  let data = {"b1": "star", "d2": "star", "a3": "star", "c4": "star", "e5": "star"};

  assert("Wrong number of stars in area response").that(Checker.check("5x5-1", clues, data)).isEqualTo({status: "Each outlined area should have exactly one star", errors: ["a1", "b1", "a2", "a3"]});
}),

);
