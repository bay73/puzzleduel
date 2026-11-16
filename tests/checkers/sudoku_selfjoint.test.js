// Solution of the 9x9 puzzle:
//   9 8 7 6 5 4 3 2 1      a1 b1 c1 d1 e1 f1 g1 h1 i1
//   6 5 4 3 2 1 9 8 7      a2 b2 c2 d2 e2 f2 g2 h2 i2
//   3 2 1 9 8 7 6 5 4      a3 b3 c3 d3 e3 f3 g3 h3 i3
//   8 7 6 5 4 3 2 1 9      a4 b4 c4 d4 e4 f4 g4 h4 i4
//   5 4 3 2 1 9 8 7 6      a5 b5 c5 d5 e5 f5 g5 h5 i5
//   2 1 9 8 7 6 5 4 3      a6 b6 c6 d6 e6 f6 g6 h6 i6
//   7 6 5 4 3 2 1 9 8      a7 b7 c7 d7 e7 f7 g7 h7 i7
//   4 3 2 1 9 8 7 6 5      a8 b8 c8 d8 e8 f8 g8 h8 i8
//   1 9 8 7 6 5 4 3 2      a9 b9 c9 d9 e9 f9 g9 h9 i9
// Positions inside every 3x3 area are numbered from 1 to 9 (rows from top to bottom, from left to right).
// Cells where the digit is equal to the position are shaded: h1 (2), b2 (5), e3 (8), f4 (3), i5 (6), c6 (9), g7 (1), a8 (4), d9 (7).
// Clue "-" is an empty shaded cell.
checkerTestSuite("sudoku_selfjoint", "Self joint sudoku",

test('Correct solution',(suite) => {
  let clues = {"h1": "-", "b2": "-", "e3": "-", "f4": "-", "i5": "-", "c6": "-", "g7": "-", "a8": "-", "d9": "-", "e5": "1"};
  let data = {
    "a1": "9", "b1": "8", "c1": "7", "d1": "6", "e1": "5", "f1": "4", "g1": "3", "h1": "2", "i1": "1",
    "a2": "6", "b2": "5", "c2": "4", "d2": "3", "e2": "2", "f2": "1", "g2": "9", "h2": "8", "i2": "7",
    "a3": "3", "b3": "2", "c3": "1", "d3": "9", "e3": "8", "f3": "7", "g3": "6", "h3": "5", "i3": "4",
    "a4": "8", "b4": "7", "c4": "6", "d4": "5", "e4": "4", "f4": "3", "g4": "2", "h4": "1", "i4": "9",
    "a5": "5", "b5": "4", "c5": "3", "d5": "2", "f5": "9", "g5": "8", "h5": "7", "i5": "6",
    "a6": "2", "b6": "1", "c6": "9", "d6": "8", "e6": "7", "f6": "6", "g6": "5", "h6": "4", "i6": "3",
    "a7": "7", "b7": "6", "c7": "5", "d7": "4", "e7": "3", "f7": "2", "g7": "1", "h7": "9", "i7": "8",
    "a8": "4", "b8": "3", "c8": "2", "d8": "1", "e8": "9", "f8": "8", "g8": "7", "h8": "6", "i8": "5",
    "a9": "1", "b9": "9", "c9": "8", "d9": "7", "e9": "6", "f9": "5", "g9": "4", "h9": "3", "i9": "2",
  };

  assert("Correct solution response").that(Checker.check("9x9", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digits in area',(suite) => {
  let clues = {"h1": "-", "b2": "-", "e3": "-", "f4": "-", "i5": "-", "c6": "-", "g7": "-", "a8": "-", "d9": "-", "e5": "1"};
  // Rows 3 and 4 are swapped: all rows and columns are still correct, but area a1-c3 contains 6, 7 and 8 twice.
  let data = {
    "a1": "9", "b1": "8", "c1": "7", "d1": "6", "e1": "5", "f1": "4", "g1": "3", "h1": "2", "i1": "1",
    "a2": "6", "b2": "5", "c2": "4", "d2": "3", "e2": "2", "f2": "1", "g2": "9", "h2": "8", "i2": "7",
    "a3": "8", "b3": "7", "c3": "6", "d3": "5", "e3": "4", "f3": "3", "g3": "2", "h3": "1", "i3": "9",
    "a4": "3", "b4": "2", "c4": "1", "d4": "9", "e4": "8", "f4": "7", "g4": "6", "h4": "5", "i4": "4",
    "a5": "5", "b5": "4", "c5": "3", "d5": "2", "f5": "9", "g5": "8", "h5": "7", "i5": "6",
    "a6": "2", "b6": "1", "c6": "9", "d6": "8", "e6": "7", "f6": "6", "g6": "5", "h6": "4", "i6": "3",
    "a7": "7", "b7": "6", "c7": "5", "d7": "4", "e7": "3", "f7": "2", "g7": "1", "h7": "9", "i7": "8",
    "a8": "4", "b8": "3", "c8": "2", "d8": "1", "e8": "9", "f8": "8", "g8": "7", "h8": "6", "i8": "5",
    "a9": "1", "b9": "9", "c9": "8", "d9": "7", "e9": "6", "f9": "5", "g9": "4", "h9": "3", "i9": "2",
  };

  assert("Repeated digits in area response").that(Checker.check("9x9", clues, data)).isEqualTo({status: "All digits should be exactly once in every area", errors: ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"]});
}),

test('Repeated digits in row',(suite) => {
  let clues = {"h1": "-", "b2": "-", "e3": "-", "f4": "-", "i5": "-", "c6": "-", "g7": "-", "a8": "-", "d9": "-", "e5": "1"};
  // a1 and a2 are swapped: all areas are still correct, but the first row contains 6 twice.
  let data = {
    "a1": "6", "b1": "8", "c1": "7", "d1": "6", "e1": "5", "f1": "4", "g1": "3", "h1": "2", "i1": "1",
    "a2": "9", "b2": "5", "c2": "4", "d2": "3", "e2": "2", "f2": "1", "g2": "9", "h2": "8", "i2": "7",
    "a3": "3", "b3": "2", "c3": "1", "d3": "9", "e3": "8", "f3": "7", "g3": "6", "h3": "5", "i3": "4",
    "a4": "8", "b4": "7", "c4": "6", "d4": "5", "e4": "4", "f4": "3", "g4": "2", "h4": "1", "i4": "9",
    "a5": "5", "b5": "4", "c5": "3", "d5": "2", "f5": "9", "g5": "8", "h5": "7", "i5": "6",
    "a6": "2", "b6": "1", "c6": "9", "d6": "8", "e6": "7", "f6": "6", "g6": "5", "h6": "4", "i6": "3",
    "a7": "7", "b7": "6", "c7": "5", "d7": "4", "e7": "3", "f7": "2", "g7": "1", "h7": "9", "i7": "8",
    "a8": "4", "b8": "3", "c8": "2", "d8": "1", "e8": "9", "f8": "8", "g8": "7", "h8": "6", "i8": "5",
    "a9": "1", "b9": "9", "c9": "8", "d9": "7", "e9": "6", "f9": "5", "g9": "4", "h9": "3", "i9": "2",
  };

  assert("Repeated digits in row response").that(Checker.check("9x9", clues, data)).isEqualTo({status: "All digits should be exactly once in every row", errors: ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1", "i1"]});
}),

test('Repeated digits in column',(suite) => {
  let clues = {"h1": "-", "b2": "-", "e3": "-", "f4": "-", "i5": "-", "c6": "-", "g7": "-", "a8": "-", "d9": "-", "e5": "1"};
  // a1 and b1 are swapped: all areas and rows are still correct, but column a contains 8 twice.
  let data = {
    "a1": "8", "b1": "9", "c1": "7", "d1": "6", "e1": "5", "f1": "4", "g1": "3", "h1": "2", "i1": "1",
    "a2": "6", "b2": "5", "c2": "4", "d2": "3", "e2": "2", "f2": "1", "g2": "9", "h2": "8", "i2": "7",
    "a3": "3", "b3": "2", "c3": "1", "d3": "9", "e3": "8", "f3": "7", "g3": "6", "h3": "5", "i3": "4",
    "a4": "8", "b4": "7", "c4": "6", "d4": "5", "e4": "4", "f4": "3", "g4": "2", "h4": "1", "i4": "9",
    "a5": "5", "b5": "4", "c5": "3", "d5": "2", "f5": "9", "g5": "8", "h5": "7", "i5": "6",
    "a6": "2", "b6": "1", "c6": "9", "d6": "8", "e6": "7", "f6": "6", "g6": "5", "h6": "4", "i6": "3",
    "a7": "7", "b7": "6", "c7": "5", "d7": "4", "e7": "3", "f7": "2", "g7": "1", "h7": "9", "i7": "8",
    "a8": "4", "b8": "3", "c8": "2", "d8": "1", "e8": "9", "f8": "8", "g8": "7", "h8": "6", "i8": "5",
    "a9": "1", "b9": "9", "c9": "8", "d9": "7", "e9": "6", "f9": "5", "g9": "4", "h9": "3", "i9": "2",
  };

  assert("Repeated digits in column response").that(Checker.check("9x9", clues, data)).isEqualTo({status: "All digits should be exactly once in every column", errors: ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9"]});
}),

test('Wrong digit in shaded cell',(suite) => {
  // a1 is shaded and should contain 1 (the first position of the area), but it contains 9.
  let clues = {"a1": "-", "h1": "-", "b2": "-", "e3": "-", "f4": "-", "i5": "-", "c6": "-", "g7": "-", "a8": "-", "d9": "-", "e5": "1"};
  let data = {
    "a1": "9", "b1": "8", "c1": "7", "d1": "6", "e1": "5", "f1": "4", "g1": "3", "h1": "2", "i1": "1",
    "a2": "6", "b2": "5", "c2": "4", "d2": "3", "e2": "2", "f2": "1", "g2": "9", "h2": "8", "i2": "7",
    "a3": "3", "b3": "2", "c3": "1", "d3": "9", "e3": "8", "f3": "7", "g3": "6", "h3": "5", "i3": "4",
    "a4": "8", "b4": "7", "c4": "6", "d4": "5", "e4": "4", "f4": "3", "g4": "2", "h4": "1", "i4": "9",
    "a5": "5", "b5": "4", "c5": "3", "d5": "2", "f5": "9", "g5": "8", "h5": "7", "i5": "6",
    "a6": "2", "b6": "1", "c6": "9", "d6": "8", "e6": "7", "f6": "6", "g6": "5", "h6": "4", "i6": "3",
    "a7": "7", "b7": "6", "c7": "5", "d7": "4", "e7": "3", "f7": "2", "g7": "1", "h7": "9", "i7": "8",
    "a8": "4", "b8": "3", "c8": "2", "d8": "1", "e8": "9", "f8": "8", "g8": "7", "h8": "6", "i8": "5",
    "a9": "1", "b9": "9", "c9": "8", "d9": "7", "e9": "6", "f9": "5", "g9": "4", "h9": "3", "i9": "2",
  };

  assert("Wrong digit in shaded cell response").that(Checker.check("9x9", clues, data)).isEqualTo({status: "Shaded cell should contain digit equal to its position", errors: ["a1"]});
}),

test('Position digit in white cell',(suite) => {
  // h1 is not shaded, but it contains 2 and it is the second position of the area.
  let clues = {"b2": "-", "e3": "-", "f4": "-", "i5": "-", "c6": "-", "g7": "-", "a8": "-", "d9": "-", "e5": "1"};
  let data = {
    "a1": "9", "b1": "8", "c1": "7", "d1": "6", "e1": "5", "f1": "4", "g1": "3", "h1": "2", "i1": "1",
    "a2": "6", "b2": "5", "c2": "4", "d2": "3", "e2": "2", "f2": "1", "g2": "9", "h2": "8", "i2": "7",
    "a3": "3", "b3": "2", "c3": "1", "d3": "9", "e3": "8", "f3": "7", "g3": "6", "h3": "5", "i3": "4",
    "a4": "8", "b4": "7", "c4": "6", "d4": "5", "e4": "4", "f4": "3", "g4": "2", "h4": "1", "i4": "9",
    "a5": "5", "b5": "4", "c5": "3", "d5": "2", "f5": "9", "g5": "8", "h5": "7", "i5": "6",
    "a6": "2", "b6": "1", "c6": "9", "d6": "8", "e6": "7", "f6": "6", "g6": "5", "h6": "4", "i6": "3",
    "a7": "7", "b7": "6", "c7": "5", "d7": "4", "e7": "3", "f7": "2", "g7": "1", "h7": "9", "i7": "8",
    "a8": "4", "b8": "3", "c8": "2", "d8": "1", "e8": "9", "f8": "8", "g8": "7", "h8": "6", "i8": "5",
    "a9": "1", "b9": "9", "c9": "8", "d9": "7", "e9": "6", "f9": "5", "g9": "4", "h9": "3", "i9": "2",
  };

  assert("Position digit in white cell response").that(Checker.check("9x9", clues, data)).isEqualTo({status: "White cell should not contain digit equal to its position", errors: ["h1"]});
}),

);
