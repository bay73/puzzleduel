// Puzzle 5x5 and its solution (# is a black cell):
//   # # # # #      a1 b1 c1 d1 e1
//   # 2 . # 1      a2 b2 c2 d2 e2
//   # # # # #      a3 b3 c3 d3 e3
//   3 . # . 4      a4 b4 c4 d4 e4
//   . # # . .      a5 b5 c5 d5 e5
checkerTestSuite("nurikabe", "Nurikabe",

test('Correct solution',(suite) => {
  let clues = {"b2": "2", "e2": "1", "a4": "3", "e4": "4"};
  let data = {"a1": "black", "b1": "black", "c1": "black", "d1": "black", "e1": "black", "a2": "black", "d2": "black",
              "a3": "black", "b3": "black", "c3": "black", "d3": "black", "e3": "black", "c4": "black", "b5": "black", "c5": "black"};

  assert("Correct solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "OK"});
}),

test('Black square 2x2',(suite) => {
  let clues = {"b2": "2", "e2": "1", "a4": "3", "e4": "4"};
  // Extra black cell b4 creates the square b3-c3-b4-c4.
  let data = {"a1": "black", "b1": "black", "c1": "black", "d1": "black", "e1": "black", "a2": "black", "d2": "black",
              "a3": "black", "b3": "black", "c3": "black", "d3": "black", "e3": "black", "b4": "black", "c4": "black", "b5": "black", "c5": "black"};

  assert("Black square response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "No 2x2 black squares are allowed", errors: ["b3", "c3", "b4", "c4"]});
}),

test('Black area is not connected',(suite) => {
  let clues = {"b2": "2", "e2": "1", "a4": "3", "e4": "4"};
  // Without c3 the black cells c4, b5 and c5 are separated from the others.
  let data = {"a1": "black", "b1": "black", "c1": "black", "d1": "black", "e1": "black", "a2": "black", "d2": "black",
              "a3": "black", "b3": "black", "d3": "black", "e3": "black", "c4": "black", "b5": "black", "c5": "black"};

  assert("Not connected response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Black area should be connected"});
}),

test('Wrong size of the island',(suite) => {
  let clues = {"b2": "2", "e2": "1", "a4": "3", "e4": "4"};
  // Extra black cell a5: the island with the clue 3 in a4 consists of two cells.
  let data = {"a1": "black", "b1": "black", "c1": "black", "d1": "black", "e1": "black", "a2": "black", "d2": "black",
              "a3": "black", "b3": "black", "c3": "black", "d3": "black", "e3": "black", "c4": "black", "a5": "black", "b5": "black", "c5": "black"};

  assert("Wrong island size response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["a4"]});
}),

test('Two numbers in one island',(suite) => {
  // Additional clue in a5 belongs to the same island of 3 cells as the clue in a4.
  let clues = {"b2": "2", "e2": "1", "a4": "3", "e4": "4", "a5": "3"};
  let data = {"a1": "black", "b1": "black", "c1": "black", "d1": "black", "e1": "black", "a2": "black", "d2": "black",
              "a3": "black", "b3": "black", "c3": "black", "d3": "black", "e3": "black", "c4": "black", "b5": "black", "c5": "black"};

  assert("Two numbers response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Each island should contain single", errors: ["a4"]});
}),

test('White cells without number',(suite) => {
  let clues = {"b2": "2", "e2": "1", "a4": "3", "e4": "4"};
  // Cell a1 is not black, it forms an island without number.
  let data = {"b1": "black", "c1": "black", "d1": "black", "e1": "black", "a2": "black", "d2": "black",
              "a3": "black", "b3": "black", "c3": "black", "d3": "black", "e3": "black", "c4": "black", "b5": "black", "c5": "black"};

  assert("Island without number response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "All white cells should be connected to numbers", errors: ["a1"]});
}),

);
