// Puzzle 9x9 and its solution (letters are cells of the tetrominoes I, O, T, S, J, L, Z).
// Clues are placed in the nodes: the node "a1-2" is the bottom right corner of the cell a1,
// its clue is the number of shaded cells among a1, b1, a2, b2.
//      a b c d e f g h i
//   1  I I I I . O O . .
//   2  . . . . . O O . .
//   3  T T T . . . . . J
//   4  . T . . S . . . J
//   5  . . . . S S . J J
//   6  . . . . . S . . .
//   7  L . . . . . . . .
//   8  L . . Z Z . . x .
//   9  L L . . Z Z . . .
checkerTestSuite("tetro_scope", "Tetro Scope",

test('Correct solution',(suite) => {
  let clues = {"h8": "cross", "nodes": {"a1-2": "2", "e4-2": "3", "h4-2": "3", "c6-2": "0"}};
  let data = {
    "a1": "1", "b1": "1", "c1": "1", "d1": "1",
    "f1": "1", "g1": "1", "f2": "1", "g2": "1",
    "a3": "1", "b3": "1", "c3": "1", "b4": "1",
    "e4": "1", "e5": "1", "f5": "1", "f6": "1",
    "i3": "1", "i4": "1", "h5": "1", "i5": "1",
    "a7": "1", "a8": "1", "a9": "1", "b9": "1",
    "d8": "1", "e8": "1", "e9": "1", "f9": "1"};

  assert("Correct solution response").that(Checker.check("9x9", clues, data)).isEqualTo({status: "OK"});
}),

test('Area is not a tetromino',(suite) => {
  let clues = {"h8": "cross", "nodes": {"a1-2": "2", "e4-2": "3", "h4-2": "3", "c6-2": "0"}};
  // Cell f6 is not shaded, so the area e4-e5-f5 consists of three cells only.
  let data = {
    "a1": "1", "b1": "1", "c1": "1", "d1": "1",
    "f1": "1", "g1": "1", "f2": "1", "g2": "1",
    "a3": "1", "b3": "1", "c3": "1", "b4": "1",
    "e4": "1", "e5": "1", "f5": "1",
    "i3": "1", "i4": "1", "h5": "1", "i5": "1",
    "a7": "1", "a8": "1", "a9": "1", "b9": "1",
    "d8": "1", "e8": "1", "e9": "1", "f9": "1"};

  assert("Not a tetromino response").that(Checker.check("9x9", clues, data)).isEqualTo({status: "Each marked area should form a tetromino", errors: ["e4", "e5", "f5"]});
}),

test('Tetromino is used twice',(suite) => {
  let clues = {"h8": "cross", "nodes": {"a1-2": "2", "e4-2": "3", "h4-2": "3", "c6-2": "0"}};
  // Tetromino in the bottom is e8-f8-d9-e9, which is the second S instead of Z.
  let data = {
    "a1": "1", "b1": "1", "c1": "1", "d1": "1",
    "f1": "1", "g1": "1", "f2": "1", "g2": "1",
    "a3": "1", "b3": "1", "c3": "1", "b4": "1",
    "e4": "1", "e5": "1", "f5": "1", "f6": "1",
    "i3": "1", "i4": "1", "h5": "1", "i5": "1",
    "a7": "1", "a8": "1", "a9": "1", "b9": "1",
    "e8": "1", "f8": "1", "d9": "1", "e9": "1"};

  assert("Used twice response").that(Checker.check("9x9", clues, data)).isEqualTo({status: "Each element should be used exactly once", errors: ["d9", "e4", "e5", "e8", "e9", "f5", "f6", "f8"]});
}),

test('Tetromino is missing',(suite) => {
  let clues = {"h8": "cross", "nodes": {"a1-2": "2", "e4-2": "3", "h4-2": "3", "c6-2": "0"}};
  // Tetromino Z is not placed, there are no cells to show.
  let data = {
    "a1": "1", "b1": "1", "c1": "1", "d1": "1",
    "f1": "1", "g1": "1", "f2": "1", "g2": "1",
    "a3": "1", "b3": "1", "c3": "1", "b4": "1",
    "e4": "1", "e5": "1", "f5": "1", "f6": "1",
    "i3": "1", "i4": "1", "h5": "1", "i5": "1",
    "a7": "1", "a8": "1", "a9": "1", "b9": "1"};

  assert("Missing tetromino response").that(Checker.check("9x9", clues, data)).isEqualTo({status: "Each element should be used exactly once", errors: []});
}),

test('Tetrominoes touch diagonally',(suite) => {
  let clues = {"h8": "cross", "nodes": {"a1-2": "2", "e4-2": "3", "h4-2": "3", "c6-2": "0"}};
  // Tetromino Z is shifted one cell left (c8-d8-d9-e9), its cell c8 touches the cell b9 of tetromino L by a corner.
  let data = {
    "a1": "1", "b1": "1", "c1": "1", "d1": "1",
    "f1": "1", "g1": "1", "f2": "1", "g2": "1",
    "a3": "1", "b3": "1", "c3": "1", "b4": "1",
    "e4": "1", "e5": "1", "f5": "1", "f6": "1",
    "i3": "1", "i4": "1", "h5": "1", "i5": "1",
    "a7": "1", "a8": "1", "a9": "1", "b9": "1",
    "c8": "1", "d8": "1", "d9": "1", "e9": "1"};

  assert("Touching tetrominoes response").that(Checker.check("9x9", clues, data)).isEqualTo({status: "Elements shouldn't touch", errors: ["c8", "b9"]});
}),

test('Wrong number of shaded cells around the clue',(suite) => {
  // There are no shaded cells around the node c6-2, but the clue requires one.
  let clues = {"h8": "cross", "nodes": {"a1-2": "2", "e4-2": "3", "h4-2": "3", "c6-2": "1"}};
  let data = {
    "a1": "1", "b1": "1", "c1": "1", "d1": "1",
    "f1": "1", "g1": "1", "f2": "1", "g2": "1",
    "a3": "1", "b3": "1", "c3": "1", "b4": "1",
    "e4": "1", "e5": "1", "f5": "1", "f6": "1",
    "i3": "1", "i4": "1", "h5": "1", "i5": "1",
    "a7": "1", "a8": "1", "a9": "1", "b9": "1",
    "d8": "1", "e8": "1", "e9": "1", "f9": "1"};

  assert("Wrong clue response").that(Checker.check("9x9", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["c6", "d6", "c7", "d7"]});
}),

);
