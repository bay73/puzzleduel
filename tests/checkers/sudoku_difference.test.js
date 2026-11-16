// Solution of the 4x4 puzzle. Clues on the edges show difference between digits in the adjacent cells:
// 2 between a1 and a2, 3 between b2 and b3, 2 between c3 and c4, 3 between b3 and c3.
//   1 2 3 4
//   3 4 1 2
//   2 1 4 3
//   4 3 2 1
checkerTestSuite("sudoku_difference", "Difference Sudoku",

test('Correct solution',(suite) => {
  let clues = {"d1": "4", "d3": "3", "edges": {"a1-2": "-2", "b2-2": "-3", "c3-2": "-2", "b3-1": "-3"}};
  let data = {"a1": "1", "b1": "2", "c1": "3",
              "a2": "3", "b2": "4", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "c3": "4",
              "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digit in area',(suite) => {
  let clues = {"d1": "4", "d3": "3", "edges": {"a1-2": "-2", "b2-2": "-3", "c3-2": "-2", "b3-1": "-3"}};
  // Digits in b1 and c1 are exchanged, so 3 is twice in the top left area.
  let data = {"a1": "1", "b1": "3", "c1": "2",
              "a2": "3", "b2": "4", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "c3": "4",
              "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Repeated digit in area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every area", errors: ["a1", "a2", "b1", "b2"]});
}),

test('Repeated digit in row',(suite) => {
  let clues = {"d1": "4", "d3": "3", "edges": {"a1-2": "-2", "b2-2": "-3", "c3-2": "-2", "b3-1": "-3"}};
  // Digits in b1 and b2 are exchanged: all areas are correct, but 4 is twice in the first row.
  let data = {"a1": "1", "b1": "4", "c1": "3",
              "a2": "3", "b2": "2", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "c3": "4",
              "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Repeated digit in row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every row", errors: ["a1", "b1", "c1", "d1"]});
}),

test('Repeated digit in column',(suite) => {
  let clues = {"d1": "4", "d3": "3", "edges": {"a1-2": "-2", "b2-2": "-3", "c3-2": "-2", "b3-1": "-3"}};
  // Digits in a2 and b2 are exchanged: all areas and rows are correct, but 4 is twice in the first column.
  let data = {"a1": "1", "b1": "2", "c1": "3",
              "a2": "4", "b2": "3", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "c3": "4",
              "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Repeated digit in column response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every column", errors: ["a1", "a2", "a3", "a4"]});
}),

test('Wrong difference',(suite) => {
  let clues = {"d1": "4", "d3": "3", "edges": {"a1-2": "-2", "b2-2": "-3", "c3-2": "-2", "b3-1": "-3"}};
  // Valid sudoku, but difference between a1 and a2 is 3 and the clue is 2.
  let data = {"a1": "1", "b1": "2", "c1": "3",
              "a2": "4", "b2": "3", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "c3": "4",
              "a4": "3", "b4": "4", "c4": "2", "d4": "1"};

  assert("Wrong difference response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["a1", "a2"]});
}),

test('Wrong difference on the right edge',(suite) => {
  // The clue between b3 and c3 is 2, but the digits are 1 and 4.
  let clues = {"d1": "4", "d3": "3", "edges": {"a1-2": "-2", "b2-2": "-3", "c3-2": "-2", "b3-1": "-2"}};
  let data = {"a1": "1", "b1": "2", "c1": "3",
              "a2": "3", "b2": "4", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "c3": "4",
              "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Wrong difference response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["b3", "c3"]});
}),

test('Wrong difference on the edge with letter side',(suite) => {
  // Sides can be given also as "r" (right) and "b" (bottom): difference between a1 and b1 is 1, not 3.
  let clues = {"d1": "4", "d3": "3", "edges": {"a1-b": "-2", "a1-r": "-3"}};
  let data = {"a1": "1", "b1": "2", "c1": "3",
              "a2": "3", "b2": "4", "c2": "1", "d2": "2",
              "a3": "2", "b3": "1", "c3": "4",
              "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Wrong difference response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["a1", "b1"]});
}),

);
