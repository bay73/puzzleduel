// Puzzle 4x4 and its solution (* is a bulb):
//   . * . #      a1 b1 c1 d1
//   * 2 . *      a2 b2 c2 d2
//   . . * .      a3 b3 c3 d3
//   # * . 0      a4 b4 c4 d4
checkerTestSuite("akari", "Akari",

test('Correct solution',(suite) => {
  let clues = {"d1": "black", "b2": "2", "a4": "black", "d4": "0"};
  let data = {"b1": "bulb", "a2": "bulb", "d2": "bulb", "c3": "bulb", "b4": "bulb"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Bulbs illuminate each other',(suite) => {
  let clues = {"d1": "black", "b2": "2", "a4": "black", "d4": "0"};
  // Extra bulb in a1 is in the same row with b1.
  let data = {"a1": "bulb", "b1": "bulb", "a2": "bulb", "d2": "bulb", "c3": "bulb", "b4": "bulb"};

  assert("Bulbs illuminate each other response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Bulbs shouldn't illuminate each other", errors: ["a1", "b1"]});
}),

test('Cell is not illuminated',(suite) => {
  let clues = {"d1": "black", "b2": "2", "a4": "black", "d4": "0"};
  // Without bulb in b4 this cell is not illuminated.
  let data = {"b1": "bulb", "a2": "bulb", "d2": "bulb", "c3": "bulb"};

  assert("Cell is not illuminated response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "All white cells should be illuminated", errors: ["b4"]});
}),

test('Wrong number of bulbs around the clue',(suite) => {
  // There are no bulbs around d4, but the clue requires one.
  let clues = {"d1": "black", "b2": "2", "a4": "black", "d4": "1"};
  let data = {"b1": "bulb", "a2": "bulb", "d2": "bulb", "c3": "bulb", "b4": "bulb"};

  assert("Wrong clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["d4"]});
}),

);
