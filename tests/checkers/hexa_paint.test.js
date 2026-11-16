// Hexagonal grid 3x3 (19 cells) and the solution (# is a painted cell).
// A clue shows the number of painted cells among the cell itself and its neighbours:
//       #  3  1              a1  b1  c1          #  #  .
//     .  4  .  .           a2  b2  c2  d2      .  #  .  .
//   0  .  3  #  .        a3  b3  c3  d3  e3  .  .  #  #  .
//     .  .  .  2           b4  c4  d4  e4      .  .  .  #
//       .  1  .              c5  d5  e5          .  #  .
// Painted cells are a1, b1, b2, c3, d3, e4, d5 (cells b1, b2, c3, e4, d5 have clues and are painted too).
checkerTestSuite("hexa_paint", "Hexa paint",

test('Correct solution',(suite) => {
  let clues = {"b1": "3", "c1": "1", "b2": "4", "a3": "0", "c3": "3", "e4": "2", "d5": "1"};
  let data = {"a1": "1", "b1": "1", "b2": "1", "c3": "1", "d3": "1", "e4": "1", "d5": "1"};

  assert("Correct solution response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "OK"});
}),

test('Too many painted cells around the clue',(suite) => {
  let clues = {"b1": "3", "c1": "1", "b2": "4", "a3": "0", "c3": "3", "e4": "2", "d5": "1"};
  // Extra painted cell b4 is a neighbour of a3.
  let data = {"a1": "1", "b1": "1", "b2": "1", "c3": "1", "d3": "1", "e4": "1", "d5": "1", "b4": "1"};

  assert("Too many painted cells response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["a3"]});
}),

test('Cell with the clue is counted',(suite) => {
  let clues = {"b1": "3", "c1": "1", "b2": "4", "a3": "0", "c3": "3", "e4": "2", "d5": "1"};
  // Cell d5 is not painted and it has no painted neighbours, so its clue 1 is not satisfied.
  let data = {"a1": "1", "b1": "1", "b2": "1", "c3": "1", "d3": "1", "e4": "1"};

  assert("Clue cell is not painted response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["d5"]});
}),

);
