// Solution of the 6x6 puzzle (areas are 3x2 rectangles):
//   1 2 3 4 5 6      a1 b1 c1 d1 e1 f1
//   4 5 6 1 2 3      a2 b2 c2 d2 e2 f2
//   2 3 1 5 6 4      a3 b3 c3 d3 e3 f3
//   5 6 4 2 3 1      a4 b4 c4 d4 e4 f4
//   3 1 5 6 4 2      a5 b5 c5 d5 e5 f5
//   6 4 2 3 1 5      a6 b6 c6 d6 e6 f6
// All pairs of adjacent cells which form a perfect square (16, 25, 36, 64) when read from left to right
// or from top to bottom are marked with a dot.
// Horizontal pairs (edge "e3-1" is the right edge of e3): e3-f3, b4-c4, d5-e5, a6-b6 (all are 64).
// Vertical pairs (edge "b1-2" is the bottom edge of b1): b1-b2 (25), c1-c2 (36), a3-a4 (25), b3-b4 (36), a5-a6 (36), f5-f6 (25).
checkerTestSuite("sudoku_square_number", "Square number sudoku",

test('Correct solution',(suite) => {
  let clues = {"edges": {"b1-2": "black_circle", "c1-2": "black_circle", "a3-2": "black_circle", "b3-2": "black_circle", "e3-1": "black_circle", "b4-1": "black_circle", "a5-2": "black_circle", "d5-1": "black_circle", "f5-2": "black_circle", "a6-1": "black_circle"}, "a1": "1", "f6": "5"};
  let data = {
    "b1": "2", "c1": "3", "d1": "4", "e1": "5", "f1": "6",
    "a2": "4", "b2": "5", "c2": "6", "d2": "1", "e2": "2", "f2": "3",
    "a3": "2", "b3": "3", "c3": "1", "d3": "5", "e3": "6", "f3": "4",
    "a4": "5", "b4": "6", "c4": "4", "d4": "2", "e4": "3", "f4": "1",
    "a5": "3", "b5": "1", "c5": "5", "d5": "6", "e5": "4", "f5": "2",
    "a6": "6", "b6": "4", "c6": "2", "d6": "3", "e6": "1",
  };

  assert("Correct solution response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digits in area',(suite) => {
  let clues = {"edges": {"b1-2": "black_circle", "c1-2": "black_circle", "a3-2": "black_circle", "b3-2": "black_circle", "e3-1": "black_circle", "b4-1": "black_circle", "a5-2": "black_circle", "d5-1": "black_circle", "f5-2": "black_circle", "a6-1": "black_circle"}, "a1": "1", "f6": "5"};
  // Rows 2 and 3 are swapped: all rows and columns are still correct, but area a1-c2 contains 1, 2 and 3 twice.
  let data = {
    "b1": "2", "c1": "3", "d1": "4", "e1": "5", "f1": "6",
    "a2": "2", "b2": "3", "c2": "1", "d2": "5", "e2": "6", "f2": "4",
    "a3": "4", "b3": "5", "c3": "6", "d3": "1", "e3": "2", "f3": "3",
    "a4": "5", "b4": "6", "c4": "4", "d4": "2", "e4": "3", "f4": "1",
    "a5": "3", "b5": "1", "c5": "5", "d5": "6", "e5": "4", "f5": "2",
    "a6": "6", "b6": "4", "c6": "2", "d6": "3", "e6": "1",
  };

  assert("Repeated digits in area response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "All digits should be exactly once in every area", errors: ["a1", "a2", "b1", "b2", "c1", "c2"]});
}),

test('Repeated digits in row',(suite) => {
  let clues = {"edges": {"b1-2": "black_circle", "c1-2": "black_circle", "a3-2": "black_circle", "b3-2": "black_circle", "e3-1": "black_circle", "b4-1": "black_circle", "a5-2": "black_circle", "d5-1": "black_circle", "f5-2": "black_circle", "a6-1": "black_circle"}, "a1": "1", "f6": "5"};
  // b1 and b2 are swapped: all areas are still correct, but the first row contains 5 twice.
  let data = {
    "b1": "5", "c1": "3", "d1": "4", "e1": "5", "f1": "6",
    "a2": "4", "b2": "2", "c2": "6", "d2": "1", "e2": "2", "f2": "3",
    "a3": "2", "b3": "3", "c3": "1", "d3": "5", "e3": "6", "f3": "4",
    "a4": "5", "b4": "6", "c4": "4", "d4": "2", "e4": "3", "f4": "1",
    "a5": "3", "b5": "1", "c5": "5", "d5": "6", "e5": "4", "f5": "2",
    "a6": "6", "b6": "4", "c6": "2", "d6": "3", "e6": "1",
  };

  assert("Repeated digits in row response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "All digits should be exactly once in every row", errors: ["a1", "b1", "c1", "d1", "e1", "f1"]});
}),

test('Repeated digits in column',(suite) => {
  let clues = {"edges": {"b1-2": "black_circle", "c1-2": "black_circle", "a3-2": "black_circle", "b3-2": "black_circle", "e3-1": "black_circle", "b4-1": "black_circle", "a5-2": "black_circle", "d5-1": "black_circle", "f5-2": "black_circle", "a6-1": "black_circle"}, "a1": "1", "f6": "5"};
  // b1 and c1 are swapped: all areas and rows are still correct, but column b contains 3 twice.
  let data = {
    "b1": "3", "c1": "2", "d1": "4", "e1": "5", "f1": "6",
    "a2": "4", "b2": "5", "c2": "6", "d2": "1", "e2": "2", "f2": "3",
    "a3": "2", "b3": "3", "c3": "1", "d3": "5", "e3": "6", "f3": "4",
    "a4": "5", "b4": "6", "c4": "4", "d4": "2", "e4": "3", "f4": "1",
    "a5": "3", "b5": "1", "c5": "5", "d5": "6", "e5": "4", "f5": "2",
    "a6": "6", "b6": "4", "c6": "2", "d6": "3", "e6": "1",
  };

  assert("Repeated digits in column response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "All digits should be exactly once in every column", errors: ["b1", "b2", "b3", "b4", "b5", "b6"]});
}),

test('Perfect square without dot',(suite) => {
  // There is no dot between e3 and f3, but they form 64.
  let clues = {"edges": {"b1-2": "black_circle", "c1-2": "black_circle", "a3-2": "black_circle", "b3-2": "black_circle", "b4-1": "black_circle", "a5-2": "black_circle", "d5-1": "black_circle", "f5-2": "black_circle", "a6-1": "black_circle"}, "a1": "1", "f6": "5"};
  let data = {
    "b1": "2", "c1": "3", "d1": "4", "e1": "5", "f1": "6",
    "a2": "4", "b2": "5", "c2": "6", "d2": "1", "e2": "2", "f2": "3",
    "a3": "2", "b3": "3", "c3": "1", "d3": "5", "e3": "6", "f3": "4",
    "a4": "5", "b4": "6", "c4": "4", "d4": "2", "e4": "3", "f4": "1",
    "a5": "3", "b5": "1", "c5": "5", "d5": "6", "e5": "4", "f5": "2",
    "a6": "6", "b6": "4", "c6": "2", "d6": "3", "e6": "1",
  };

  assert("Perfect square without dot response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "The two digit number shouldn't be a perfect square", errors: ["e3", "f3"]});
}),

test('Dot without perfect square',(suite) => {
  // There is a dot between a1 and a2, but they form 14.
  let clues = {"edges": {"a1-2": "black_circle", "b1-2": "black_circle", "c1-2": "black_circle", "a3-2": "black_circle", "b3-2": "black_circle", "e3-1": "black_circle", "b4-1": "black_circle", "a5-2": "black_circle", "d5-1": "black_circle", "f5-2": "black_circle", "a6-1": "black_circle"}, "a1": "1", "f6": "5"};
  let data = {
    "b1": "2", "c1": "3", "d1": "4", "e1": "5", "f1": "6",
    "a2": "4", "b2": "5", "c2": "6", "d2": "1", "e2": "2", "f2": "3",
    "a3": "2", "b3": "3", "c3": "1", "d3": "5", "e3": "6", "f3": "4",
    "a4": "5", "b4": "6", "c4": "4", "d4": "2", "e4": "3", "f4": "1",
    "a5": "3", "b5": "1", "c5": "5", "d5": "6", "e5": "4", "f5": "2",
    "a6": "6", "b6": "4", "c6": "2", "d6": "3", "e6": "1",
  };

  assert("Dot without perfect square response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "The two digit number should be a perfect square", errors: ["a1", "a2"]});
}),

);
