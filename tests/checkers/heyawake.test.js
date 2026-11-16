// Puzzle 5x5 with 6 areas (shown by letters) and its solution (# is a black cell).
// A clue shows the number of black cells in the area:
//   1 . 0 . .      A A B B B      . . . . .      a1 b1 c1 d1 e1
//   . . . . .      A A B B B      # . . . .      a2 b2 c2 d2 e2
//   1 . . 2 .      C C C D D      . . # . #      a3 b3 c3 d3 e3
//   2 . 0 . .      E E F D D      . # . . .      a4 b4 c4 d4 e4
//   . . . . .      E E F D D      # . . # .      a5 b5 c5 d5 e5
checkerTestSuite("heyawake", "Heyawake",

test('Correct solution',(suite) => {
  let clues = {
    "areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "e1", "c2", "d2", "e2"], ["a3", "b3", "c3"], ["d3", "e3", "d4", "e4", "d5", "e5"], ["a4", "b4", "a5", "b5"], ["c4", "c5"]],
    "a1": "1", "c1": "0", "a3": "1", "d3": "2", "a4": "2", "c4": "0"};
  let data = {"a2": "1", "c3": "1", "e3": "1", "b4": "1", "a5": "1", "d5": "1"};

  assert("Correct solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "OK"});
}),

test('White area is not connected',(suite) => {
  let clues = {
    "areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "e1", "c2", "d2", "e2"], ["a3", "b3", "c3"], ["d3", "e3", "d4", "e4", "d5", "e5"], ["a4", "b4", "a5", "b5"], ["c4", "c5"]],
    "a1": "1", "c1": "0", "a3": "1", "d3": "2", "a4": "2", "c4": "0"};
  // Extra black cell b1 together with a2 cuts off the corner a1.
  let data = {"b1": "1", "a2": "1", "c3": "1", "e3": "1", "b4": "1", "a5": "1", "d5": "1"};

  assert("Not connected response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "White area should be connected"});
}),

test('Black cells share an edge',(suite) => {
  let clues = {
    "areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "e1", "c2", "d2", "e2"], ["a3", "b3", "c3"], ["d3", "e3", "d4", "e4", "d5", "e5"], ["a4", "b4", "a5", "b5"], ["c4", "c5"]],
    "a1": "1", "c1": "0", "a3": "1", "d3": "2", "a4": "2", "c4": "0"};
  // Extra black cell e2 is just above e3.
  let data = {"a2": "1", "e2": "1", "c3": "1", "e3": "1", "b4": "1", "a5": "1", "d5": "1"};

  assert("Black cells touch response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Blackened cells shouldn't sharing an edge", errors: ["e2", "e3"]});
}),

test('Wrong number of black cells in the area',(suite) => {
  let clues = {
    "areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "e1", "c2", "d2", "e2"], ["a3", "b3", "c3"], ["d3", "e3", "d4", "e4", "d5", "e5"], ["a4", "b4", "a5", "b5"], ["c4", "c5"]],
    "a1": "1", "c1": "0", "a3": "1", "d3": "2", "a4": "2", "c4": "0"};
  // Without d5 there is only one black cell in the area d3-e5.
  let data = {"a2": "1", "c3": "1", "e3": "1", "b4": "1", "a5": "1"};

  assert("Wrong clue response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["d3", "e3", "d4", "e4", "d5", "e5"]});
}),

test('White cells in a row span three areas',(suite) => {
  let clues = {
    "areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "e1", "c2", "d2", "e2"], ["a3", "b3", "c3"], ["d3", "e3", "d4", "e4", "d5", "e5"], ["a4", "b4", "a5", "b5"], ["c4", "c5"]],
    "a1": "1", "c1": "0", "a3": "1", "d3": "2", "a4": "2", "c4": "0"};
  // Black cell is moved from d5 to e5: white cells b5, c5, d5 belong to three different areas.
  let data = {"a2": "1", "c3": "1", "e3": "1", "b4": "1", "a5": "1", "e5": "1"};

  assert("Row span response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Sequence of white cells cannot span more than two outlined areas", errors: ["b5", "c5", "d5"]});
}),

test('White cells in a column span three areas',(suite) => {
  let clues = {
    "areas": [["a1", "b1", "a2", "b2"], ["c1", "d1", "e1", "c2", "d2", "e2"], ["a3", "b3", "c3"], ["d3", "e3", "d4", "e4", "d5", "e5"], ["a4", "b4", "a5", "b5"], ["c4", "c5"]],
    "a1": "1", "c1": "0", "a3": "1", "d3": "2", "a4": "2", "c4": "0"};
  // Black cell is moved from a2 to b1: white cells a1, a2, a3, a4 belong to three different areas.
  let data = {"b1": "1", "c3": "1", "e3": "1", "b4": "1", "a5": "1", "d5": "1"};

  assert("Column span response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Sequence of white cells cannot span more than two outlined areas", errors: ["a1", "a2", "a3", "a4"]});
}),

);
