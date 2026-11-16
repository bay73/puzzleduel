// Puzzle 8x8 and its solution (O is a circle). It is the smallest size where a solution exists.
// Clues outside the grid show the number of cells between two circles of the row/column:
//   . O . O . . . .  1      a1 b1 c1 d1 e1 f1 g1 h1
//   . . . . . O . O         a2 ...
//   . O . O . . . .
//   . . . . . O . O  1
//   O . O . . . . .
//   . . . . O . O .
//   O . O . . . . .
//   . . . . O . O .  1
//   1     1       1
checkerTestSuite("gaps", "Gaps",

test('Correct solution',(suite) => {
  let clues = {"bottom": ["1", null, null, "1", null, null, null, "1"], "right": ["1", null, null, "1", null, null, null, "1"]};
  let data = {
    "b1": "white_circle", "d1": "white_circle", "f2": "white_circle", "h2": "white_circle",
    "b3": "white_circle", "d3": "white_circle", "f4": "white_circle", "h4": "white_circle",
    "a5": "white_circle", "c5": "white_circle", "e6": "white_circle", "g6": "white_circle",
    "a7": "white_circle", "c7": "white_circle", "e8": "white_circle", "g8": "white_circle"};

  assert("Correct solution response").that(Checker.check("8x8", clues, data)).isEqualTo({status: "OK"});
}),

test('Circles touch by side',(suite) => {
  let clues = {"bottom": ["1", null, null, "1", null, null, null, "1"], "right": ["1", null, null, "1", null, null, null, "1"]};
  // Circle from d1 is moved to c1, next to b1.
  let data = {
    "b1": "white_circle", "c1": "white_circle", "f2": "white_circle", "h2": "white_circle",
    "b3": "white_circle", "d3": "white_circle", "f4": "white_circle", "h4": "white_circle",
    "a5": "white_circle", "c5": "white_circle", "e6": "white_circle", "g6": "white_circle",
    "a7": "white_circle", "c7": "white_circle", "e8": "white_circle", "g8": "white_circle"};

  assert("Touching circles response").that(Checker.check("8x8", clues, data)).isEqualTo({status: "Cells with circles shouldn't touch", errors: ["b1", "c1"]});
}),

test('Circles touch diagonally',(suite) => {
  let clues = {"bottom": ["1", null, null, "1", null, null, null, "1"], "right": ["1", null, null, "1", null, null, null, "1"]};
  // Circle from d1 is moved to e1, which touches f2 by corner.
  let data = {
    "b1": "white_circle", "e1": "white_circle", "f2": "white_circle", "h2": "white_circle",
    "b3": "white_circle", "d3": "white_circle", "f4": "white_circle", "h4": "white_circle",
    "a5": "white_circle", "c5": "white_circle", "e6": "white_circle", "g6": "white_circle",
    "a7": "white_circle", "c7": "white_circle", "e8": "white_circle", "g8": "white_circle"};

  assert("Touching circles response").that(Checker.check("8x8", clues, data)).isEqualTo({status: "Cells with circles shouldn't touch", errors: ["e1", "f2"]});
}),

test('Wrong number of circles in a row',(suite) => {
  let clues = {"bottom": ["1", null, null, "1", null, null, null, "1"], "right": ["1", null, null, "1", null, null, null, "1"]};
  // Circle in d3 is missing.
  let data = {
    "b1": "white_circle", "d1": "white_circle", "f2": "white_circle", "h2": "white_circle",
    "b3": "white_circle", "f4": "white_circle", "h4": "white_circle",
    "a5": "white_circle", "c5": "white_circle", "e6": "white_circle", "g6": "white_circle",
    "a7": "white_circle", "c7": "white_circle", "e8": "white_circle", "g8": "white_circle"};

  assert("Wrong row response").that(Checker.check("8x8", clues, data)).isEqualTo({status: "Each row should have exactly two circles", errors: ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"]});
}),

test('Wrong distance between circles in a row',(suite) => {
  let clues = {"bottom": ["1", null, null, "1", null, null, null, "1"], "right": ["1", null, null, "1", null, null, null, "1"]};
  // Circle from b1 is moved to a1, so there are two cells between circles of the first row.
  let data = {
    "a1": "white_circle", "d1": "white_circle", "f2": "white_circle", "h2": "white_circle",
    "b3": "white_circle", "d3": "white_circle", "f4": "white_circle", "h4": "white_circle",
    "a5": "white_circle", "c5": "white_circle", "e6": "white_circle", "g6": "white_circle",
    "a7": "white_circle", "c7": "white_circle", "e8": "white_circle", "g8": "white_circle"};

  assert("Wrong row clue response").that(Checker.check("8x8", clues, data)).isEqualTo({status: "Wrong number of cells between circles in the row", errors: ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"]});
}),

test('Wrong number of circles in a column',(suite) => {
  let clues = {"bottom": ["1", null, null, "1", null, null, null, "1"], "right": ["1", null, null, "1", null, null, null, "1"]};
  // Circles of the first row are moved from b1, d1 to a1, c1: every row still has two circles,
  // but column a has three of them.
  let data = {
    "a1": "white_circle", "c1": "white_circle", "f2": "white_circle", "h2": "white_circle",
    "b3": "white_circle", "d3": "white_circle", "f4": "white_circle", "h4": "white_circle",
    "a5": "white_circle", "c5": "white_circle", "e6": "white_circle", "g6": "white_circle",
    "a7": "white_circle", "c7": "white_circle", "e8": "white_circle", "g8": "white_circle"};

  assert("Wrong column response").that(Checker.check("8x8", clues, data)).isEqualTo({status: "Each column should have exactly two circles", errors: ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8"]});
}),

test('Wrong distance between circles in a column',(suite) => {
  // There is one cell between circles of column d, but the clue requires two.
  let clues = {"bottom": ["1", null, null, "2", null, null, null, "1"], "right": ["1", null, null, "1", null, null, null, "1"]};
  let data = {
    "b1": "white_circle", "d1": "white_circle", "f2": "white_circle", "h2": "white_circle",
    "b3": "white_circle", "d3": "white_circle", "f4": "white_circle", "h4": "white_circle",
    "a5": "white_circle", "c5": "white_circle", "e6": "white_circle", "g6": "white_circle",
    "a7": "white_circle", "c7": "white_circle", "e8": "white_circle", "g8": "white_circle"};

  assert("Wrong column clue response").that(Checker.check("8x8", clues, data)).isEqualTo({status: "Wrong number of cells between circles in the column", errors: ["d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8"]});
}),

);
