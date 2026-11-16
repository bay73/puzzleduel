// Puzzle 7x7 and its solution (products are given at the right and at the bottom):
//   2 . 3 . . . .   6      a1 b1 c1 d1 e1 f1 g1
//   . . . 4 . 1 .   4      a2 b2 c2 d2 e2 f2 g2
//   5 . . . 2 . .  10      a3 b3 c3 d3 e3 f3 g3
//   . 3 . . . . 3   9      a4 b4 c4 d4 e4 f4 g4
//   . . 1 . 6 . .   6      a5 b5 c5 d5 e5 f5 g5
//   . 2 . . . 7 .  14      a6 b6 c6 d6 e6 f6 g6
//   . . . 2 . . 4   8      a7 b7 c7 d7 e7 f7 g7
//  10 6 3 8 12 7 12
checkerTestSuite("product_kuromasu", "Product Kuromasu",

test('Correct solution',(suite) => {
  let clues = {"bottom": ["10", "6", "3", "8", "12", "7", "12"], "right": ["6", "4", "10", "9", "6", "14", "8"]};
  let data = {"a1": "2", "c1": "3", "d2": "4", "f2": "1", "a3": "5", "e3": "2", "b4": "3", "g4": "3", "c5": "1", "e5": "6", "b6": "2", "f6": "7", "d7": "2", "g7": "4"};

  assert("Correct solution response").that(Checker.check("7x7", clues, data)).isEqualTo({status: "OK"});
}),

test('White area is not connected',(suite) => {
  let clues = {"bottom": ["10", "6", "3", "8", "12", "7", "12"], "right": ["6", "4", "10", "9", "6", "14", "8"]};
  // Extra digit in b2 separates the white cell b1 from the others.
  let data = {"a1": "2", "c1": "3", "b2": "1", "d2": "4", "f2": "1", "a3": "5", "e3": "2", "b4": "3", "g4": "3", "c5": "1", "e5": "6", "b6": "2", "f6": "7", "d7": "2", "g7": "4"};

  assert("White area is not connected response").that(Checker.check("7x7", clues, data)).isEqualTo({status: "White area should be connected"});
}),

test('Digits share an edge',(suite) => {
  let clues = {"bottom": ["10", "6", "3", "8", "12", "7", "12"], "right": ["6", "4", "10", "9", "6", "14", "8"]};
  // Digit 5 is placed to a2 instead of a3, so it is next to the digit in a1.
  let data = {"a1": "2", "c1": "3", "a2": "5", "d2": "4", "f2": "1", "e3": "2", "b4": "3", "g4": "3", "c5": "1", "e5": "6", "b6": "2", "f6": "7", "d7": "2", "g7": "4"};

  assert("Digits share an edge response").that(Checker.check("7x7", clues, data)).isEqualTo({status: "Cells with digits shouldn't share an edge", errors: ["a1", "a2"]});
}),

test('Wrong number of digits in the column',(suite) => {
  let clues = {"bottom": ["10", "6", "3", "8", "12", "7", "12"], "right": ["6", "4", "10", "9", "6", "14", "8"]};
  // Digit in g7 is missing, so there is only one digit in the column g.
  let data = {"a1": "2", "c1": "3", "d2": "4", "f2": "1", "a3": "5", "e3": "2", "b4": "3", "g4": "3", "c5": "1", "e5": "6", "b6": "2", "f6": "7", "d7": "2"};

  assert("Wrong number of digits in the column response").that(Checker.check("7x7", clues, data)).isEqualTo({status: "There should be 2 digits in the column", errors: ["g1", "g2", "g3", "g4", "g5", "g6", "g7"]});
}),

test('Wrong product in the column',(suite) => {
  let clues = {"bottom": ["10", "6", "3", "8", "12", "7", "12"], "right": ["6", "4", "10", "9", "6", "14", "8"]};
  // Digit 4 in a1 instead of 2: the product in the column a is 20, not 10.
  let data = {"a1": "4", "c1": "3", "d2": "4", "f2": "1", "a3": "5", "e3": "2", "b4": "3", "g4": "3", "c5": "1", "e5": "6", "b6": "2", "f6": "7", "d7": "2", "g7": "4"};

  assert("Wrong product in the column response").that(Checker.check("7x7", clues, data)).isEqualTo({status: "Wrong product for the column", errors: ["a1", "a2", "a3", "a4", "a5", "a6", "a7"]});
}),

test('Wrong number of digits in the row',(suite) => {
  // There is no clue for the column g.
  let clues = {"bottom": ["10", "6", "3", "8", "12", "7", null], "right": ["6", "4", "10", "9", "6", "14", "8"]};
  // Digit in g7 is missing, so there is only one digit in the row 7.
  let data = {"a1": "2", "c1": "3", "d2": "4", "f2": "1", "a3": "5", "e3": "2", "b4": "3", "g4": "3", "c5": "1", "e5": "6", "b6": "2", "f6": "7", "d7": "2"};

  assert("Wrong number of digits in the row response").that(Checker.check("7x7", clues, data)).isEqualTo({status: "There should be 2 digits in the row", errors: ["a7", "b7", "c7", "d7", "e7", "f7", "g7"]});
}),

test('Wrong product in the row',(suite) => {
  let clues = {"bottom": ["10", "6", "3", "8", "12", "7", "12"], "right": ["6", "4", "10", "9", "6", "14", "8"]};
  // Digits in a1 and a3 are swapped: the product in the column a is still 10, but the product in the row 1 is 15, not 6.
  let data = {"a1": "5", "c1": "3", "d2": "4", "f2": "1", "a3": "2", "e3": "2", "b4": "3", "g4": "3", "c5": "1", "e5": "6", "b6": "2", "f6": "7", "d7": "2", "g7": "4"};

  assert("Wrong product in the row response").that(Checker.check("7x7", clues, data)).isEqualTo({status: "Wrong product for the row", errors: ["a1", "b1", "c1", "d1", "e1", "f1", "g1"]});
}),

);
