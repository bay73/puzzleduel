// Puzzle 4x4 and its solution. A clue shows the total length of the lines going from the cell:
//   3 . . .      3--------      a1 b1 c1 d1
//   . 1 . .      |  1--  |      a2 b2 c2 d2
//   . . . 3      |  -----3      a3 b3 c3 d3
//   5 . . .      5--------      a4 b4 c4 d4
// Connector "a1-h" joins a1 with b1, connector "a1-v" joins a1 with a2.
checkerTestSuite("four_winds", "Four winds",

test('Correct solution',(suite) => {
  let clues = {"a1": "3", "b2": "1", "d3": "3", "a4": "5"};
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "b2-h": "1", "d2-v": "1", "b3-h": "1", "c3-h": "1", "a2-v": "1", "a3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Wrong length of lines',(suite) => {
  let clues = {"a1": "3", "b2": "1", "d3": "3", "a4": "5"};
  // The line from a1 ends in c1, so its length is 2.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "b2-h": "1", "d2-v": "1", "b3-h": "1", "c3-h": "1", "a2-v": "1", "a3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Wrong length response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["a1"]});
}),

test('Line reaches another clue',(suite) => {
  let clues = {"a1": "3", "b2": "1", "d3": "3", "a4": "5"};
  // Extra connector a1-v: the line from a1 goes down and joins the line coming to a4.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "a1-v": "1", "b2-h": "1", "d2-v": "1", "b3-h": "1", "c3-h": "1", "a2-v": "1", "a3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Line reaches a clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The line from a clue shouldn't pass another clue or cell with a cross", errors: ["a4"]});
}),

test('Lines cross',(suite) => {
  let clues = {"a1": "3", "b2": "1", "d3": "3", "a4": "5"};
  // Extra connector d1-v: the line going up from d3 reaches d1 which belongs to the line from a1.
  let data = {"connectors": {"a1-h": "1", "b1-h": "1", "c1-h": "1", "d1-v": "1", "b2-h": "1", "d2-v": "1", "b3-h": "1", "c3-h": "1", "a2-v": "1", "a3-v": "1", "a4-h": "1", "b4-h": "1", "c4-h": "1"}};

  assert("Lines cross response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The lines can't cross", errors: ["d1"]});
}),

);
