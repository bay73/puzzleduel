// Puzzle 4x4 (dots are white cells, g and digits in brackets are grey cells) and its solution:
//    .   .   g   g       a1 b1 c1 d1      A A A A
//    .   .   g   g       a2 b2 c2 d2      A A A A
//    .   .   .   .       a3 b3 c3 d3      B B B C
//    g  (3)  g  (1)      a4 b4 c4 d4      B B B C
// Sizes of the areas are 8, 6 and 2.
checkerTestSuite("double_choco_notouch", "Double Choco No Touch",

test('Correct solution',(suite) => {
  let clues = {"c1": "grey", "d1": "grey", "c2": "grey", "d2": "grey", "a4": "grey", "b4": "grey3", "c4": "grey", "d4": "grey1"};
  let data = {"areas": [["a1","b1","c1","d1","a2","b2","c2","d2"],["a3","b3","c3","a4","b4","c4"],["d3","d4"]]};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Areas of the same size touch',(suite) => {
  let clues = {"c1": "grey", "d1": "grey", "c2": "grey", "d2": "grey", "a4": "grey", "b4": "grey3", "c4": "grey", "d4": "grey1"};
  // Area A is divided into two correct areas of size 4, which share an edge.
  let data = {"areas": [["a1","b1","c1","d1"],["a2","b2","c2","d2"],["a3","b3","c3","a4","b4","c4"],["d3","d4"]]};

  assert("Same size areas touch response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Areas of the same size shouldn't share an edge", errors: ["a1", "b1", "c1", "d1", "a2", "b2", "c2", "d2"]});
}),

test('Different numbers in one area',(suite) => {
  let clues = {"c1": "grey", "d1": "grey", "c2": "grey", "d2": "grey", "a4": "grey", "b4": "grey3", "c4": "grey", "d4": "grey1"};
  // The only area contains 3 in b4 and 1 in d4.
  let data = {"areas": [["a1","b1","c1","d1","a2","b2","c2","d2","a3","b3","c3","d3","a4","b4","c4","d4"]]};

  assert("Different numbers response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All numbers in a region must be equal", errors: ["b4", "d4"]});
}),

test('White part is not connected',(suite) => {
  let clues = {"c1": "grey", "d1": "grey", "c2": "grey", "d2": "grey", "a4": "grey", "b4": "grey3", "c4": "grey", "d4": "grey1"};
  // White cells b2 and d3 of the first area are not connected.
  let data = {"areas": [["b2","c2","d2","d3"],["a1","b1","c1","d1","a2","a3","b3","c3","a4","b4","c4","d4"]]};

  assert("White not connected response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "White area should be connected", errors: ["b2", "d3"]});
}),

test('Grey part is not connected',(suite) => {
  let clues = {"c1": "grey", "d1": "grey", "c2": "grey", "d2": "grey", "a4": "grey", "b4": "grey3", "c4": "grey", "d4": "grey1"};
  // Areas A and B are joined, grey cells of the top rows are not connected to grey cells of the bottom row.
  let data = {"areas": [["a1","b1","c1","d1","a2","b2","c2","d2","a3","b3","c3","a4","b4","c4"],["d3","d4"]]};

  assert("Grey not connected response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Shaded area should be connected", errors: ["c1", "d1", "c2", "d2", "a4", "b4", "c4"]});
}),

test('Different number of white and grey cells',(suite) => {
  let clues = {"c1": "grey", "d1": "grey", "c2": "grey", "d2": "grey", "a4": "grey", "b4": "grey3", "c4": "grey", "d4": "grey1"};
  // The second area contains four white cells and three grey cells.
  let data = {"areas": [["a1","b1","c1","d1","a2","b2","c2","d2"],["a3","b3","c3","d3","a4","b4","c4"],["d4"]]};

  assert("Different size response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Areas of white cells and shaded cells must have the same shape", errors: ["a3", "b3", "c3", "d3", "a4", "b4", "c4"]});
}),

test('Different shapes of white and grey parts',(suite) => {
  let clues = {"c1": "grey", "d1": "grey", "c2": "grey", "d2": "grey", "a4": "grey", "b4": "grey3", "c4": "grey", "d4": "grey1"};
  // The second area contains white L-tetromino b1-b2-b3-c3 and grey square c1-d1-c2-d2.
  let data = {"areas": [["a1","a2","a3","a4","b4","c4"],["b1","c1","d1","b2","c2","d2","b3","c3"],["d3","d4"]]};

  assert("Different shape response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Areas of white cells and shaded cells must have the same shape", errors: ["b1", "c1", "d1", "b2", "c2", "d2", "b3", "c3"]});
}),

test('Wrong size of area with number',(suite) => {
  let clues = {"c1": "grey", "d1": "grey", "c2": "grey", "d2": "grey", "a4": "grey", "b4": "grey3", "c4": "grey", "d4": "grey1"};
  // The third area contains 3 in b4, but it has only two white and two grey cells.
  let data = {"areas": [["a1","b1","c1","d1","a2","b2","c2","d2"],["a3","a4"],["b3","c3","b4","c4"],["d3","d4"]]};

  assert("Wrong number response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The number must be equal to the number of cells of each color in a region", errors: ["b3", "c3", "b4", "c4"]});
}),

test('Cell without area',(suite) => {
  let clues = {"c1": "grey", "d1": "grey", "c2": "grey", "d2": "grey", "a4": "grey", "b4": "grey3", "c4": "grey", "d4": "grey1"};
  // Solution without the area d3-d4: d3 is the first cell which doesn't belong to any area.
  let data = {"areas": [["a1", "b1", "c1", "d1", "a2", "b2", "c2", "d2"], ["a3", "b3", "c3", "a4", "b4", "c4"]]};

  assert("Cell without area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["d3"]});
}),

test('Cell in two areas',(suite) => {
  let clues = {"c1": "grey", "d1": "grey", "c2": "grey", "d2": "grey", "a4": "grey", "b4": "grey3", "c4": "grey", "d4": "grey1"};
  // Solution with an extra area which consists of the cell a1.
  let data = {"areas": [["a1", "b1", "c1", "d1", "a2", "b2", "c2", "d2"], ["a3", "b3", "c3", "a4", "b4", "c4"], ["d3", "d4"], ["a1"]]};

  assert("Cell in two areas response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["a1"]});
}),

);
