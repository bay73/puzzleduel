// Puzzle 3x3 (arrow directions) and its solution (# is a shaded cell):
//   dr l  d       # . .
//   u  ul d       . . .
//   r  r  ul      . . #
checkerTestSuite("arrow_web", "Arrow web",

test('Correct solution',(suite) => {
  let clues = {"a1": "arrow_dr", "b1": "arrow_l", "c1": "arrow_d", "a2": "arrow_u", "b2": "arrow_ul", "c2": "arrow_d", "a3": "arrow_r", "b3": "arrow_r", "c3": "arrow_ul"};
  let data = {"a1": "1", "c3": "1"};

  assert("Correct solution response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "OK"});
}),

test('Arrow points to two shaded cells',(suite) => {
  let clues = {"a1": "arrow_dr", "b1": "arrow_l", "c1": "arrow_d", "a2": "arrow_u", "b2": "arrow_ul", "c2": "arrow_d", "a3": "arrow_r", "b3": "arrow_r", "c3": "arrow_ul"};
  // Extra shaded cell c2: arrow in c1 points down to c2 and c3.
  let data = {"a1": "1", "c2": "1", "c3": "1"};

  assert("Two shaded cells response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "The arrow should point to exactly one black cell", errors: ["c1"]});
}),

test('Arrow points to no shaded cells',(suite) => {
  let clues = {"a1": "arrow_dr", "b1": "arrow_l", "c1": "arrow_d", "a2": "arrow_u", "b2": "arrow_ul", "c2": "arrow_d", "a3": "arrow_r", "b3": "arrow_r", "c3": "arrow_ul"};
  // Cell a1 is not shaded: arrow in b1 points left to no shaded cells.
  let data = {"c3": "1"};

  assert("No shaded cells response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "The arrow should point to exactly one black cell", errors: ["b1"]});
}),

);
