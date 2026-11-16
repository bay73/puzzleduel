// Hexagonal grid 3x3 (19 cells) and the solution (x is a cell inside the loop).
// A clue shows the number of loop segments around the cell:
//       .  2  .              a1  b1  c1
//     .  4  x  .           a2  b2  c2  d2
//   0  .  3  x  1        a3  b3  c3  d3  e3
//     .  .  2  .           b4  c4  d4  e4
//       .  .  .              c5  d5  e5
// Inner cells are b2, c2, c3, d3.
// Sides of a cell are numbered clockwise starting from the top right one: "c3-0" is the side between c3 and c2,
// "c3-1" - between c3 and d3, "c3-2" - c3 and d4, "c3-3" - c3 and c4, "c3-4" - c3 and b3, "c3-5" - c3 and b2.
checkerTestSuite("hexa_fence", "Hexa fences",

test('Correct solution',(suite) => {
  let clues = {"b1": "2", "b2": "4", "a3": "0", "c3": "3", "e3": "1", "d4": "2"};
  let data = {"edges": {"a1-2": "1", "b1-2": "1", "b1-3": "1", "c1-3": "1", "a2-1": "1", "b2-3": "1", "c2-1": "1", "d2-3": "1", "b3-1": "1", "c3-2": "1", "c3-3": "1", "d3-1": "1", "d3-2": "1", "d3-3": "1"}};

  assert("Correct solution response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"b1": "2", "b2": "4", "a3": "0", "c3": "3", "e3": "1", "d4": "2"};
  // Nothing is drawn.
  let data = {};

  assert("No loop response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Loop is not closed',(suite) => {
  let clues = {"b1": "2", "b2": "4", "a3": "0", "c3": "3", "e3": "1", "d4": "2"};
  // The side between d3 and d4 is missing.
  let data = {"edges": {"a1-2": "1", "b1-2": "1", "b1-3": "1", "c1-3": "1", "a2-1": "1", "b2-3": "1", "c2-1": "1", "d2-3": "1", "b3-1": "1", "c3-2": "1", "c3-3": "1", "d3-1": "1", "d3-2": "1"}};

  assert("Loop is not closed response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Loop with a branch',(suite) => {
  let clues = {"b1": "2", "b2": "4", "a3": "0", "c3": "3", "e3": "1", "d4": "2"};
  // Extra segment between c4 and d4 sticks out of the loop.
  let data = {"edges": {"a1-2": "1", "b1-2": "1", "b1-3": "1", "c1-3": "1", "a2-1": "1", "b2-3": "1", "c2-1": "1", "d2-3": "1", "b3-1": "1", "c3-2": "1", "c3-3": "1", "d3-1": "1", "d3-2": "1", "d3-3": "1", "c4-1": "1"}};

  assert("Loop with a branch response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Two loops',(suite) => {
  let clues = {"b1": "2", "b2": "4", "a3": "0", "c3": "3", "e3": "1", "d4": "2"};
  // The second loop goes around the corner cell c5.
  let data = {"edges": {"a1-2": "1", "b1-2": "1", "b1-3": "1", "c1-3": "1", "a2-1": "1", "b2-3": "1", "c2-1": "1", "d2-3": "1", "b3-1": "1", "c3-2": "1", "c3-3": "1", "d3-1": "1", "d3-2": "1", "d3-3": "1", "b4-2": "1", "c4-3": "1", "c5-1": "1", "c5-2": "1", "c5-3": "1", "c5-4": "1"}};

  assert("Two loops response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Wrong number of segments around the clue',(suite) => {
  // There is one loop segment around e3 (the side shared with d3), but the clue requires two.
  let clues = {"b1": "2", "b2": "4", "a3": "0", "c3": "3", "e3": "2", "d4": "2"};
  let data = {"edges": {"a1-2": "1", "b1-2": "1", "b1-3": "1", "c1-3": "1", "a2-1": "1", "b2-3": "1", "c2-1": "1", "d2-3": "1", "b3-1": "1", "c3-2": "1", "c3-3": "1", "d3-1": "1", "d3-2": "1", "d3-3": "1"}};

  assert("Wrong clue response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["e3"]});
}),

test('Empty list of edges',(suite) => {
  let clues = {"b1": "2", "b2": "4", "a3": "0", "c3": "3", "e3": "1", "d4": "2"};
  let data = {"edges": {}};

  assert("Empty list of edges response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Edges outside the grid only',(suite) => {
  let clues = {"b1": "2", "b2": "4", "a3": "0", "c3": "3", "e3": "1", "d4": "2"};
  // Cell z9 doesn't exist in the grid, so there are no edges to build the loop.
  let data = {"edges": {"z9-0": "1", "a1-7": "1"}};

  assert("Edges outside the grid response").that(Checker.check("3x3", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

);
