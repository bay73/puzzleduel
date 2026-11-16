// Puzzle 4x4 (dots are white cells, g and digits in brackets are grey cells) and its solution:
//    .   .   .   .       a1 b1 c1 d1      A A A B
//    g  (3)  .   .       a2 b2 c2 d2      A A B B
//    g   g   .   .       a3 b3 c3 d3      A B B B
//    g   g   g  (5)      a4 b4 c4 d4      B B B B
// White and grey parts of each area have the same size, but different shapes.
checkerTestSuite("double_choco_inverse", "Double Choco Inverse",

test('Correct solution',(suite) => {
  let clues = {"a2": "grey", "b2": "grey3", "a3": "grey", "b3": "grey", "a4": "grey", "b4": "grey", "c4": "grey", "d4": "grey5"};
  let data = {"areas": [["a1","b1","c1","a2","b2","a3"],["d1","c2","d2","b3","c3","d3","a4","b4","c4","d4"]]};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Different numbers in one area',(suite) => {
  let clues = {"a2": "grey", "b2": "grey3", "a3": "grey", "b3": "grey", "a4": "grey", "b4": "grey", "c4": "grey", "d4": "grey5"};
  // The only area contains 3 in b2 and 5 in d4.
  let data = {"areas": [["a1","b1","c1","d1","a2","b2","c2","d2","a3","b3","c3","d3","a4","b4","c4","d4"]]};

  assert("Different numbers response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All numbers in a region must be equal", errors: ["b2", "d4"]});
}),

test('White part is not connected',(suite) => {
  let clues = {"a2": "grey", "b2": "grey3", "a3": "grey", "b3": "grey", "a4": "grey", "b4": "grey", "c4": "grey", "d4": "grey5"};
  // White cell c2 of the first area is not connected to the white cells a1-b1.
  let data = {"areas": [["a1","b1","a2","b2","c2","a3"],["c1","d1","d2","b3","c3","d3","a4","b4","c4","d4"]]};

  assert("White not connected response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "White area should be connected", errors: ["a1", "b1", "c2"]});
}),

test('Grey part is not connected',(suite) => {
  let clues = {"a2": "grey", "b2": "grey3", "a3": "grey", "b3": "grey", "a4": "grey", "b4": "grey", "c4": "grey", "d4": "grey5"};
  // Grey cells a2 and c4 of the first area are not connected.
  let data = {"areas": [["a1","b1","c1","a2","c2","c3","c4"],["d1","b2","d2","a3","b3","d3","a4","b4","d4"]]};

  assert("Grey not connected response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Shaded area should be connected", errors: ["a2", "c4"]});
}),

test('Different number of white and grey cells',(suite) => {
  let clues = {"a2": "grey", "b2": "grey3", "a3": "grey", "b3": "grey", "a4": "grey", "b4": "grey", "c4": "grey", "d4": "grey5"};
  // The first area contains two white cells and one grey cell.
  let data = {"areas": [["a1","b1","a2"],["c1","d1","b2","c2","d2","a3","b3","c3","d3","a4","b4","c4","d4"]]};

  assert("Different size response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Areas of white cells and shaded cells must have the same size", errors: ["a1", "b1", "a2"]});
}),

test('Wrong size of area with number',(suite) => {
  let clues = {"a2": "grey", "b2": "grey3", "a3": "grey", "b3": "grey", "a4": "grey", "b4": "grey", "c4": "grey", "d4": "grey5"};
  // The third area contains 5 in d4, but it has only one white and one grey cell.
  let data = {"areas": [["a1","b1","c1","a2","b2","a3"],["d1","c2","d2","b3","c3","a4","b4","c4"],["d3","d4"]]};

  assert("Wrong number response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The number must be equal to the number of cells of each color in a region", errors: ["d3", "d4"]});
}),

test('Same shapes of white and grey parts',(suite) => {
  let clues = {"a2": "grey", "b2": "grey3", "a3": "grey", "b3": "grey", "a4": "grey", "b4": "grey", "c4": "grey", "d4": "grey5"};
  // The first area contains white straight tromino a1-b1-c1 and grey straight tromino a2-a3-a4.
  let data = {"areas": [["a1","b1","c1","a2","a3","a4"],["d1","b2","c2","d2","b3","c3","d3","b4","c4","d4"]]};

  assert("Same shape response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Areas of white cells and shaded cells must have different shapes", errors: ["a1", "b1", "c1", "a2", "a3", "a4"]});
}),

test('Cell without area',(suite) => {
  let clues = {"a2": "grey", "b2": "grey3", "a3": "grey", "b3": "grey", "a4": "grey", "b4": "grey", "c4": "grey", "d4": "grey5"};
  // Solution without the area d1-c2-d2-b3-c3-d3-a4-b4-c4-d4: d1 is the first cell which doesn't belong to any area.
  let data = {"areas": [["a1", "b1", "c1", "a2", "b2", "a3"]]};

  assert("Cell without area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["d1"]});
}),

test('Cell in two areas',(suite) => {
  let clues = {"a2": "grey", "b2": "grey3", "a3": "grey", "b3": "grey", "a4": "grey", "b4": "grey", "c4": "grey", "d4": "grey5"};
  // Solution with an extra area which consists of the cell a1.
  let data = {"areas": [["a1", "b1", "c1", "a2", "b2", "a3"], ["d1", "c2", "d2", "b3", "c3", "d3", "a4", "b4", "c4", "d4"], ["a1"]]};

  assert("Cell in two areas response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["a1"]});
}),

);
