// Puzzle 5x5 and its solution:
//   . . . . .      . 1 . . .      a1 b1 c1 d1 e1
//   . 3 . . .      1 3 2 . .      a2 b2 c2 d2 e2
//   . . . 1 .      . . 3 1 .      a3 b3 c3 d3 e3
//   . . . . .      . . 1 . .      a4 b4 c4 d4 e4
//   . . . . .      . . . . .      a5 b5 c5 d5 e5
checkerTestSuite("sukoro", "Sukoro",

test('Correct solution',(suite) => {
  let clues = {"b2": "3", "d3": "1"};
  let data = {"b1": "1", "a2": "1", "c2": "2", "c3": "3", "c4": "1"};

  assert("Correct solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "OK"});
}),

test('Wrong number of neighbours',(suite) => {
  let clues = {"b2": "3", "d3": "1"};
  // Without number in c4 there are only two numbers (c2 and d3) next to c3.
  let data = {"b1": "1", "a2": "1", "c2": "2", "c3": "3"};

  assert("Wrong number of neighbours response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Wrong number of neighbours for the cell", errors: ["c3"]});
}),

test('Numbers are not connected',(suite) => {
  let clues = {"b2": "3", "d3": "1"};
  // Numbers in a4, a5 and b5 have correct number of neighbours, but are not connected to the others.
  let data = {"b1": "1", "a2": "1", "c2": "2", "c3": "3", "a4": "1", "c4": "1", "a5": "2", "b5": "1"};

  assert("Numbers are not connected response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Area occupied by the digits should be connected"});
}),

test('Same numbers in adjacent cells',(suite) => {
  let clues = {"b2": "3", "d3": "1"};
  // Without number in c4 there should be 2 in c3 (neighbours are c2 and d3), but c2 also contains 2.
  let data = {"b1": "1", "a2": "1", "c2": "2", "c3": "2"};

  assert("Same numbers in adjacent cells response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Two cells sharing an edge shouldn't contain the same numbers", errors: ["c2", "c3"]});
}),

);
