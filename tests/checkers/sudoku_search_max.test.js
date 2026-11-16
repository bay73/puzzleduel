// Solution of the 4x4 puzzle:
//   1 2 3 4      a1 b1 c1 d1
//   3 4 1 2      a2 b2 c2 d2
//   2 3 4 1      a3 b3 c3 d3
//   4 1 2 3      a4 b4 c4 d4
// Digit in a cell with an arrow is the distance to digit 4 in the direction of the arrow:
// b1 - right (4 is in d1), c2 - down (c3), a3 - right (c3), d3 - left (c3), d4 - up (d1).
checkerTestSuite("sudoku_search_max", "Search max sudoku",

test('Correct solution',(suite) => {
  let clues = {"b1": "arrow_r", "c2": "arrow_d", "a3": "arrow_r", "c3": "4", "d3": "arrow_l", "d4": "arrow_u"};
  let data = {
    "a1": "1", "b1": "2", "c1": "3", "d1": "4",
    "a2": "3", "b2": "4", "c2": "1", "d2": "2",
    "a3": "2", "b3": "3", "d3": "1",
    "a4": "4", "b4": "1", "c4": "2", "d4": "3",
  };

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digits in area',(suite) => {
  let clues = {"b1": "arrow_r", "c2": "arrow_d", "a3": "arrow_r", "c3": "4", "d3": "arrow_l", "d4": "arrow_u"};
  // a4 is 2 instead of 4, so the bottom left area contains 2 twice.
  let data = {
    "a1": "1", "b1": "2", "c1": "3", "d1": "4",
    "a2": "3", "b2": "4", "c2": "1", "d2": "2",
    "a3": "2", "b3": "3", "d3": "1",
    "a4": "2", "b4": "1", "c4": "2", "d4": "3",
  };

  assert("Repeated digits in area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every area", errors: ["a3", "a4", "b3", "b4"]});
}),

test('Repeated digits in row',(suite) => {
  let clues = {"b1": "arrow_r", "c2": "arrow_d", "a3": "arrow_r", "c3": "4", "d3": "arrow_l", "d4": "arrow_u"};
  // a1 and a2 are swapped: all areas are still correct, but the first row contains 3 twice.
  let data = {
    "a1": "3", "b1": "2", "c1": "3", "d1": "4",
    "a2": "1", "b2": "4", "c2": "1", "d2": "2",
    "a3": "2", "b3": "3", "d3": "1",
    "a4": "4", "b4": "1", "c4": "2", "d4": "3",
  };

  assert("Repeated digits in row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every row", errors: ["a1", "b1", "c1", "d1"]});
}),

test('Repeated digits in column',(suite) => {
  let clues = {"b1": "arrow_r", "c2": "arrow_d", "a3": "arrow_r", "c3": "4", "d3": "arrow_l", "d4": "arrow_u"};
  // a1 and b1 are swapped: all areas and rows are still correct, but column a contains 2 twice.
  let data = {
    "a1": "2", "b1": "1", "c1": "3", "d1": "4",
    "a2": "3", "b2": "4", "c2": "1", "d2": "2",
    "a3": "2", "b3": "3", "d3": "1",
    "a4": "4", "b4": "1", "c4": "2", "d4": "3",
  };

  assert("Repeated digits in column response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every column", errors: ["a1", "a2", "a3", "a4"]});
}),

test('Wrong distance in row',(suite) => {
  let clues = {"b1": "arrow_r", "c2": "arrow_d", "a3": "arrow_r", "c3": "4", "d3": "arrow_l", "d4": "arrow_u"};
  // Correct sudoku and all other arrows are correct, but b1 with the arrow to the right contains 4 itself.
  let data = {
    "a1": "1", "b1": "4", "c1": "2", "d1": "3",
    "a2": "3", "b2": "2", "c2": "1", "d2": "4",
    "a3": "2", "b3": "3", "d3": "1",
    "a4": "4", "b4": "1", "c4": "3", "d4": "2",
  };

  assert("Wrong distance in row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The digit should be equal to the distance to the maximum value in the row", errors: ["b1"]});
}),

test('Wrong distance in column',(suite) => {
  let clues = {"b1": "arrow_r", "c2": "arrow_d", "a3": "arrow_r", "c3": "4", "d3": "arrow_l", "d4": "arrow_u"};
  // Correct sudoku and all other arrows are correct, but c2 with the arrow down contains 3,
  // while 4 is in the next cell (c3).
  let data = {
    "a1": "3", "b1": "2", "c1": "1", "d1": "4",
    "a2": "1", "b2": "4", "c2": "3", "d2": "2",
    "a3": "2", "b3": "3", "d3": "1",
    "a4": "4", "b4": "1", "c4": "2", "d4": "3",
  };

  assert("Wrong distance in column response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The digit should be equal to the distance to the maximum value in the column", errors: ["c2"]});
}),

);
