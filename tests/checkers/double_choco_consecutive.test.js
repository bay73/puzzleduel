// Puzzle 4x4 (dots and digits are white cells, g and digits in brackets are grey cells) and its solution:
//    .   .   g  (2)      a1 b1 c1 d1      A A A A
//    1   g   g   .       a2 b2 c2 d2      B B C C
//    .   .   g   g       a3 b3 c3 d3      D D D D
//    .   g   .   g       a4 b4 c4 d4      E E F F
// Every area of size 4 touches an area of size 2 and vice versa
// (sizes of white parts are 2 and 1, i.e. consecutive).
checkerTestSuite("double_choco_consecutive", "Double Choco Consecutive",

test('Correct solution',(suite) => {
  let clues = {"c1": "grey", "d1": "grey2", "a2": "1", "b2": "grey", "c2": "grey", "c3": "grey", "d3": "grey", "b4": "grey", "d4": "grey"};
  let data = {"areas": [["a1","b1","c1","d1"],["a2","b2"],["c2","d2"],["a3","b3","c3","d3"],["a4","b4"],["c4","d4"]]};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No neighbouring area of consecutive size',(suite) => {
  let clues = {"c1": "grey", "d1": "grey2", "a2": "1", "b2": "grey", "c2": "grey", "c3": "grey", "d3": "grey", "b4": "grey", "d4": "grey"};
  // The fourth area (white a3-b3-a4, grey c3-d3-d4) has size 6, all its neighbours have size 2.
  let data = {"areas": [["a1","b1","c1","d1"],["a2","b2"],["c2","d2"],["a3","b3","c3","d3","a4","d4"],["b4","c4"]]};

  assert("No consecutive neighbour response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The region should have a neighbouring region of consecutive size", errors: ["a3", "b3", "c3", "d3", "a4", "d4"]});
}),

test('Different numbers in one area',(suite) => {
  let clues = {"c1": "grey", "d1": "grey2", "a2": "1", "b2": "grey", "c2": "grey", "c3": "grey", "d3": "grey", "b4": "grey", "d4": "grey"};
  // Areas A and B are joined, the area contains 2 in d1 and 1 in a2.
  let data = {"areas": [["a1","b1","c1","d1","a2","b2"],["c2","d2"],["a3","b3","c3","d3"],["a4","b4"],["c4","d4"]]};

  assert("Different numbers response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All numbers in a region must be equal", errors: ["d1", "a2"]});
}),

test('White part is not connected',(suite) => {
  let clues = {"c1": "grey", "d1": "grey2", "a2": "1", "b2": "grey", "c2": "grey", "c3": "grey", "d3": "grey", "b4": "grey", "d4": "grey"};
  // Areas A and C are joined, white cell d2 is not connected to white cells a1-b1.
  let data = {"areas": [["a1","b1","c1","d1","c2","d2"],["a2","b2"],["a3","b3","c3","d3"],["a4","b4"],["c4","d4"]]};

  assert("White not connected response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "White area should be connected", errors: ["a1", "b1", "d2"]});
}),

test('Grey part is not connected',(suite) => {
  let clues = {"c1": "grey", "d1": "grey2", "a2": "1", "b2": "grey", "c2": "grey", "c3": "grey", "d3": "grey", "b4": "grey", "d4": "grey"};
  // Areas B and D are joined, grey cell b2 is not connected to grey cells c3-d3.
  let data = {"areas": [["a1","b1","c1","d1"],["a2","b2","a3","b3","c3","d3"],["c2","d2"],["a4","b4","c4","d4"]]};

  assert("Grey not connected response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Shaded area should be connected", errors: ["b2", "c3", "d3"]});
}),

test('Different number of white and grey cells',(suite) => {
  let clues = {"c1": "grey", "d1": "grey2", "a2": "1", "b2": "grey", "c2": "grey", "c3": "grey", "d3": "grey", "b4": "grey", "d4": "grey"};
  // The fourth area consists of two white cells a3-b3.
  let data = {"areas": [["a1","b1","c1","d1"],["a2","b2"],["c2","d2"],["a3","b3"],["c3","d3","c4","d4"],["a4","b4"]]};

  assert("Different size response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Areas of white cells and shaded cells must have the same shape", errors: ["a3", "b3"]});
}),

test('Different shapes of white and grey parts',(suite) => {
  let clues = {"c1": "grey", "d1": "grey2", "a2": "1", "b2": "grey", "c2": "grey", "c3": "grey", "d3": "grey", "b4": "grey", "d4": "grey"};
  // The first area contains white L-tromino a3-b3-a4 and grey straight tromino c1-c2-c3.
  let data = {"areas": [["c1","c2","a3","b3","c3","a4"],["a1","b1","a2","b2"],["d1","d2"],["d3","b4","c4","d4"]]};

  assert("Different shape response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Areas of white cells and shaded cells must have the same shape", errors: ["c1", "c2", "a3", "b3", "c3", "a4"]});
}),

test('Wrong size of area with number',(suite) => {
  let clues = {"c1": "grey", "d1": "grey2", "a2": "1", "b2": "grey", "c2": "grey", "c3": "grey", "d3": "grey", "b4": "grey", "d4": "grey"};
  // The second area contains 2 in d1, but it has only one white and one grey cell.
  let data = {"areas": [["a1","b1","c1","c2"],["d1","d2"],["a2","b2"],["a3","b3","c3","d3"],["a4","b4"],["c4","d4"]]};

  assert("Wrong number response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The number must be equal to the number of cells of each color in a region", errors: ["d1", "d2"]});
}),

test('Cell without area',(suite) => {
  let clues = {"c1": "grey", "d1": "grey2", "a2": "1", "b2": "grey", "c2": "grey", "c3": "grey", "d3": "grey", "b4": "grey", "d4": "grey"};
  // Solution without the area c4-d4: c4 is the first cell which doesn't belong to any area.
  let data = {"areas": [["a1", "b1", "c1", "d1"], ["a2", "b2"], ["c2", "d2"], ["a3", "b3", "c3", "d3"], ["a4", "b4"]]};

  assert("Cell without area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["c4"]});
}),

test('Cell in two areas',(suite) => {
  let clues = {"c1": "grey", "d1": "grey2", "a2": "1", "b2": "grey", "c2": "grey", "c3": "grey", "d3": "grey", "b4": "grey", "d4": "grey"};
  // Solution with an extra area which consists of the cell a1.
  let data = {"areas": [["a1", "b1", "c1", "d1"], ["a2", "b2"], ["c2", "d2"], ["a3", "b3", "c3", "d3"], ["a4", "b4"], ["c4", "d4"], ["a1"]]};

  assert("Cell in two areas response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["a1"]});
}),

);
