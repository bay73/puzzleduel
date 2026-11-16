// Puzzle 5x5 with pentominoes L and V ("5x5-LV") and its solution (# is a shaded cell).
// Clues: black circle in a3 (the cell is a part of a pentomino), white circle in c2 (the cell is empty).
//   # # . . .      a1 b1 c1 d1 e1
//   # . o . .      a2 b2 c2 d2 e2
//   # . # # #      a3 b3 c3 d3 e3
//   # . . . #      a4 b4 c4 d4 e4
//   . . . . #      a5 b5 c5 d5 e5
checkerTestSuite("statue_park", "Statue Park",

test('Correct solution',(suite) => {
  let clues = {"a3": "black_circle", "c2": "white_circle"};
  let data = {"a1": "1", "b1": "1", "a2": "1", "a3": "1", "a4": "1", "c3": "1", "d3": "1", "e3": "1", "e4": "1", "e5": "1"};

  assert("Correct solution response").that(Checker.check("5x5-LV", clues, data)).isEqualTo({status: "OK"});
}),

test('Shaded area is not a pentomino',(suite) => {
  let clues = {"a3": "black_circle", "c2": "white_circle"};
  // Without e5 the second area consists of four cells only.
  let data = {"a1": "1", "b1": "1", "a2": "1", "a3": "1", "a4": "1", "c3": "1", "d3": "1", "e3": "1", "e4": "1"};

  assert("Not a pentomino response").that(Checker.check("5x5-LV", clues, data)).isEqualTo({status: "Each marked area should form a pentomino from the given set", errors: ["c3", "d3", "e3", "e4"]});
}),

test('Pentomino is not from the set',(suite) => {
  let clues = {"a3": "black_circle", "c2": "white_circle"};
  // Cells c3, d3, e3, d4, e4 form pentomino P, which is not in the set.
  let data = {"a1": "1", "b1": "1", "a2": "1", "a3": "1", "a4": "1", "c3": "1", "d3": "1", "e3": "1", "d4": "1", "e4": "1"};

  assert("Pentomino is not from the set response").that(Checker.check("5x5-LV", clues, data)).isEqualTo({status: "Each marked area should form a pentomino from the given set", errors: ["c3", "d3", "e3", "d4", "e4"]});
}),

test('Pentomino is used twice',(suite) => {
  let clues = {"a3": "black_circle", "c2": "white_circle"};
  // Cells e2, e3, e4, d5, e5 form the second pentomino L (and there is no V).
  let data = {"a1": "1", "b1": "1", "a2": "1", "a3": "1", "a4": "1", "e2": "1", "e3": "1", "e4": "1", "d5": "1", "e5": "1"};

  assert("Pentomino is used twice response").that(Checker.check("5x5-LV", clues, data)).isEqualTo({status: "Each element should be used exactly same number of times as given", errors: ["a1", "a2", "a3", "a4", "b1", "d5", "e2", "e3", "e4", "e5"]});
}),

test('Pentomino is missing',(suite) => {
  let clues = {"a3": "black_circle", "c2": "white_circle"};
  // Only pentomino L is placed, V is missing, so there are no cells to show.
  let data = {"a1": "1", "b1": "1", "a2": "1", "a3": "1", "a4": "1"};

  assert("Pentomino is missing response").that(Checker.check("5x5-LV", clues, data)).isEqualTo({status: "Each element should be used exactly same number of times as given", errors: []});
}),

test('White area is not connected',(suite) => {
  let clues = {"a3": "black_circle", "c2": "white_circle"};
  // Pentomino L is placed as a1, a2, a3, a4, b4: together with V it separates
  // white cells c4, d4, a5, b5, c5, d5 from the others.
  let data = {"a1": "1", "a2": "1", "a3": "1", "a4": "1", "b4": "1", "c3": "1", "d3": "1", "e3": "1", "e4": "1", "e5": "1"};

  assert("White area is not connected response").that(Checker.check("5x5-LV", clues, data)).isEqualTo({status: "White area should be connected"});
}),

);
