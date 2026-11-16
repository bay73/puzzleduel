// Puzzle 6x6 with ships set "ship3" (one ship of size 3, two ships of size 2, three ships of size 1).
// The number shows how many ship cells are a knight's move away, ~ is a wave.
// The solution (# is a ship cell):
//   . . . . . .      # # # . # .
//   . . . . . .      . . . . # .
//   . 2 . 2 . .      # . # . . .
//   . . . . . .      # . . . # .
//   . . . 1 . 0      . . . . . .
//   . . . . . ~      . . # . . .
checkerTestSuite("battleships_knight", "Knight battleships",

test('Correct solution',(suite) => {
  let clues = {"b3": "2", "d3": "2", "d5": "1", "f5": "0", "f6": "wave"};
  let data = {"a1": "1", "b1": "1", "c1": "1", "e1": "1", "e2": "1", "a3": "1", "a4": "1", "c3": "1", "e4": "1", "c6": "1"};

  assert("Correct solution response").that(Checker.check("6x6-ship3", clues, data)).isEqualTo({status: "OK"});
}),

test('Area is not a ship',(suite) => {
  let clues = {"b3": "2", "d3": "2", "d5": "1", "f5": "0", "f6": "wave"};
  // Extra cell b2 forms T-shape with the ship a1-b1-c1.
  let data = {"a1": "1", "b1": "1", "c1": "1", "b2": "1", "e1": "1", "e2": "1", "a3": "1", "a4": "1", "c3": "1", "e4": "1", "c6": "1"};

  assert("Not a ship response").that(Checker.check("6x6-ship3", clues, data)).isEqualTo({status: "Each marked area should form a ship from the set", errors: ["a1", "b1", "c1", "b2"]});
}),

test('Too many ships of one size',(suite) => {
  let clues = {"b3": "2", "d3": "2", "d5": "1", "f5": "0", "f6": "wave"};
  // Extra ship of size 1 in a6: four ships of size 1 instead of three.
  let data = {"a1": "1", "b1": "1", "c1": "1", "e1": "1", "e2": "1", "a3": "1", "a4": "1", "c3": "1", "e4": "1", "c6": "1", "a6": "1"};

  assert("Too many ships response").that(Checker.check("6x6-ship3", clues, data)).isEqualTo({status: "Number of the ships should correspond to the given set", errors: ["a6", "c3", "c6", "e4"]});
}),

test('Not enough ships of one size',(suite) => {
  let clues = {"b3": "2", "d3": "2", "d5": "1", "f5": "0", "f6": "wave"};
  // No ship in c6: two ships of size 1 instead of three.
  let data = {"a1": "1", "b1": "1", "c1": "1", "e1": "1", "e2": "1", "a3": "1", "a4": "1", "c3": "1", "e4": "1"};

  assert("Not enough ships response").that(Checker.check("6x6-ship3", clues, data)).isEqualTo({status: "Number of the ships should correspond to the given set", errors: ["c3", "e4"]});
}),

test('Ships touch diagonally',(suite) => {
  let clues = {"b3": "2", "d3": "2", "d5": "1", "f5": "0", "f6": "wave"};
  // Ship of size 1 is in f3 instead of e4, it touches the ship e1-e2 diagonally.
  let data = {"a1": "1", "b1": "1", "c1": "1", "e1": "1", "e2": "1", "a3": "1", "a4": "1", "c3": "1", "f3": "1", "c6": "1"};

  assert("Touching ships response").that(Checker.check("6x6-ship3", clues, data)).isEqualTo({status: "Ships shouldn't touch", errors: ["e2", "f3"]});
}),

test('Wrong number of ship cells for the clue',(suite) => {
  let clues = {"b3": "2", "d3": "2", "d5": "1", "f5": "0", "f6": "wave"};
  // Ship of size 1 is in b6 instead of c6: two ship cells (c3 and b6) are a knight's move away from d5.
  let data = {"a1": "1", "b1": "1", "c1": "1", "e1": "1", "e2": "1", "a3": "1", "a4": "1", "c3": "1", "e4": "1", "b6": "1"};

  assert("Wrong clue response").that(Checker.check("6x6-ship3", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["d5"]});
}),

);
