// Puzzle 6x6 with pentominoes I and V and its solution (# is a cell of pentomino, a1 is given):
//   # # # # # .      a1 b1 c1 d1 e1 f1
//   . . . . . .      a2 b2 c2 d2 e2 f2
//   7 . . # 4 .      a3 b3 c3 d3 e3 f3
//   . . . # . .      a4 b4 c4 d4 e4 f4
//   . . 7 # # #      a5 b5 c5 d5 e5 f5
//   . . . . . .      a6 b6 c6 d6 e6 f6
checkerTestSuite("pentasight", "Pentasight",

test('Correct solution',(suite) => {
  let clues = {"a1": "black", "a3": "7", "e3": "4", "c5": "7"};
  let data = {"b1": "black", "c1": "black", "d1": "black", "e1": "black", "d3": "black", "d4": "black", "d5": "black", "e5": "black", "f5": "black"};

  assert("Correct solution response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "OK"});
}),

test('Area of four cells',(suite) => {
  let clues = {"a1": "black", "a3": "7", "e3": "4", "c5": "7"};
  // Without f5 the second area contains only 4 cells.
  let data = {"b1": "black", "c1": "black", "d1": "black", "e1": "black", "d3": "black", "d4": "black", "d5": "black", "e5": "black"};

  assert("Not pentomino response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Each marked area should form a pentomino from the given set", errors: ["d3", "d4", "d5", "e5"]});
}),

test('Pentomino not from the set',(suite) => {
  let clues = {"a1": "black", "a3": "7", "e3": "4", "c5": "7"};
  // Cells d3-d4-d5-d6-e6 form pentomino L.
  let data = {"b1": "black", "c1": "black", "d1": "black", "e1": "black", "d3": "black", "d4": "black", "d5": "black", "d6": "black", "e6": "black"};

  assert("Wrong pentomino response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Each marked area should form a pentomino from the given set", errors: ["d3", "d4", "d5", "d6", "e6"]});
}),

test('Pentomino used twice',(suite) => {
  let clues = {"a1": "black", "a3": "7", "e3": "4", "c5": "7"};
  // Second pentomino I is placed in the last row instead of pentomino V.
  let data = {"b1": "black", "c1": "black", "d1": "black", "e1": "black", "b6": "black", "c6": "black", "d6": "black", "e6": "black", "f6": "black"};

  assert("Pentomino used twice response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Each element should be used exactly same number of times as given", errors: ["a1", "b1", "b6", "c1", "c6", "d1", "d6", "e1", "e6", "f6"]});
}),

test('Pentomino is not used',(suite) => {
  let clues = {"a1": "black", "a3": "7", "e3": "4", "c5": "7"};
  // Only pentomino I is placed.
  let data = {"b1": "black", "c1": "black", "d1": "black", "e1": "black"};

  assert("Pentomino is not used response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Each element should be used exactly same number of times as given", errors: []});
}),

test('Pentominoes touch diagonally',(suite) => {
  let clues = {"a1": "black", "a3": "7", "e3": "4", "c5": "7"};
  // Pentomino V is placed to f2-f3-f4-e4-d4, its cell f2 touches the cell e1 of pentomino I.
  let data = {"b1": "black", "c1": "black", "d1": "black", "e1": "black", "f2": "black", "f3": "black", "f4": "black", "e4": "black", "d4": "black"};

  assert("Pentominoes touch response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Elements shouldn't touch", errors: ["e1", "f2"]});
}),

test('Wrong number of visible cells',(suite) => {
  let clues = {"a1": "black", "a3": "7", "e3": "4", "c5": "7"};
  // Pentomino V is shifted one cell down: 10 cells are seen from a3 (the whole third row is empty).
  let data = {"b1": "black", "c1": "black", "d1": "black", "e1": "black", "d4": "black", "d5": "black", "d6": "black", "e6": "black", "f6": "black"};

  assert("Wrong clue response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["a3"]});
}),

);
