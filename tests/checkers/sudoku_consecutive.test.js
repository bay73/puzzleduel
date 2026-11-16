// Solution of the 4x4 puzzle. There is a dot on every edge between cells with consecutive digits
// (edge "a1-1" is the right side of a1, "a1-2" is the bottom side of a1).
//   1 2 3 4
//   4 3 1 2
//   2 1 4 3
//   3 4 2 1
checkerTestSuite("sudoku_consecutive", "Consecutive Sudoku",

test('Correct solution',(suite) => {
  let clues = {"d1": "4", "b3": "1",
               "edges": {"a1-1": "white_dot", "b1-1": "white_dot", "b1-2": "white_dot", "c1-1": "white_dot", "a2-1": "white_dot", "c2-1": "white_dot", "d2-2": "white_dot", "a3-1": "white_dot", "a3-2": "white_dot", "c3-1": "white_dot", "a4-1": "white_dot", "c4-1": "white_dot"}};
  let data = {"a1": "1", "b1": "2", "c1": "3",
              "a2": "4", "b2": "3", "c2": "1", "d2": "2",
              "a3": "2", "c3": "4", "d3": "3",
              "a4": "3", "b4": "4", "c4": "2", "d4": "1"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digit in area',(suite) => {
  let clues = {"d1": "4", "b3": "1",
               "edges": {"a1-1": "white_dot", "b1-1": "white_dot", "b1-2": "white_dot", "c1-1": "white_dot", "a2-1": "white_dot", "c2-1": "white_dot", "d2-2": "white_dot", "a3-1": "white_dot", "a3-2": "white_dot", "c3-1": "white_dot", "a4-1": "white_dot", "c4-1": "white_dot"}};
  // Digits in b1 and c1 are exchanged, so 3 is twice in the top left area.
  let data = {"a1": "1", "b1": "3", "c1": "2",
              "a2": "4", "b2": "3", "c2": "1", "d2": "2",
              "a3": "2", "c3": "4", "d3": "3",
              "a4": "3", "b4": "4", "c4": "2", "d4": "1"};

  assert("Repeated digit in area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every area", errors: ["a1", "a2", "b1", "b2"]});
}),

test('Repeated digit in row',(suite) => {
  let clues = {"d1": "4", "b3": "1",
               "edges": {"a1-1": "white_dot", "b1-1": "white_dot", "b1-2": "white_dot", "c1-1": "white_dot", "a2-1": "white_dot", "c2-1": "white_dot", "d2-2": "white_dot", "a3-1": "white_dot", "a3-2": "white_dot", "c3-1": "white_dot", "a4-1": "white_dot", "c4-1": "white_dot"}};
  // Digits in b1 and b2 are exchanged: all areas are correct, but 3 is twice in the first row.
  let data = {"a1": "1", "b1": "3", "c1": "3",
              "a2": "4", "b2": "2", "c2": "1", "d2": "2",
              "a3": "2", "c3": "4", "d3": "3",
              "a4": "3", "b4": "4", "c4": "2", "d4": "1"};

  assert("Repeated digit in row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every row", errors: ["a1", "b1", "c1", "d1"]});
}),

test('Repeated digit in column',(suite) => {
  let clues = {"d1": "4", "b3": "1",
               "edges": {"a1-1": "white_dot", "b1-1": "white_dot", "b1-2": "white_dot", "c1-1": "white_dot", "a2-1": "white_dot", "c2-1": "white_dot", "d2-2": "white_dot", "a3-1": "white_dot", "a3-2": "white_dot", "c3-1": "white_dot", "a4-1": "white_dot", "c4-1": "white_dot"}};
  // Digits in a2 and b2 are exchanged: all areas and rows are correct, but 3 is twice in the first column.
  let data = {"a1": "1", "b1": "2", "c1": "3",
              "a2": "3", "b2": "4", "c2": "1", "d2": "2",
              "a3": "2", "c3": "4", "d3": "3",
              "a4": "3", "b4": "4", "c4": "2", "d4": "1"};

  assert("Repeated digit in column response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every column", errors: ["a1", "a2", "a3", "a4"]});
}),

test('Consecutive digits without dot',(suite) => {
  let clues = {"d1": "4", "b3": "1",
               "edges": {"a1-1": "white_dot", "b1-1": "white_dot", "b1-2": "white_dot", "c1-1": "white_dot", "a2-1": "white_dot", "c2-1": "white_dot", "d2-2": "white_dot", "a3-1": "white_dot", "a3-2": "white_dot", "c3-1": "white_dot", "a4-1": "white_dot", "c4-1": "white_dot"}};
  // Valid sudoku, but there is no dot between b4 and c4, which contain 3 and 2.
  let data = {"a1": "1", "b1": "2", "c1": "3",
              "a2": "3", "b2": "4", "c2": "1", "d2": "2",
              "a3": "2", "c3": "4", "d3": "3",
              "a4": "4", "b4": "3", "c4": "2", "d4": "1"};

  assert("Consecutive digits without dot response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The digits shouldn't be consecutive", errors: ["b4", "c4"]});
}),

test('Not consecutive digits around dot',(suite) => {
  let clues = {"d1": "4", "b3": "1",
               "edges": {"a1-1": "white_dot", "b1-1": "white_dot", "b1-2": "white_dot", "c1-1": "white_dot", "a2-1": "white_dot", "c2-1": "white_dot", "d2-2": "white_dot", "a3-1": "white_dot", "a3-2": "white_dot", "c3-1": "white_dot", "a4-1": "white_dot", "c4-1": "white_dot"}};
  // Valid sudoku, but there is a dot between b1 and b2, which contain 2 and 4.
  let data = {"a1": "1", "b1": "2", "c1": "3",
              "a2": "3", "b2": "4", "c2": "2", "d2": "1",
              "a3": "2", "c3": "4", "d3": "3",
              "a4": "4", "b4": "3", "c4": "1", "d4": "2"};

  assert("Not consecutive digits around dot response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The digits should be consecutive", errors: ["b1", "b2"]});
}),

);
