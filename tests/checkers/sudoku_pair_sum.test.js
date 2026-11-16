// Solution of the 4x4 puzzle:
//   2 3 1 4      a1 b1 c1 d1
//   1 4 2 3      a2 b2 c2 d2
//   3 1 4 2      a3 b3 c3 d3
//   4 2 3 1      a4 b4 c4 d4
// Clues on the edges are sums of digits in two cells sharing the edge:
// b1+c1=4 (edge "b1-1" is the right edge of b1), c2+d2=5, a2+a3=4 (edge "a2-2" is the bottom edge of a2).
checkerTestSuite("sudoku_pair_sum", "Pair sum sudoku",

test('Correct solution',(suite) => {
  let clues = {"edges": {"b1-1": "+4", "c2-1": "+5", "a2-2": "+4"}, "a1": "2"};
  let data = {
    "b1": "3", "c1": "1", "d1": "4",
    "a2": "1", "b2": "4", "c2": "2", "d2": "3",
    "a3": "3", "b3": "1", "c3": "4", "d3": "2",
    "a4": "4", "b4": "2", "c4": "3", "d4": "1",
  };

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digits in area',(suite) => {
  let clues = {"edges": {"b1-1": "+4", "c2-1": "+5", "a2-2": "+4"}, "a1": "2"};
  // d4 is 2 instead of 1, so the bottom right area contains 2 twice.
  let data = {
    "b1": "3", "c1": "1", "d1": "4",
    "a2": "1", "b2": "4", "c2": "2", "d2": "3",
    "a3": "3", "b3": "1", "c3": "4", "d3": "2",
    "a4": "4", "b4": "2", "c4": "3", "d4": "2",
  };

  assert("Repeated digits in area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every area", errors: ["c3", "c4", "d3", "d4"]});
}),

test('Repeated digits in row',(suite) => {
  let clues = {"edges": {"b1-1": "+4", "c2-1": "+5", "a2-2": "+4"}, "a1": "2"};
  // d3 and d4 are swapped: all areas are still correct, but the third row contains 1 twice.
  let data = {
    "b1": "3", "c1": "1", "d1": "4",
    "a2": "1", "b2": "4", "c2": "2", "d2": "3",
    "a3": "3", "b3": "1", "c3": "4", "d3": "1",
    "a4": "4", "b4": "2", "c4": "3", "d4": "2",
  };

  assert("Repeated digits in row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every row", errors: ["a3", "b3", "c3", "d3"]});
}),

test('Repeated digits in column',(suite) => {
  let clues = {"edges": {"b1-1": "+4", "c2-1": "+5", "a2-2": "+4"}, "a1": "2"};
  // c3 and d3 are swapped: all areas and rows are still correct, but column c contains 2 twice.
  let data = {
    "b1": "3", "c1": "1", "d1": "4",
    "a2": "1", "b2": "4", "c2": "2", "d2": "3",
    "a3": "3", "b3": "1", "c3": "2", "d3": "4",
    "a4": "4", "b4": "2", "c4": "3", "d4": "1",
  };

  assert("Repeated digits in column response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every column", errors: ["c1", "c2", "c3", "c4"]});
}),

test('Wrong sum of horizontal pair',(suite) => {
  let clues = {"edges": {"b1-1": "+4", "c2-1": "+5", "a2-2": "+4"}, "a1": "2"};
  // Columns c and d of the solution are swapped: it is still a correct sudoku, but b1+c1 is 3+4=7 instead of 4.
  let data = {
    "b1": "3", "c1": "4", "d1": "1",
    "a2": "1", "b2": "4", "c2": "3", "d2": "2",
    "a3": "3", "b3": "1", "c3": "2", "d3": "4",
    "a4": "4", "b4": "2", "c4": "1", "d4": "3",
  };

  assert("Wrong sum of horizontal pair response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["b1", "c1"]});
}),

test('Wrong sum of vertical pair',(suite) => {
  let clues = {"edges": {"b1-1": "+4", "c2-1": "+5", "a2-2": "+4"}, "a1": "2"};
  // Rows 3 and 4 of the solution are swapped: it is still a correct sudoku, but a2+a3 is 1+4=5 instead of 4.
  let data = {
    "b1": "3", "c1": "1", "d1": "4",
    "a2": "1", "b2": "4", "c2": "2", "d2": "3",
    "a3": "4", "b3": "2", "c3": "3", "d3": "1",
    "a4": "3", "b4": "1", "c4": "4", "d4": "2",
  };

  assert("Wrong sum of vertical pair response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["a2", "a3"]});
}),

);
