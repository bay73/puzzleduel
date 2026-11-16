// Areas of the 4x4 puzzle and its solution:
//   A A A B      1 2 3 4      a1 b1 c1 d1
//   C A B B      2 4 1 3      a2 b2 c2 d2
//   C C D B      3 1 4 2      a3 b3 c3 d3
//   C D D D      4 3 2 1      a4 b4 c4 d4
checkerTestSuite("sudoku_irregular", "Irregular sudoku",

test('Correct solution',(suite) => {
  let clues = {"areas": [["a1","b1","c1","b2"], ["d1","c2","d2","d3"], ["a2","a3","b3","a4"], ["c3","b4","c4","d4"]], "b1": "2", "a4": "4"};
  let data = {
    "a1": "1", "c1": "3", "d1": "4",
    "a2": "2", "b2": "4", "c2": "1", "d2": "3",
    "a3": "3", "b3": "1", "c3": "4", "d3": "2",
    "b4": "3", "c4": "2", "d4": "1",
  };

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digits in area',(suite) => {
  let clues = {"areas": [["a1","b1","c1","b2"], ["d1","c2","d2","d3"], ["a2","a3","b3","a4"], ["c3","b4","c4","d4"]], "b1": "2", "a4": "4"};
  // All rows and columns are correct, but area A (a1, b1, c1, b2) contains 3 twice.
  let data = {
    "a1": "1", "c1": "3", "d1": "4",
    "a2": "2", "b2": "3", "c2": "4", "d2": "1",
    "a3": "3", "b3": "4", "c3": "1", "d3": "2",
    "b4": "1", "c4": "2", "d4": "3",
  };

  assert("Repeated digits in area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every area", errors: ["a1", "b1", "c1", "b2"]});
}),

test('Repeated digits in row',(suite) => {
  let clues = {"areas": [["a1","b1","c1","b2"], ["d1","c2","d2","d3"], ["a2","a3","b3","a4"], ["c3","b4","c4","d4"]], "b1": "2", "a4": "4"};
  // a2 and a3 (both in area C) are swapped: all areas are still correct, but the second row contains 3 twice.
  let data = {
    "a1": "1", "c1": "3", "d1": "4",
    "a2": "3", "b2": "4", "c2": "1", "d2": "3",
    "a3": "2", "b3": "1", "c3": "4", "d3": "2",
    "b4": "3", "c4": "2", "d4": "1",
  };

  assert("Repeated digits in row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every row", errors: ["a2", "b2", "c2", "d2"]});
}),

test('Repeated digits in column',(suite) => {
  let clues = {"areas": [["a1","b1","c1","b2"], ["d1","c2","d2","d3"], ["a2","a3","b3","a4"], ["c3","b4","c4","d4"]], "b1": "2", "a4": "4"};
  // a1 and c1 (both in area A) are swapped: all areas and rows are still correct, but column a contains 3 twice.
  let data = {
    "a1": "3", "c1": "1", "d1": "4",
    "a2": "2", "b2": "4", "c2": "1", "d2": "3",
    "a3": "3", "b3": "1", "c3": "4", "d3": "2",
    "b4": "3", "c4": "2", "d4": "1",
  };

  assert("Repeated digits in column response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All digits should be exactly once in every column", errors: ["a1", "a2", "a3", "a4"]});
}),

test('Areas are not kept from the previous puzzle',(suite) => {
  let clues = {"areas": [["a1","b1","c1","b2"], ["d1","c2","d2","d3"], ["a2","a3","b3","a4"], ["c3","b4","c4","d4"]], "b1": "2", "a4": "4"};
  let data = {
    "a1": "1", "c1": "3", "d1": "4",
    "a2": "2", "b2": "4", "c2": "1", "d2": "3",
    "a3": "3", "b3": "1", "c3": "4", "d3": "2",
    "b4": "3", "c4": "2", "d4": "1",
  };
  assert("Puzzle with areas response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});

  // The next puzzle has no areas, so only rows and columns are checked.
  // The grid would be wrong for the areas of the previous puzzle (a1, b1, c1, b2 contain 3 twice).
  let otherData = {
    "a1": "1", "b1": "2", "c1": "3", "d1": "4",
    "a2": "2", "b2": "3", "c2": "4", "d2": "1",
    "a3": "3", "b3": "4", "c3": "1", "d3": "2",
    "a4": "4", "b4": "1", "c4": "2", "d4": "3",
  };
  assert("Puzzle without areas response").that(Checker.check("4x4", {}, otherData)).isEqualTo({status: "OK"});
}),

);
