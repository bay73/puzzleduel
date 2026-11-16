// Puzzle 6x6 with pentominoes I and V (areas are marked by letters, x is a cell given as empty)
// and its solution (# is a cell of pentomino):
//   A A A A A A      # # # # # .      a1 b1 c1 d1 e1 f1
//   A A A A A A      . . . . . .      a2 b2 c2 d2 e2 f2
//   B B B B B B      . . . # . .      a3 b3 c3 d3 e3 f3
//   B x B B B B      . . . # . .      a4 b4 c4 d4 e4 f4
//   B B B B B B      . . . # # #      a5 b5 c5 d5 e5 f5
//   B B B B B B      . . . . . .      a6 b6 c6 d6 e6 f6
checkerTestSuite("pentomino_areas", "Pentomino in areas",

test('Correct solution',(suite) => {
  let clues = {"b4": "cross", "areas": [["a1", "b1", "c1", "d1", "e1", "f1", "a2", "b2", "c2", "d2", "e2", "f2"],
                                        ["a3", "b3", "c3", "d3", "e3", "f3", "a4", "b4", "c4", "d4", "e4", "f4", "a5", "b5", "c5", "d5", "e5", "f5", "a6", "b6", "c6", "d6", "e6", "f6"]]};
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "e1": "1", "d3": "1", "d4": "1", "d5": "1", "e5": "1", "f5": "1"};

  assert("Correct solution response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "OK"});
}),

test('Area of four cells',(suite) => {
  let clues = {"b4": "cross", "areas": [["a1", "b1", "c1", "d1", "e1", "f1", "a2", "b2", "c2", "d2", "e2", "f2"],
                                        ["a3", "b3", "c3", "d3", "e3", "f3", "a4", "b4", "c4", "d4", "e4", "f4", "a5", "b5", "c5", "d5", "e5", "f5", "a6", "b6", "c6", "d6", "e6", "f6"]]};
  // Without f5 the second marked area contains only 4 cells.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "e1": "1", "d3": "1", "d4": "1", "d5": "1", "e5": "1"};

  assert("Not pentomino response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Each marked area should form a pentomino from the given set", errors: ["d3", "d4", "d5", "e5"]});
}),

test('Pentomino not from the set',(suite) => {
  let clues = {"b4": "cross", "areas": [["a1", "b1", "c1", "d1", "e1", "f1", "a2", "b2", "c2", "d2", "e2", "f2"],
                                        ["a3", "b3", "c3", "d3", "e3", "f3", "a4", "b4", "c4", "d4", "e4", "f4", "a5", "b5", "c5", "d5", "e5", "f5", "a6", "b6", "c6", "d6", "e6", "f6"]]};
  // Cells d3-d4-d5-d6-e6 form pentomino L.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "e1": "1", "d3": "1", "d4": "1", "d5": "1", "d6": "1", "e6": "1"};

  assert("Wrong pentomino response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Each marked area should form a pentomino from the given set", errors: ["d3", "d4", "d5", "d6", "e6"]});
}),

test('Pentomino used twice',(suite) => {
  let clues = {"b4": "cross", "areas": [["a1", "b1", "c1", "d1", "e1", "f1", "a2", "b2", "c2", "d2", "e2", "f2"],
                                        ["a3", "b3", "c3", "d3", "e3", "f3", "a4", "b4", "c4", "d4", "e4", "f4", "a5", "b5", "c5", "d5", "e5", "f5", "a6", "b6", "c6", "d6", "e6", "f6"]]};
  // Second pentomino I is placed in the last row instead of pentomino V.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "e1": "1", "b6": "1", "c6": "1", "d6": "1", "e6": "1", "f6": "1"};

  assert("Pentomino used twice response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Each element should be used exactly same number of times as given", errors: ["a1", "b1", "b6", "c1", "c6", "d1", "d6", "e1", "e6", "f6"]});
}),

test('Pentomino is not used',(suite) => {
  let clues = {"b4": "cross", "areas": [["a1", "b1", "c1", "d1", "e1", "f1", "a2", "b2", "c2", "d2", "e2", "f2"],
                                        ["a3", "b3", "c3", "d3", "e3", "f3", "a4", "b4", "c4", "d4", "e4", "f4", "a5", "b5", "c5", "d5", "e5", "f5", "a6", "b6", "c6", "d6", "e6", "f6"]]};
  // Only pentomino I is placed.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "e1": "1"};

  assert("Pentomino is not used response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Each element should be used exactly same number of times as given", errors: []});
}),

test('Pentominoes touch diagonally',(suite) => {
  let clues = {"b4": "cross", "areas": [["a1", "b1", "c1", "d1", "e1", "f1", "a2", "b2", "c2", "d2", "e2", "f2"],
                                        ["a3", "b3", "c3", "d3", "e3", "f3", "a4", "b4", "c4", "d4", "e4", "f4", "a5", "b5", "c5", "d5", "e5", "f5", "a6", "b6", "c6", "d6", "e6", "f6"]]};
  // Pentomino V is placed to f2-f3-f4-e4-d4, its cell f2 touches the cell e1 of pentomino I.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "e1": "1", "f2": "1", "f3": "1", "f4": "1", "e4": "1", "d4": "1"};

  assert("Pentominoes touch response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Elements shouldn't touch", errors: ["e1", "f2"]});
}),

test('Pentomino in two areas',(suite) => {
  let clues = {"b4": "cross", "areas": [["a1", "b1", "c1", "d1", "e1", "f1", "a2", "b2", "c2", "d2", "e2", "f2"],
                                        ["a3", "b3", "c3", "d3", "e3", "f3", "a4", "b4", "c4", "d4", "e4", "f4", "a5", "b5", "c5", "d5", "e5", "f5", "a6", "b6", "c6", "d6", "e6", "f6"]]};
  // Pentomino I is placed vertically to a2-a6: the cell a2 is in the area A and the other cells are in the area B.
  let data = {"a2": "1", "a3": "1", "a4": "1", "a5": "1", "a6": "1", "d3": "1", "d4": "1", "d5": "1", "e5": "1", "f5": "1"};

  assert("Pentomino in two areas response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Each pentomino should be fully inside one area", errors: ["a2", "a3", "a4", "a5", "a6"]});
}),

);
