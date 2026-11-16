// Hexagonal puzzle 3x3 (cell names are column letter + row number, columns go from
// bottom-left to top-right, rows go from top to bottom) and its solution
// (* is a circle, ^ and v are arrows pointing up and down):
//             * c1
//        . b1      . d2
//   v a1      * c2      . e3
//        . b2      . d3
//   * a2      ^ c3      . e4
//        . b3      . d4
//   * a3      . c4      . e5
//        . b4      . d5
//             . c5
// (the neighbours of c3 are: c2 - up, d3 - up-right, d4 - down-right, c4 - down,
//  b3 - down-left, b2 - up-left).
checkerTestSuite("point_crowd", "Point to Crowd",

test('Correct solution',(suite) => {
  let clues = {"a1": "arrow_d", "c3": "arrow_u"};
  // a1 sees 2 circles down (a2, a3) and 1 circle up-right (c1).
  // c3 sees 2 circles up (c1, c2) and 1 circle down-left (a3).
  let data = {"c1": "1", "c2": "1", "a2": "1", "a3": "1"};

  assert("Correct solution response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "OK"});
}),

test('Correct solution for all arrow directions',(suite) => {
  // The only circle is placed next to the arrow in the pointed direction.
  assert("Arrow up response").that(Checker.check("3x3", {"c3": "arrow_u"}, {"c2": "1"})).isEqualTo({status: "OK"});
  assert("Arrow up-right response").that(Checker.check("3x3", {"c3": "arrow_ur"}, {"d3": "1"})).isEqualTo({status: "OK"});
  assert("Arrow down-right response").that(Checker.check("3x3", {"c3": "arrow_dr"}, {"d4": "1"})).isEqualTo({status: "OK"});
  assert("Arrow down response").that(Checker.check("3x3", {"c3": "arrow_d"}, {"c4": "1"})).isEqualTo({status: "OK"});
  assert("Arrow down-left response").that(Checker.check("3x3", {"c3": "arrow_dl"}, {"b3": "1"})).isEqualTo({status: "OK"});
  assert("Arrow up-left response").that(Checker.check("3x3", {"c3": "arrow_ul"}, {"b2": "1"})).isEqualTo({status: "OK"});
}),

test('Arrow points to a wrong direction',(suite) => {
  // The only circle is placed next to the arrow in the direction opposite to the pointed one.
  assert("Arrow up response").that(Checker.check("3x3", {"c3": "arrow_u"}, {"c4": "1"})).isEqualTo({status: "The arrow should point to the most circles", errors: ["c3"]});
  assert("Arrow up-right response").that(Checker.check("3x3", {"c3": "arrow_ur"}, {"b3": "1"})).isEqualTo({status: "The arrow should point to the most circles", errors: ["c3"]});
  assert("Arrow down-right response").that(Checker.check("3x3", {"c3": "arrow_dr"}, {"b2": "1"})).isEqualTo({status: "The arrow should point to the most circles", errors: ["c3"]});
  assert("Arrow down response").that(Checker.check("3x3", {"c3": "arrow_d"}, {"c2": "1"})).isEqualTo({status: "The arrow should point to the most circles", errors: ["c3"]});
  assert("Arrow down-left response").that(Checker.check("3x3", {"c3": "arrow_dl"}, {"d3": "1"})).isEqualTo({status: "The arrow should point to the most circles", errors: ["c3"]});
  assert("Arrow up-left response").that(Checker.check("3x3", {"c3": "arrow_ul"}, {"d4": "1"})).isEqualTo({status: "The arrow should point to the most circles", errors: ["c3"]});
}),

test('Same number of circles in two directions',(suite) => {
  let clues = {"a1": "arrow_d", "c3": "arrow_u"};
  // With extra circle in b3 the arrow in c3 sees 2 circles up (c1, c2) and 2 circles down-left (a3, b3).
  let data = {"c1": "1", "c2": "1", "a2": "1", "a3": "1", "b3": "1"};

  assert("Same number of circles response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "The arrow should point to the most circles", errors: ["c3"]});
}),

test('No circles',(suite) => {
  let clues = {"a1": "arrow_d", "c3": "arrow_u"};
  // No circles in the grid, so the arrows don't point to the most circles.
  let data = {};

  assert("No circles response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "The arrow should point to the most circles", errors: ["a1"]});
}),

);
