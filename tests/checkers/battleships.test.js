// Puzzle 6x6 with ships set "ship3" (one ship of size 3, two ships of size 2, three ships of size 1).
// Numbers are clues outside the grid, ~ is a wave. The solution (# is a ship cell):
//   . . . ~ . .  4      # # # . # .
//   . . . . . .  1      . . . . # .
//   . . . . . .  2      # . # . . .
//   . . . . . .  2      # . . . # .
//   . . . . . .  0      . . . . . .
//   . . . . . .  1      . . # . . .
//   3 1 3 0 3 0
checkerTestSuite("battleships", "Battleships",

test('Correct solution',(suite) => {
  let clues = {"d1": "wave", "bottom": ["3", "1", "3", "0", "3", "0"], "right": ["4", "1", "2", "2", "0", "1"]};
  let data = {"a1": "1", "b1": "1", "c1": "1", "e1": "1", "e2": "1", "a3": "1", "a4": "1", "c3": "1", "e4": "1", "c6": "1"};

  assert("Correct solution response").that(Checker.check("6x6-ship3", clues, data)).isEqualTo({status: "OK"});
}),

test('Area is not a ship',(suite) => {
  let clues = {"d1": "wave", "bottom": ["3", "1", "3", "0", "3", "0"], "right": ["4", "1", "2", "2", "0", "1"]};
  // Extra cell b2 forms T-shape with the ship a1-b1-c1.
  let data = {"a1": "1", "b1": "1", "c1": "1", "b2": "1", "e1": "1", "e2": "1", "a3": "1", "a4": "1", "c3": "1", "e4": "1", "c6": "1"};

  assert("Not a ship response").that(Checker.check("6x6-ship3", clues, data)).isEqualTo({status: "Each marked area should form a ship from the set", errors: ["a1", "b1", "c1", "b2"]});
}),

test('Too many ships of one size',(suite) => {
  let clues = {"d1": "wave", "bottom": ["3", "1", "3", "0", "3", "0"], "right": ["4", "1", "2", "2", "0", "1"]};
  // Extra ship of size 1 in a6: four ships of size 1 instead of three.
  let data = {"a1": "1", "b1": "1", "c1": "1", "e1": "1", "e2": "1", "a3": "1", "a4": "1", "c3": "1", "e4": "1", "c6": "1", "a6": "1"};

  assert("Too many ships response").that(Checker.check("6x6-ship3", clues, data)).isEqualTo({status: "Number of the ships should correspond to the given set", errors: ["a6", "c3", "c6", "e4"]});
}),

test('Not enough ships of one size',(suite) => {
  let clues = {"d1": "wave", "bottom": ["3", "1", "3", "0", "3", "0"], "right": ["4", "1", "2", "2", "0", "1"]};
  // No ship in c6: two ships of size 1 instead of three.
  let data = {"a1": "1", "b1": "1", "c1": "1", "e1": "1", "e2": "1", "a3": "1", "a4": "1", "c3": "1", "e4": "1"};

  assert("Not enough ships response").that(Checker.check("6x6-ship3", clues, data)).isEqualTo({status: "Number of the ships should correspond to the given set", errors: ["c3", "e4"]});
}),

test('Ships touch diagonally',(suite) => {
  let clues = {"d1": "wave", "bottom": ["3", "1", "3", "0", "3", "0"], "right": ["4", "1", "2", "2", "0", "1"]};
  // Ship of size 1 is in f3 instead of e4, it touches the ship e1-e2 diagonally.
  let data = {"a1": "1", "b1": "1", "c1": "1", "e1": "1", "e2": "1", "a3": "1", "a4": "1", "c3": "1", "f3": "1", "c6": "1"};

  assert("Touching ships response").that(Checker.check("6x6-ship3", clues, data)).isEqualTo({status: "Ships shouldn't touch", errors: ["e2", "f3"]});
}),

test('Wrong number of ship cells in the column',(suite) => {
  let clues = {"d1": "wave", "bottom": ["3", "1", "3", "0", "3", "0"], "right": ["4", "1", "2", "2", "0", "1"]};
  // Ship of size 1 is in d6 instead of c6: only two ship cells in column c.
  let data = {"a1": "1", "b1": "1", "c1": "1", "e1": "1", "e2": "1", "a3": "1", "a4": "1", "c3": "1", "e4": "1", "d6": "1"};

  assert("Wrong column response").that(Checker.check("6x6-ship3", clues, data)).isEqualTo({status: "Wrong number of blackened cells in the column", errors: ["c1", "c2", "c3", "c4", "c5", "c6"]});
}),

test('Wrong number of ship cells in the row',(suite) => {
  let clues = {"d1": "wave", "bottom": ["3", "1", "3", "0", "3", "0"], "right": ["4", "1", "2", "2", "0", "1"]};
  // Ship of size 1 is in c5 instead of c6: there is a ship cell in row 5 with clue 0.
  let data = {"a1": "1", "b1": "1", "c1": "1", "e1": "1", "e2": "1", "a3": "1", "a4": "1", "c3": "1", "e4": "1", "c5": "1"};

  assert("Wrong row response").that(Checker.check("6x6-ship3", clues, data)).isEqualTo({status: "Wrong number of blackened cells in the row", errors: ["a5", "b5", "c5", "d5", "e5", "f5"]});
}),

);
