// Puzzle 6x6 with ships set "ship3" (one ship of size 3, two ships of size 2, three ships of size 1).
// The number shows how many of the neighbouring cells (including diagonal) are ship cells, ~ is a wave.
// The solution (# is a ship cell):
//   . . . ~ . .      # # # . # .
//   . 5 . 4 . .      . . . . # .
//   . . . . . .      # . # . . .
//   . . . . . .      # . . . # .
//   . . . 2 . .      . . . . . .
//   . . . . . 0      . . # . . .
checkerTestSuite("battleships_minesweeper", "Minesweeper battleships",

test('Correct solution',(suite) => {
  let clues = {"d1": "wave", "b2": "5", "d2": "4", "d5": "2", "f6": "0"};
  let data = {"a1": "1", "b1": "1", "c1": "1", "e1": "1", "e2": "1", "a3": "1", "a4": "1", "c3": "1", "e4": "1", "c6": "1"};

  assert("Correct solution response").that(Checker.check("6x6-ship3", clues, data)).isEqualTo({status: "OK"});
}),

test('Area is not a ship',(suite) => {
  let clues = {"d1": "wave", "b2": "5", "d2": "4", "d5": "2", "f6": "0"};
  // Ship a3-a4 is extended with b4 and forms L-shape.
  let data = {"a1": "1", "b1": "1", "c1": "1", "e1": "1", "e2": "1", "a3": "1", "a4": "1", "b4": "1", "c3": "1", "e4": "1", "c6": "1"};

  assert("Not a ship response").that(Checker.check("6x6-ship3", clues, data)).isEqualTo({status: "Each marked area should form a ship from the set", errors: ["a3", "a4", "b4"]});
}),

test('Too many ships of one size',(suite) => {
  let clues = {"d1": "wave", "b2": "5", "d2": "4", "d5": "2", "f6": "0"};
  // Extra ship of size 1 in a6: four ships of size 1 instead of three.
  let data = {"a1": "1", "b1": "1", "c1": "1", "e1": "1", "e2": "1", "a3": "1", "a4": "1", "c3": "1", "e4": "1", "c6": "1", "a6": "1"};

  assert("Too many ships response").that(Checker.check("6x6-ship3", clues, data)).isEqualTo({status: "Number of the ships should correspond to the given set", errors: ["a6", "c3", "c6", "e4"]});
}),

test('Not enough ships of one size',(suite) => {
  let clues = {"d1": "wave", "b2": "5", "d2": "4", "d5": "2", "f6": "0"};
  // No ship in c6: two ships of size 1 instead of three.
  let data = {"a1": "1", "b1": "1", "c1": "1", "e1": "1", "e2": "1", "a3": "1", "a4": "1", "c3": "1", "e4": "1"};

  assert("Not enough ships response").that(Checker.check("6x6-ship3", clues, data)).isEqualTo({status: "Number of the ships should correspond to the given set", errors: ["c3", "e4"]});
}),

test('Ships touch diagonally',(suite) => {
  let clues = {"d1": "wave", "b2": "5", "d2": "4", "d5": "2", "f6": "0"};
  // Ship of size 1 is in f3 instead of e4, it touches the ship e1-e2 diagonally.
  let data = {"a1": "1", "b1": "1", "c1": "1", "e1": "1", "e2": "1", "a3": "1", "a4": "1", "c3": "1", "f3": "1", "c6": "1"};

  assert("Touching ships response").that(Checker.check("6x6-ship3", clues, data)).isEqualTo({status: "Ships shouldn't touch", errors: ["e2", "f3"]});
}),

test('Wrong number of ship cells around the clue',(suite) => {
  let clues = {"d1": "wave", "b2": "5", "d2": "4", "d5": "2", "f6": "0"};
  // Ship of size 1 is in b6 instead of c6: only one ship cell (e4) is around d5.
  let data = {"a1": "1", "b1": "1", "c1": "1", "e1": "1", "e2": "1", "a3": "1", "a4": "1", "c3": "1", "e4": "1", "b6": "1"};

  assert("Wrong clue response").that(Checker.check("6x6-ship3", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["d5"]});
}),

);
