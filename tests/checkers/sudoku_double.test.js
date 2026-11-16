// Solution of the 6x6 puzzle with six 3x2 areas. Digits 1-3 are exactly twice in every row, column and area,
// equal digits do not share an edge.
//   3 1 2 3 2 1
//   2 3 1 2 1 3
//   3 1 2 3 2 1
//   1 2 3 1 3 2
//   2 3 1 2 1 3
//   1 2 3 1 3 2
checkerTestSuite("sudoku_double", "Double Sudoku",

test('Correct solution',(suite) => {
  let clues = {"b4": "2", "a6": "1", "d6": "1", "f6": "2",
               "areas": [["a1", "b1", "c1", "a2", "b2", "c2"],
                         ["d1", "e1", "f1", "d2", "e2", "f2"],
                         ["a3", "b3", "c3", "a4", "b4", "c4"],
                         ["d3", "e3", "f3", "d4", "e4", "f4"],
                         ["a5", "b5", "c5", "a6", "b6", "c6"],
                         ["d5", "e5", "f5", "d6", "e6", "f6"]]};
  let data = {"a1": "3", "b1": "1", "c1": "2", "d1": "3", "e1": "2", "f1": "1",
              "a2": "2", "b2": "3", "c2": "1", "d2": "2", "e2": "1", "f2": "3",
              "a3": "3", "b3": "1", "c3": "2", "d3": "3", "e3": "2", "f3": "1",
              "a4": "1", "c4": "3", "d4": "1", "e4": "3", "f4": "2",
              "a5": "2", "b5": "3", "c5": "1", "d5": "2", "e5": "1", "f5": "3",
              "b6": "2", "c6": "3", "e6": "3"};

  assert("Correct solution response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "OK"});
}),

test('Wrong digits in area',(suite) => {
  let clues = {"b4": "2", "a6": "1", "d6": "1", "f6": "2",
               "areas": [["a1", "b1", "c1", "a2", "b2", "c2"],
                         ["d1", "e1", "f1", "d2", "e2", "f2"],
                         ["a3", "b3", "c3", "a4", "b4", "c4"],
                         ["d3", "e3", "f3", "d4", "e4", "f4"],
                         ["a5", "b5", "c5", "a6", "b6", "c6"],
                         ["d5", "e5", "f5", "d6", "e6", "f6"]]};
  // Digits in a1 and e1 are exchanged, so 2 is three times in the top left area.
  let data = {"a1": "2", "b1": "1", "c1": "2", "d1": "3", "e1": "3", "f1": "1",
              "a2": "2", "b2": "3", "c2": "1", "d2": "2", "e2": "1", "f2": "3",
              "a3": "3", "b3": "1", "c3": "2", "d3": "3", "e3": "2", "f3": "1",
              "a4": "1", "c4": "3", "d4": "1", "e4": "3", "f4": "2",
              "a5": "2", "b5": "3", "c5": "1", "d5": "2", "e5": "1", "f5": "3",
              "b6": "2", "c6": "3", "e6": "3"};

  assert("Wrong digits in area response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "All digits should be exactly two times in every area", errors: ["a1", "b1", "c1", "a2", "b2", "c2"]});
}),

test('Wrong digits in row',(suite) => {
  let clues = {"b4": "2", "a6": "1", "d6": "1", "f6": "2",
               "areas": [["a1", "b1", "c1", "a2", "b2", "c2"],
                         ["d1", "e1", "f1", "d2", "e2", "f2"],
                         ["a3", "b3", "c3", "a4", "b4", "c4"],
                         ["d3", "e3", "f3", "d4", "e4", "f4"],
                         ["a5", "b5", "c5", "a6", "b6", "c6"],
                         ["d5", "e5", "f5", "d6", "e6", "f6"]]};
  // Digits in a1 and a2 are exchanged: all areas are correct, but 2 is three times in the first row.
  let data = {"a1": "2", "b1": "1", "c1": "2", "d1": "3", "e1": "2", "f1": "1",
              "a2": "3", "b2": "3", "c2": "1", "d2": "2", "e2": "1", "f2": "3",
              "a3": "3", "b3": "1", "c3": "2", "d3": "3", "e3": "2", "f3": "1",
              "a4": "1", "c4": "3", "d4": "1", "e4": "3", "f4": "2",
              "a5": "2", "b5": "3", "c5": "1", "d5": "2", "e5": "1", "f5": "3",
              "b6": "2", "c6": "3", "e6": "3"};

  assert("Wrong digits in row response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "All digits should be exactly two times in every row", errors: ["a1", "b1", "c1", "d1", "e1", "f1"]});
}),

test('Wrong digits in column',(suite) => {
  let clues = {"b4": "2", "a6": "1", "d6": "1", "f6": "2",
               "areas": [["a1", "b1", "c1", "a2", "b2", "c2"],
                         ["d1", "e1", "f1", "d2", "e2", "f2"],
                         ["a3", "b3", "c3", "a4", "b4", "c4"],
                         ["d3", "e3", "f3", "d4", "e4", "f4"],
                         ["a5", "b5", "c5", "a6", "b6", "c6"],
                         ["d5", "e5", "f5", "d6", "e6", "f6"]]};
  // Digits in a1 and b1 are exchanged: all areas and rows are correct, but 1 is three times in the first column.
  let data = {"a1": "1", "b1": "3", "c1": "2", "d1": "3", "e1": "2", "f1": "1",
              "a2": "2", "b2": "3", "c2": "1", "d2": "2", "e2": "1", "f2": "3",
              "a3": "3", "b3": "1", "c3": "2", "d3": "3", "e3": "2", "f3": "1",
              "a4": "1", "c4": "3", "d4": "1", "e4": "3", "f4": "2",
              "a5": "2", "b5": "3", "c5": "1", "d5": "2", "e5": "1", "f5": "3",
              "b6": "2", "c6": "3", "e6": "3"};

  assert("Wrong digits in column response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "All digits should be exactly two times in every column", errors: ["a1", "a2", "a3", "a4", "a5", "a6"]});
}),

test('Equal digits share an edge',(suite) => {
  let clues = {"b4": "2", "a6": "1", "d6": "1", "f6": "2",
               "areas": [["a1", "b1", "c1", "a2", "b2", "c2"],
                         ["d1", "e1", "f1", "d2", "e2", "f2"],
                         ["a3", "b3", "c3", "a4", "b4", "c4"],
                         ["d3", "e3", "f3", "d4", "e4", "f4"],
                         ["a5", "b5", "c5", "a6", "b6", "c6"],
                         ["d5", "e5", "f5", "d6", "e6", "f6"]]};
  // Every digit is twice in every row, column and area, but c3 and d3 both contain 1.
  let data = {"a1": "2", "b1": "3", "c1": "1", "d1": "2", "e1": "1", "f1": "3",
              "a2": "3", "b2": "1", "c2": "2", "d2": "3", "e2": "2", "f2": "1",
              "a3": "2", "b3": "3", "c3": "1", "d3": "1", "e3": "3", "f3": "2",
              "a4": "1", "c4": "3", "d4": "2", "e4": "1", "f4": "3",
              "a5": "3", "b5": "1", "c5": "2", "d5": "3", "e5": "2", "f5": "1",
              "b6": "2", "c6": "3", "e6": "3"};

  assert("Equal digits share an edge response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "Two cells sharing an edge should contain different digits", errors: ["c3", "d3"]});
}),

test('Areas are not kept from the previous puzzle',(suite) => {
  let clues = {"b4": "2", "a6": "1", "d6": "1", "f6": "2", "areas": [["a1", "b1", "c1", "a2", "b2", "c2"], ["d1", "e1", "f1", "d2", "e2", "f2"], ["a3", "b3", "c3", "a4", "b4", "c4"], ["d3", "e3", "f3", "d4", "e4", "f4"], ["a5", "b5", "c5", "a6", "b6", "c6"], ["d5", "e5", "f5", "d6", "e6", "f6"]]};
  let data = {"a1": "3", "b1": "1", "c1": "2", "d1": "3", "e1": "2", "f1": "1",
                   "a2": "2", "b2": "3", "c2": "1", "d2": "2", "e2": "1", "f2": "3",
                   "a3": "3", "b3": "1", "c3": "2", "d3": "3", "e3": "2", "f3": "1",
                   "a4": "1", "c4": "3", "d4": "1", "e4": "3", "f4": "2",
                   "a5": "2", "b5": "3", "c5": "1", "d5": "2", "e5": "1", "f5": "3",
                   "b6": "2", "c6": "3", "e6": "3"};
  assert("Puzzle with areas response").that(Checker.check("6x6", clues, data)).isEqualTo({status: "OK"});

  // The next puzzle has no areas, so only rows, columns and touching digits are checked.
  // The grid would be wrong for the areas of the previous puzzle (a1, b1, c1, a2, b2, c2 contain 3 three times).
  let otherData = {"a1": "3", "b1": "1", "c1": "3", "d1": "2", "e1": "1", "f1": "2",
                   "a2": "2", "b2": "3", "c2": "2", "d2": "1", "e2": "3", "f2": "1",
                   "a3": "3", "b3": "1", "c3": "3", "d3": "2", "e3": "1", "f3": "2",
                   "a4": "1", "b4": "2", "c4": "1", "d4": "3", "e4": "2", "f4": "3",
                   "a5": "2", "b5": "3", "c5": "2", "d5": "1", "e5": "3", "f5": "1",
                   "a6": "1", "b6": "2", "c6": "1", "d6": "3", "e6": "2", "f6": "3"};
  assert("Puzzle without areas response").that(Checker.check("6x6", {}, otherData)).isEqualTo({status: "OK"});
}),

);
