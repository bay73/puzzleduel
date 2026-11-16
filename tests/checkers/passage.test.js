// Puzzle 5x5 and its solution (# are the ends of the path, + are the other cells of the path):
//   # 3 + . .      a1 b1 c1 d1 e1
//   . . + . .      a2 b2 c2 d2 e2
//   . . 4 . .      a3 b3 c3 d3 e3
//   . . + + #      a4 b4 c4 d4 e4
//   . . . . .      a5 b5 c5 d5 e5
checkerTestSuite("passage", "Passage",

test('Correct solution',(suite) => {
  let clues = {"a1": "black", "b1": "3", "c3": "4", "e4": "black"};
  let data = {"c1": "1", "c2": "1", "c4": "1", "d4": "1"};

  assert("Correct solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "OK"});
}),

test('Path is broken',(suite) => {
  let clues = {"a1": "black", "b1": "3", "c3": "4", "e4": "black"};
  // Cell c2 is not shaded, the path stops in c1.
  let data = {"c1": "1", "c4": "1", "d4": "1"};

  assert("Broken path response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Black cells should form single path without bifurcations", errors: ["c1"]});
}),

test('Path with bifurcation',(suite) => {
  let clues = {"a1": "black", "b1": "3", "c3": "4", "e4": "black"};
  // Extra shaded cell d1: the path can go from c1 both to d1 and to c2.
  let data = {"c1": "1", "d1": "1", "c2": "1", "c4": "1", "d4": "1"};

  assert("Bifurcation response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Black cells should form single path without bifurcations", errors: ["c1"]});
}),

test('Shaded cell outside the path',(suite) => {
  let clues = {"a1": "black", "b1": "3", "c3": "4", "e4": "black"};
  // Extra shaded cell a5 is not connected to the path.
  let data = {"c1": "1", "c2": "1", "c4": "1", "d4": "1", "a5": "1"};

  assert("Cell outside the path response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "All black cells should be part of single path", errors: ["a5"]});
}),

test('Path touches itself',(suite) => {
  let clues = {"a1": "black", "b1": "3", "c3": "4", "e4": "black"};
  // Path a1-c1-c3-a3-a5-d5-d4-e4: cells c3 and d4 touch each other diagonally.
  //   # 3 + . .
  //   . . + . .
  //   + + 4 . .
  //   + . . + #
  //   + + + + .
  let data = {"c1": "1", "c2": "1", "a3": "1", "b3": "1", "a4": "1", "d4": "1", "a5": "1", "b5": "1", "c5": "1", "d5": "1"};

  assert("Path touches itself response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Path shouldn't touch itself", errors: ["d4", "c3"]});
}),

test('Path turns in the cell with number',(suite) => {
  let clues = {"a1": "black", "b1": "3", "c3": "4", "e4": "black"};
  // Path a1-b1-b3-d3-d4-e4 turns in the cell b1.
  let data = {"b2": "1", "b3": "1", "d3": "1", "d4": "1"};

  assert("Turn in the number response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Path shouldn't turn in the cell with digit", errors: ["b1"]});
}),

test('Wrong length of the segment',(suite) => {
  let clues = {"a1": "black", "b1": "3", "c3": "4", "e4": "black"};
  // Path a1-c1-c5-e5-e4: the segment c1-c5 through the clue 4 has length 5.
  let data = {"c1": "1", "c2": "1", "c4": "1", "c5": "1", "d5": "1", "e5": "1"};

  assert("Wrong length response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["c3"]});
}),

);
