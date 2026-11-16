// Solution of the 8x8 puzzle (areas are 4x2 rectangles):
//   1 2 3 4 5 6 7 8      a1 b1 c1 d1 e1 f1 g1 h1
//   5 6 7 8 1 2 3 4      a2 b2 c2 d2 e2 f2 g2 h2
//   2 1 4 3 6 5 8 7      a3 b3 c3 d3 e3 f3 g3 h3
//   6 5 8 7 2 1 4 3      a4 b4 c4 d4 e4 f4 g4 h4
//   3 4 1 2 7 8 5 6      a5 b5 c5 d5 e5 f5 g5 h5
//   7 8 5 6 3 4 1 2      a6 b6 c6 d6 e6 f6 g6 h6
//   4 3 2 1 8 7 6 5      a7 b7 c7 d7 e7 f7 g7 h7
//   8 7 6 5 4 3 2 1      a8 b8 c8 d8 e8 f8 g8 h8
// A clue outside the grid describes two nearest digits: both are odd, even, big (5-8) or small (1-4).
// Top: a - odd (1, 5), b - even (2, 6). Bottom: a - even (8, 4), h - odd (1, 5).
// Left: row 1 - small (1, 2), row 2 - big (5, 6). Right: row 1 - big (8, 7), row 4 - small (3, 4).
checkerTestSuite("sudoku_odd_even_big_small", "Odd even big small sudoku",

test('Correct solution',(suite) => {
  let clues = {"top": ["odd","even",null,null,null,null,null,null], "bottom": ["even",null,null,null,null,null,null,"odd"], "left": ["small","big",null,null,null,null,null,null], "right": ["big",null,null,"small",null,null,null,null], "c3": "4"};
  let data = {
    "a1": "1", "b1": "2", "c1": "3", "d1": "4", "e1": "5", "f1": "6", "g1": "7", "h1": "8",
    "a2": "5", "b2": "6", "c2": "7", "d2": "8", "e2": "1", "f2": "2", "g2": "3", "h2": "4",
    "a3": "2", "b3": "1", "d3": "3", "e3": "6", "f3": "5", "g3": "8", "h3": "7",
    "a4": "6", "b4": "5", "c4": "8", "d4": "7", "e4": "2", "f4": "1", "g4": "4", "h4": "3",
    "a5": "3", "b5": "4", "c5": "1", "d5": "2", "e5": "7", "f5": "8", "g5": "5", "h5": "6",
    "a6": "7", "b6": "8", "c6": "5", "d6": "6", "e6": "3", "f6": "4", "g6": "1", "h6": "2",
    "a7": "4", "b7": "3", "c7": "2", "d7": "1", "e7": "8", "f7": "7", "g7": "6", "h7": "5",
    "a8": "8", "b8": "7", "c8": "6", "d8": "5", "e8": "4", "f8": "3", "g8": "2", "h8": "1",
  };

  assert("Correct solution response").that(Checker.check("8x8", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digits in area',(suite) => {
  let clues = {"top": ["odd","even",null,null,null,null,null,null], "bottom": ["even",null,null,null,null,null,null,"odd"], "left": ["small","big",null,null,null,null,null,null], "right": ["big",null,null,"small",null,null,null,null], "c3": "4"};
  // Rows 2 and 3 are swapped: all rows and columns are still correct, but area a1-d2 contains 1, 2, 3 and 4 twice.
  let data = {
    "a1": "1", "b1": "2", "c1": "3", "d1": "4", "e1": "5", "f1": "6", "g1": "7", "h1": "8",
    "a2": "2", "b2": "1", "c2": "4", "d2": "3", "e2": "6", "f2": "5", "g2": "8", "h2": "7",
    "a3": "5", "b3": "6", "d3": "8", "e3": "1", "f3": "2", "g3": "3", "h3": "4",
    "a4": "6", "b4": "5", "c4": "8", "d4": "7", "e4": "2", "f4": "1", "g4": "4", "h4": "3",
    "a5": "3", "b5": "4", "c5": "1", "d5": "2", "e5": "7", "f5": "8", "g5": "5", "h5": "6",
    "a6": "7", "b6": "8", "c6": "5", "d6": "6", "e6": "3", "f6": "4", "g6": "1", "h6": "2",
    "a7": "4", "b7": "3", "c7": "2", "d7": "1", "e7": "8", "f7": "7", "g7": "6", "h7": "5",
    "a8": "8", "b8": "7", "c8": "6", "d8": "5", "e8": "4", "f8": "3", "g8": "2", "h8": "1",
  };

  assert("Repeated digits in area response").that(Checker.check("8x8", clues, data)).isEqualTo({status: "All digits should be exactly once in every area", errors: ["a1", "a2", "b1", "b2", "c1", "c2", "d1", "d2"]});
}),

test('Repeated digits in row',(suite) => {
  let clues = {"top": ["odd","even",null,null,null,null,null,null], "bottom": ["even",null,null,null,null,null,null,"odd"], "left": ["small","big",null,null,null,null,null,null], "right": ["big",null,null,"small",null,null,null,null], "c3": "4"};
  // a1 and a2 are swapped: all areas are still correct, but the first row contains 5 twice.
  let data = {
    "a1": "5", "b1": "2", "c1": "3", "d1": "4", "e1": "5", "f1": "6", "g1": "7", "h1": "8",
    "a2": "1", "b2": "6", "c2": "7", "d2": "8", "e2": "1", "f2": "2", "g2": "3", "h2": "4",
    "a3": "2", "b3": "1", "d3": "3", "e3": "6", "f3": "5", "g3": "8", "h3": "7",
    "a4": "6", "b4": "5", "c4": "8", "d4": "7", "e4": "2", "f4": "1", "g4": "4", "h4": "3",
    "a5": "3", "b5": "4", "c5": "1", "d5": "2", "e5": "7", "f5": "8", "g5": "5", "h5": "6",
    "a6": "7", "b6": "8", "c6": "5", "d6": "6", "e6": "3", "f6": "4", "g6": "1", "h6": "2",
    "a7": "4", "b7": "3", "c7": "2", "d7": "1", "e7": "8", "f7": "7", "g7": "6", "h7": "5",
    "a8": "8", "b8": "7", "c8": "6", "d8": "5", "e8": "4", "f8": "3", "g8": "2", "h8": "1",
  };

  assert("Repeated digits in row response").that(Checker.check("8x8", clues, data)).isEqualTo({status: "All digits should be exactly once in every row", errors: ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"]});
}),

test('Repeated digits in column',(suite) => {
  let clues = {"top": ["odd","even",null,null,null,null,null,null], "bottom": ["even",null,null,null,null,null,null,"odd"], "left": ["small","big",null,null,null,null,null,null], "right": ["big",null,null,"small",null,null,null,null], "c3": "4"};
  // a1 and b1 are swapped: all areas and rows are still correct, but column a contains 2 twice.
  let data = {
    "a1": "2", "b1": "1", "c1": "3", "d1": "4", "e1": "5", "f1": "6", "g1": "7", "h1": "8",
    "a2": "5", "b2": "6", "c2": "7", "d2": "8", "e2": "1", "f2": "2", "g2": "3", "h2": "4",
    "a3": "2", "b3": "1", "d3": "3", "e3": "6", "f3": "5", "g3": "8", "h3": "7",
    "a4": "6", "b4": "5", "c4": "8", "d4": "7", "e4": "2", "f4": "1", "g4": "4", "h4": "3",
    "a5": "3", "b5": "4", "c5": "1", "d5": "2", "e5": "7", "f5": "8", "g5": "5", "h5": "6",
    "a6": "7", "b6": "8", "c6": "5", "d6": "6", "e6": "3", "f6": "4", "g6": "1", "h6": "2",
    "a7": "4", "b7": "3", "c7": "2", "d7": "1", "e7": "8", "f7": "7", "g7": "6", "h7": "5",
    "a8": "8", "b8": "7", "c8": "6", "d8": "5", "e8": "4", "f8": "3", "g8": "2", "h8": "1",
  };

  assert("Repeated digits in column response").that(Checker.check("8x8", clues, data)).isEqualTo({status: "All digits should be exactly once in every column", errors: ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8"]});
}),

test('Wrong top clue',(suite) => {
  // Top clue of column a is "big", but a1 is 1.
  let clues = {"top": ["big","even",null,null,null,null,null,null], "bottom": ["even",null,null,null,null,null,null,"odd"], "left": ["small","big",null,null,null,null,null,null], "right": ["big",null,null,"small",null,null,null,null], "c3": "4"};
  let data = {
    "a1": "1", "b1": "2", "c1": "3", "d1": "4", "e1": "5", "f1": "6", "g1": "7", "h1": "8",
    "a2": "5", "b2": "6", "c2": "7", "d2": "8", "e2": "1", "f2": "2", "g2": "3", "h2": "4",
    "a3": "2", "b3": "1", "d3": "3", "e3": "6", "f3": "5", "g3": "8", "h3": "7",
    "a4": "6", "b4": "5", "c4": "8", "d4": "7", "e4": "2", "f4": "1", "g4": "4", "h4": "3",
    "a5": "3", "b5": "4", "c5": "1", "d5": "2", "e5": "7", "f5": "8", "g5": "5", "h5": "6",
    "a6": "7", "b6": "8", "c6": "5", "d6": "6", "e6": "3", "f6": "4", "g6": "1", "h6": "2",
    "a7": "4", "b7": "3", "c7": "2", "d7": "1", "e7": "8", "f7": "7", "g7": "6", "h7": "5",
    "a8": "8", "b8": "7", "c8": "6", "d8": "5", "e8": "4", "f8": "3", "g8": "2", "h8": "1",
  };

  assert("Wrong top clue response").that(Checker.check("8x8", clues, data)).isEqualTo({status: "Wrong condition for the first two digits in the column", errors: ["a1", "a2"]});
}),

test('Wrong bottom clue',(suite) => {
  // Bottom clue of column a is "odd", but a8 is 8 and a7 is 4.
  let clues = {"top": ["odd","even",null,null,null,null,null,null], "bottom": ["odd",null,null,null,null,null,null,"odd"], "left": ["small","big",null,null,null,null,null,null], "right": ["big",null,null,"small",null,null,null,null], "c3": "4"};
  let data = {
    "a1": "1", "b1": "2", "c1": "3", "d1": "4", "e1": "5", "f1": "6", "g1": "7", "h1": "8",
    "a2": "5", "b2": "6", "c2": "7", "d2": "8", "e2": "1", "f2": "2", "g2": "3", "h2": "4",
    "a3": "2", "b3": "1", "d3": "3", "e3": "6", "f3": "5", "g3": "8", "h3": "7",
    "a4": "6", "b4": "5", "c4": "8", "d4": "7", "e4": "2", "f4": "1", "g4": "4", "h4": "3",
    "a5": "3", "b5": "4", "c5": "1", "d5": "2", "e5": "7", "f5": "8", "g5": "5", "h5": "6",
    "a6": "7", "b6": "8", "c6": "5", "d6": "6", "e6": "3", "f6": "4", "g6": "1", "h6": "2",
    "a7": "4", "b7": "3", "c7": "2", "d7": "1", "e7": "8", "f7": "7", "g7": "6", "h7": "5",
    "a8": "8", "b8": "7", "c8": "6", "d8": "5", "e8": "4", "f8": "3", "g8": "2", "h8": "1",
  };

  assert("Wrong bottom clue response").that(Checker.check("8x8", clues, data)).isEqualTo({status: "Wrong condition for the last two digits in the column", errors: ["a8", "a7"]});
}),

test('Wrong left clue',(suite) => {
  // Left clue of the first row is "big", but a1 is 1 and b1 is 2.
  let clues = {"top": ["odd","even",null,null,null,null,null,null], "bottom": ["even",null,null,null,null,null,null,"odd"], "left": ["big","big",null,null,null,null,null,null], "right": ["big",null,null,"small",null,null,null,null], "c3": "4"};
  let data = {
    "a1": "1", "b1": "2", "c1": "3", "d1": "4", "e1": "5", "f1": "6", "g1": "7", "h1": "8",
    "a2": "5", "b2": "6", "c2": "7", "d2": "8", "e2": "1", "f2": "2", "g2": "3", "h2": "4",
    "a3": "2", "b3": "1", "d3": "3", "e3": "6", "f3": "5", "g3": "8", "h3": "7",
    "a4": "6", "b4": "5", "c4": "8", "d4": "7", "e4": "2", "f4": "1", "g4": "4", "h4": "3",
    "a5": "3", "b5": "4", "c5": "1", "d5": "2", "e5": "7", "f5": "8", "g5": "5", "h5": "6",
    "a6": "7", "b6": "8", "c6": "5", "d6": "6", "e6": "3", "f6": "4", "g6": "1", "h6": "2",
    "a7": "4", "b7": "3", "c7": "2", "d7": "1", "e7": "8", "f7": "7", "g7": "6", "h7": "5",
    "a8": "8", "b8": "7", "c8": "6", "d8": "5", "e8": "4", "f8": "3", "g8": "2", "h8": "1",
  };

  assert("Wrong left clue response").that(Checker.check("8x8", clues, data)).isEqualTo({status: "Wrong condition for the first two digits in the row", errors: ["a1", "b1"]});
}),

);
