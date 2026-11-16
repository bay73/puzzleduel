// Puzzle 5x5 and its solution (# is a black cell):
//   O O X X O      a1 b1 c1 d1 e1
//   O O X X X      a2 b2 c2 d2 e2
//   X X # O X      a3 b3 c3 d3 e3
//   O X X O O      a4 b4 c4 d4 e4
//   O O X O X      a5 b5 c5 d5 e5
// Clues are O in a1, X in e3, X in c5 and the black cell c3.
checkerTestSuite("xo", "XO",

test('Correct solution',(suite) => {
  let clues = {"a1": "O", "e3": "X", "c5": "X", "c3": "black"};
  let data = {
    "b1": "O", "c1": "X", "d1": "X", "e1": "O",
    "a2": "O", "b2": "O", "c2": "X", "d2": "X", "e2": "X",
    "a3": "X", "b3": "X", "d3": "O",
    "a4": "O", "b4": "X", "c4": "X", "d4": "O", "e4": "O",
    "a5": "O", "b5": "O", "d5": "O", "e5": "X"};

  assert("Correct solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "OK"});
}),

test('Empty cell',(suite) => {
  let clues = {"a1": "O", "e3": "X", "c5": "X", "c3": "black"};
  // Cell b4 is not filled.
  let data = {
    "b1": "O", "c1": "X", "d1": "X", "e1": "O",
    "a2": "O", "b2": "O", "c2": "X", "d2": "X", "e2": "X",
    "a3": "X", "b3": "X", "d3": "O",
    "a4": "O", "c4": "X", "d4": "O", "e4": "O",
    "a5": "O", "b5": "O", "d5": "O", "e5": "X"};

  assert("Empty cell response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "All cells should be filled", errors: ["b4"]});
}),

test('Four symbols in the row',(suite) => {
  let clues = {"a1": "O", "e3": "X", "c5": "X", "c3": "black"};
  // X in b2 instead of O: four X's in the second row.
  let data = {
    "b1": "O", "c1": "X", "d1": "X", "e1": "O",
    "a2": "O", "b2": "X", "c2": "X", "d2": "X", "e2": "X",
    "a3": "X", "b3": "X", "d3": "O",
    "a4": "O", "b4": "X", "c4": "X", "d4": "O", "e4": "O",
    "a5": "O", "b5": "O", "d5": "O", "e5": "X"};

  assert("Four in the row response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Four identical symbols shouldn't form a continious line", errors: ["b2", "c2", "d2", "e2"]});
}),

test('Four symbols in the column',(suite) => {
  let clues = {"a1": "O", "e3": "X", "c5": "X", "c3": "black"};
  // O in d2 instead of X: four O's in column d.
  let data = {
    "b1": "O", "c1": "X", "d1": "X", "e1": "O",
    "a2": "O", "b2": "O", "c2": "X", "d2": "O", "e2": "X",
    "a3": "X", "b3": "X", "d3": "O",
    "a4": "O", "b4": "X", "c4": "X", "d4": "O", "e4": "O",
    "a5": "O", "b5": "O", "d5": "O", "e5": "X"};

  assert("Four in the column response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Four identical symbols shouldn't form a continious line", errors: ["d2", "d3", "d4", "d5"]});
}),

test('Four symbols in the diagonal',(suite) => {
  let clues = {"a1": "O", "e3": "X", "c5": "X", "c3": "black"};
  // O in c2 instead of X: four O's in the diagonal b1-e4.
  let data = {
    "b1": "O", "c1": "X", "d1": "X", "e1": "O",
    "a2": "O", "b2": "O", "c2": "O", "d2": "X", "e2": "X",
    "a3": "X", "b3": "X", "d3": "O",
    "a4": "O", "b4": "X", "c4": "X", "d4": "O", "e4": "O",
    "a5": "O", "b5": "O", "d5": "O", "e5": "X"};

  assert("Four in the diagonal response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Four identical symbols shouldn't form a continious line", errors: ["b1", "c2", "d3", "e4"]});
}),

test('Four symbols in the anti-diagonal',(suite) => {
  let clues = {"a1": "O", "e3": "X", "c5": "X", "c3": "black"};
  // X in a4 instead of O: four X's in the diagonal d1-a4.
  let data = {
    "b1": "O", "c1": "X", "d1": "X", "e1": "O",
    "a2": "O", "b2": "O", "c2": "X", "d2": "X", "e2": "X",
    "a3": "X", "b3": "X", "d3": "O",
    "a4": "X", "b4": "X", "c4": "X", "d4": "O", "e4": "O",
    "a5": "O", "b5": "O", "d5": "O", "e5": "X"};

  assert("Four in the anti-diagonal response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Four identical symbols shouldn't form a continious line", errors: ["d1", "c2", "b3", "a4"]});
}),

);
