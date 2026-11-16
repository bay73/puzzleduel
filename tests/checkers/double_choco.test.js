// Puzzle 4x4 (dots and digits are white cells, g and digits in brackets are grey cells) and its solution:
//    .   .   g  (2)      a1 b1 c1 d1      A A A A
//    3   .   .   .       a2 b2 c2 d2      B B C C
//    .   g   g   .       a3 b3 c3 d3      B B C C
//    g   g  (3)  g       a4 b4 c4 d4      B B C C
checkerTestSuite("double_choco", "Double Choco",

test('Correct solution',(suite) => {
  let clues = {"c1": "grey", "d1": "grey2", "a2": "3", "b3": "grey", "c3": "grey", "a4": "grey", "b4": "grey", "c4": "grey3", "d4": "grey"};
  let data = {"areas": [["a1","b1","c1","d1"],["a2","b2","a3","b3","a4","b4"],["c2","d2","c3","d3","c4","d4"]]};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Different numbers in one area',(suite) => {
  let clues = {"c1": "grey", "d1": "grey2", "a2": "3", "b3": "grey", "c3": "grey", "a4": "grey", "b4": "grey", "c4": "grey3", "d4": "grey"};
  // Areas A and B are joined, the area contains 2 in d1 and 3 in a2.
  let data = {"areas": [["a1","b1","c1","d1","a2","b2","a3","b3","a4","b4"],["c2","d2","c3","d3","c4","d4"]]};

  assert("Different numbers response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All numbers in a region must be equal", errors: ["d1", "a2"]});
}),

test('White part is not connected',(suite) => {
  let clues = {"c1": "grey", "d1": "grey2", "a2": "3", "b3": "grey", "c3": "grey", "a4": "grey", "b4": "grey", "c4": "grey3", "d4": "grey"};
  // White cells a1-b1 and c2-d2 of the first area are separated by the grey cells c1-d1.
  let data = {"areas": [["a1","b1","c1","d1","c2","d2"],["a2","b2","a3","b3","a4","b4"],["c3","d3","c4","d4"]]};

  assert("White not connected response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "White area should be connected", errors: ["a1", "b1", "c2", "d2"]});
}),

test('Grey part is not connected',(suite) => {
  let clues = {"c1": "grey", "d1": "grey2", "a2": "3", "b3": "grey", "c3": "grey", "a4": "grey", "b4": "grey", "c4": "grey3", "d4": "grey"};
  // Grey cells d1, c3 and d4 of the third area are not connected, all other areas are correct.
  let data = {"areas": [["a1","a2","b2","b3","b4","c4"],["b1","c1"],["d1","c2","d2","c3","d3","d4"],["a3","a4"]]};

  assert("Grey not connected response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Shaded area should be connected", errors: ["d1", "c3", "d4"]});
}),

test('Different number of white and grey cells',(suite) => {
  let clues = {"c1": "grey", "d1": "grey2", "a2": "3", "b3": "grey", "c3": "grey", "a4": "grey", "b4": "grey", "c4": "grey3", "d4": "grey"};
  // The first area contains two white cells and one grey cell.
  let data = {"areas": [["a1","b1","c1"],["d1","c2","d2","c3","d3","c4","d4"],["a2","b2","a3","b3","a4","b4"]]};

  assert("Different size response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Areas of white cells and shaded cells must have the same shape", errors: ["a1", "b1", "c1"]});
}),

test('Different shapes of white and grey parts',(suite) => {
  let clues = {"c1": "grey", "d1": "grey2", "a2": "3", "b3": "grey", "c3": "grey", "a4": "grey", "b4": "grey", "c4": "grey3", "d4": "grey"};
  // The second area contains white L-tromino a2-b2-a3 and grey straight tromino a4-b4-c4.
  let data = {"areas": [["a1","b1","c1","d1"],["a2","b2","a3","a4","b4","c4"],["c2","d2","b3","c3"],["d3","d4"]]};

  assert("Different shape response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Areas of white cells and shaded cells must have the same shape", errors: ["a2", "b2", "a3", "a4", "b4", "c4"]});
}),

test('Wrong size of area with number',(suite) => {
  let clues = {"c1": "grey", "d1": "grey2", "a2": "3", "b3": "grey", "c3": "grey", "a4": "grey", "b4": "grey", "c4": "grey3", "d4": "grey"};
  // The second area contains 3 in a2, but it has only two white and two grey cells.
  let data = {"areas": [["a1","b1","c1","d1"],["a2","a3","a4","b4"],["b2","b3"],["c2","d2","c3","d3","c4","d4"]]};

  assert("Wrong number response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The number must be equal to the number of cells of each color in a region", errors: ["a2", "a3", "a4", "b4"]});
}),

test('Cell without area',(suite) => {
  let clues = {"c1": "grey", "d1": "grey2", "a2": "3", "b3": "grey", "c3": "grey", "a4": "grey", "b4": "grey", "c4": "grey3", "d4": "grey"};
  // Solution without the area c2-d2-c3-d3-c4-d4: c2 is the first cell which doesn't belong to any area.
  let data = {"areas": [["a1", "b1", "c1", "d1"], ["a2", "b2", "a3", "b3", "a4", "b4"]]};

  assert("Cell without area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["c2"]});
}),

test('Cell in two areas',(suite) => {
  let clues = {"c1": "grey", "d1": "grey2", "a2": "3", "b3": "grey", "c3": "grey", "a4": "grey", "b4": "grey", "c4": "grey3", "d4": "grey"};
  // Solution with an extra area which consists of the cell a1.
  let data = {"areas": [["a1", "b1", "c1", "d1"], ["a2", "b2", "a3", "b3", "a4", "b4"], ["c2", "d2", "c3", "d3", "c4", "d4"], ["a1"]]};

  assert("Cell in two areas response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["a1"]});
}),

);
