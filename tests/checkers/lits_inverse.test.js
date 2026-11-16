// Puzzle 4x4 with two areas (rows 1-2 and rows 3-4) and its solution (# is a black cell):
//   . . . .      a1 b1 c1 d1
//   # # # #      a2 b2 c2 d2
//   ---------
//   # . . #      a3 b3 c3 d3
//   # . . #      a4 b4 c4 d4
// White cells of each area form a tetromino (I and O).
checkerTestSuite("lits_inverse", "LITS Inverse",

test('Correct solution',(suite) => {
  let clues = {"areas": [["a1","b1","c1","d1","a2","b2","c2","d2"], ["a3","b3","c3","d3","a4","b4","c4","d4"]]};
  let data = {"a2": "1", "b2": "1", "c2": "1", "d2": "1", "a3": "1", "d3": "1", "a4": "1", "d4": "1"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Black 2x2 square',(suite) => {
  let clues = {"areas": [["a1","b1","c1","d1","a2","b2","c2","d2"], ["a3","b3","c3","d3","a4","b4","c4","d4"]]};
  // Extra black cell in b3.
  let data = {"a2": "1", "b2": "1", "c2": "1", "d2": "1", "a3": "1", "b3": "1", "d3": "1", "a4": "1", "d4": "1"};

  assert("Black 2x2 square response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "No 2x2 black squares are allowed", errors: ["a2", "b2", "a3", "b3"]});
}),

test('Black area is not connected',(suite) => {
  let clues = {"areas": [["a1","b1","c1","d1","a2","b2","c2","d2"], ["a3","b3","c3","d3","a4","b4","c4","d4"]]};
  // White tetromino of the top area is b1-c1-d1-d2 (L) and of the bottom area is a3-b3-c3-b4 (T):
  // black cells a1-a2-b2-c2 are separated from black cell a4 and from black cells d3-c4-d4.
  let data = {"a1": "1", "a2": "1", "b2": "1", "c2": "1", "d3": "1", "a4": "1", "c4": "1", "d4": "1"};

  assert("Black area is not connected response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "Black area should be connected"});
}),

test('Three white cells in the area',(suite) => {
  let clues = {"areas": [["a1","b1","c1","d1","a2","b2","c2","d2"], ["a3","b3","c3","d3","a4","b4","c4","d4"]]};
  // Extra black cell in a1: only b1-c1-d1 are white in the top area.
  let data = {"a1": "1", "a2": "1", "b2": "1", "c2": "1", "d2": "1", "a3": "1", "d3": "1", "a4": "1", "d4": "1"};

  assert("Three white cells response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "White cells in each area should form valid tetromino", errors: ["a1","b1","c1","d1","a2","b2","c2","d2"]});
}),

test('White cells in the area are not a tetromino',(suite) => {
  let clues = {"areas": [["a1","b1","c1","d1","a2","b2","c2","d2"], ["a3","b3","c3","d3","a4","b4","c4","d4"]]};
  // White cells of the bottom area are a3-a4 and c3-c4: two separate dominoes.
  let data = {"a2": "1", "b2": "1", "c2": "1", "d2": "1", "b3": "1", "d3": "1", "b4": "1", "d4": "1"};

  assert("Not a tetromino response").that(Checker.check("4x4", clues, data)).isEqualTo(
    {status: "White cells in each area should form valid tetromino", errors: ["a3","b3","c3","d3","a4","b4","c4","d4"]});
}),

// Puzzle 5x4 with two areas (rows 1-2 and rows 3-4):
//   # # # # #      a1 b1 c1 d1 e1
//   . . . . #      a2 b2 c2 d2 e2
//   -----------
//   . . . . #      a3 b3 c3 d3 e3
//   # # # # #      a4 b4 c4 d4 e4
test('Same tetrominoes share an edge',(suite) => {
  let clues = {"areas": [["a1","b1","c1","d1","e1","a2","b2","c2","d2","e2"], ["a3","b3","c3","d3","e3","a4","b4","c4","d4","e4"]]};
  // White cells form I tetromino in both areas and these tetrominoes touch each other.
  let data = {"a1": "1", "b1": "1", "c1": "1", "d1": "1", "e1": "1", "e2": "1",
              "e3": "1", "a4": "1", "b4": "1", "c4": "1", "d4": "1", "e4": "1"};

  assert("Same tetrominoes response").that(Checker.check("5x4", clues, data)).isEqualTo(
    {status: "Tetromino of the same type shoudln't share an edge", errors: ["a2", "a3"]});
}),

test('Areas are not kept from the previous puzzle',(suite) => {
  let clues = {"areas": [["a1", "b1", "c1", "d1", "a2", "b2", "c2", "d2"], ["a3", "b3", "c3", "d3", "a4", "b4", "c4", "d4"]]};
  let data = {"a2": "1", "b2": "1", "c2": "1", "d2": "1", "a3": "1", "d3": "1", "a4": "1", "d4": "1"};
  assert("Puzzle with areas response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});

  // The next puzzle has the same clues, but no areas, so the rules for areas are not applied.
  // With the areas of the previous puzzle this grid is wrong (see 'Three white cells in the area').
  let otherClues = {};
  let otherData = {"a1": "1", "a2": "1", "b2": "1", "c2": "1", "d2": "1", "a3": "1", "d3": "1", "a4": "1", "d4": "1"};
  assert("Puzzle without areas response").that(Checker.check("4x4", otherClues, otherData)).isEqualTo({status: "OK"});
}),

);
