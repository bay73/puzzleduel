// Puzzle 6x6 with pentominoes I and V and its solution (# is a cell of pentomino, * is a marked cell of pentomino):
//   . # # * # #      a1 b1 c1 d1 e1 f1
//   . . . . . .      a2 b2 c2 d2 e2 f2
//   * # # . . .      a3 b3 c3 d3 e3 f3
//   . . * . . .      a4 b4 c4 d4 e4 f4
//   . . # . . .      a5 b5 c5 d5 e5 f5
//   . . . . . .      a6 b6 c6 d6 e6 f6
// Marked are the 3rd (d1), 6th (a3) and 9th (c4) used cells in the reading order.
checkerTestSuite("pentomino_hungarian", "Hungarian pentomino",

test('Correct solution',(suite) => {
  let clues = {"d1": "1", "a3": "1", "c4": "1"};
  let data = {"b1": "1", "c1": "1", "e1": "1", "f1": "1", "b3": "1", "c3": "1", "c5": "1"};

  assert("Correct solution response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "OK"});
}),

test('Area of four cells',(suite) => {
  let clues = {"d1": "1", "a3": "1", "c4": "1"};
  // Without c5 the second area contains only 4 cells.
  let data = {"b1": "1", "c1": "1", "e1": "1", "f1": "1", "b3": "1", "c3": "1"};

  assert("Not pentomino response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Each marked area should form a pentomino from the given set", errors: ["a3", "b3", "c3", "c4"]});
}),

test('Pentomino not from the set',(suite) => {
  let clues = {"d1": "1", "a3": "1", "c4": "1"};
  // Cells a3-b3-c3-b4-c4 form pentomino P.
  let data = {"b1": "1", "c1": "1", "e1": "1", "f1": "1", "b3": "1", "c3": "1", "b4": "1"};

  assert("Wrong pentomino response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Each marked area should form a pentomino from the given set", errors: ["a3", "b3", "c3", "b4", "c4"]});
}),

test('Pentomino used twice',(suite) => {
  let clues = {"d1": "1", "a3": "1", "c4": "1"};
  // Pentomino V (d1-e1-f1-f2-f3) is placed instead of pentomino I.
  let data = {"e1": "1", "f1": "1", "f2": "1", "f3": "1", "b3": "1", "c3": "1", "c5": "1"};

  assert("Pentomino used twice response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Each element should be used exactly same number of times as given", errors: ["a3", "b3", "c3", "c4", "c5", "d1", "e1", "f1", "f2", "f3"]});
}),

test('Pentominoes touch diagonally',(suite) => {
  let clues = {"d1": "1", "a3": "1", "c4": "1"};
  // Pentomino V is placed to a2-a3-a4-b4-c4, its cell a2 touches the cell b1 of pentomino I.
  let data = {"b1": "1", "c1": "1", "e1": "1", "f1": "1", "a2": "1", "a4": "1", "b4": "1"};

  assert("Pentominoes touch response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Elements shouldn't touch", errors: ["b1", "a2"]});
}),

test('Third cell is not marked',(suite) => {
  let clues = {"d1": "1", "a3": "1", "c4": "1"};
  // Pentomino I is placed to a1-e1: the third used cell is c1 and it is not marked.
  let data = {"a1": "1", "b1": "1", "c1": "1", "e1": "1", "b3": "1", "c3": "1", "c5": "1"};

  assert("Third cell response").that(Checker.check("6x6-IV", clues, data)).isEqualTo({status: "Each third cell used by pentomino should be marked", errors: ["c1"]});
}),

);
