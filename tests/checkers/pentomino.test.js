// Puzzle 6x6 with pentominoes I and V and its solution (# is a cell of pentomino, x is a cell given as empty,
// numbers of used cells are given for some rows and columns):
//   # # # # # .  5      a1 b1 c1 d1 e1 f1
//   . x . . . .         a2 b2 c2 d2 e2 f2
//   . . . # . .  1      a3 b3 c3 d3 e3 f3
//   . . . # . .  1      a4 b4 c4 d4 e4 f4
//   . . . # # #  3      a5 b5 c5 d5 e5 f5
//   . . . . . .         a6 b6 c6 d6 e6 f6
//   1 1   4 2 1
checkerTestSuite("pentomino", "Pentomino",

test('Correct solution',(suite) => {
  let clues = {"b2": "cross", "bottom": ["1", "1", null, "4", "2", "1"], "right": ["5", null, "1", "1", "3", null]};
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "e1": "1", "d3": "1", "d4": "1", "d5": "1", "e5": "1", "f5": "1"};

  assert("Correct solution response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "OK"});
}),

test('Area of four cells',(suite) => {
  let clues = {"b2": "cross", "bottom": ["1", "1", null, "4", "2", "1"], "right": ["5", null, "1", "1", "3", null]};
  // Without f5 the second area contains only 4 cells.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "e1": "1", "d3": "1", "d4": "1", "d5": "1", "e5": "1"};

  assert("Not pentomino response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Each marked area should form a pentomino from the given set", errors: ["d3", "d4", "d5", "e5"]});
}),

test('Pentomino not from the set',(suite) => {
  let clues = {"b2": "cross", "bottom": ["1", "1", null, "4", "2", "1"], "right": ["5", null, "1", "1", "3", null]};
  // Cells d3-d4-d5-d6-e6 form pentomino L.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "e1": "1", "d3": "1", "d4": "1", "d5": "1", "d6": "1", "e6": "1"};

  assert("Wrong pentomino response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Each marked area should form a pentomino from the given set", errors: ["d3", "d4", "d5", "d6", "e6"]});
}),

test('Pentomino used twice',(suite) => {
  let clues = {"b2": "cross", "bottom": ["1", "1", null, "4", "2", "1"], "right": ["5", null, "1", "1", "3", null]};
  // Second pentomino I is placed in the last row instead of pentomino V.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "e1": "1", "b6": "1", "c6": "1", "d6": "1", "e6": "1", "f6": "1"};

  assert("Pentomino used twice response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Each element should be used exactly same number of times as given", errors: ["a1", "b1", "b6", "c1", "c6", "d1", "d6", "e1", "e6", "f6"]});
}),

test('Pentomino is not used',(suite) => {
  let clues = {"b2": "cross", "bottom": ["1", "1", null, "4", "2", "1"], "right": ["5", null, "1", "1", "3", null]};
  // Only pentomino I is placed.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "e1": "1"};

  assert("Pentomino is not used response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Each element should be used exactly same number of times as given", errors: []});
}),

test('Pentominoes touch diagonally',(suite) => {
  let clues = {"b2": "cross", "bottom": ["1", "1", null, "4", "2", "1"], "right": ["5", null, "1", "1", "3", null]};
  // Pentomino V is placed to f2-f3-f4-e4-d4, its cell f2 touches the cell e1 of pentomino I.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "e1": "1", "f2": "1", "f3": "1", "f4": "1", "e4": "1", "d4": "1"};

  assert("Pentominoes touch response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Elements shouldn't touch", errors: ["e1", "f2"]});
}),

test('Wrong number of cells in column',(suite) => {
  let clues = {"b2": "cross", "bottom": ["1", "1", null, "4", "2", "1"], "right": ["5", null, "1", "1", "3", null]};
  // Pentomino V is mirrored (d3-d4-d5-c5-b5): there are two used cells in the column b.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "e1": "1", "d3": "1", "d4": "1", "d5": "1", "c5": "1", "b5": "1"};

  assert("Wrong column response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Wrong number of blackened cells in the column", errors: ["b1", "b2", "b3", "b4", "b5", "b6"]});
}),

test('Wrong number of cells in row',(suite) => {
  let clues = {"b2": "cross", "bottom": ["1", "1", null, "4", "2", "1"], "right": ["5", null, "1", "1", "3", null]};
  // Pentomino V is shifted one cell down: there are no used cells in the third row.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "e1": "1", "d4": "1", "d5": "1", "d6": "1", "e6": "1", "f6": "1"};

  assert("Wrong row response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Wrong number of blackened cells in the row", errors: ["a3", "b3", "c3", "d3", "e3", "f3"]});
}),

);
