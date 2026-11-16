// Puzzle 4x4 and its solution:
//   +---+---+---+---+
//   | 4             |      a1 b1 c1 d1
//   +---+---+---+---+
//   |   |       | 2 |      a2 b2 c2 d2
//   +   +       +   +
//   | 3 |     4 |   |      a3 b3 c3 d3
//   +   +---+---+---+
//   |   |     3     |      a4 b4 c4 d4
//   +---+---+---+---+
checkerTestSuite("shikaku", "Shikaku",

test('Correct solution',(suite) => {
  let clues = {"a1": "4", "d2": "2", "a3": "3", "c3": "4", "c4": "3"};
  let data = {"areas": [["a1","b1","c1","d1"], ["a2","a3","a4"], ["b2","c2","b3","c3"], ["d2","d3"], ["b4","c4","d4"]]};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Area is not a rectangle',(suite) => {
  let clues = {"a1": "4", "d2": "2", "a3": "3", "c3": "4", "c4": "3"};
  // Areas d2-d3 and b4-d4 are joined into one L-shaped area.
  let data = {"areas": [["a1","b1","c1","d1"], ["a2","a3","a4"], ["b2","c2","b3","c3"], ["d2","d3","b4","c4","d4"]]};

  assert("Not rectangle response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each area should have rectangular or square shape", errors: ["d2","d3","b4","c4","d4"]});
}),

test('Two clues in one area',(suite) => {
  let clues = {"a1": "4", "d2": "2", "a3": "3", "c3": "4", "c4": "3"};
  // Areas b2-c3 and d2-d3 are joined into one rectangle with clues in c3 and d2.
  let data = {"areas": [["a1","b1","c1","d1"], ["a2","a3","a4"], ["b2","c2","d2","b3","c3","d3"], ["b4","c4","d4"]]};

  assert("Two clues response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each area should contain exactly one clue", errors: ["b2","c2","d2","b3","c3","d3"]});
}),

test('No clues in the area',(suite) => {
  // No clue in d2.
  let clues = {"a1": "4", "a3": "3", "c3": "4", "c4": "3"};
  let data = {"areas": [["a1","b1","c1","d1"], ["a2","a3","a4"], ["b2","c2","b3","c3"], ["d2","d3"], ["b4","c4","d4"]]};

  assert("No clues response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each area should contain exactly one clue", errors: ["d2","d3"]});
}),

test('Wrong size of the area',(suite) => {
  // The clue in a1 is 3, but the size of the area a1-d1 is 4.
  let clues = {"a1": "3", "d2": "2", "a3": "3", "c3": "4", "c4": "3"};
  let data = {"areas": [["a1","b1","c1","d1"], ["a2","a3","a4"], ["b2","c2","b3","c3"], ["d2","d3"], ["b4","c4","d4"]]};

  assert("Wrong size response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Clue should show the size of the area", errors: ["a1","b1","c1","d1"]});
}),

test('Cell without area',(suite) => {
  let clues = {"a1": "4", "d2": "2", "a3": "3", "c3": "4", "c4": "3"};
  // Solution without the area b4-c4-d4: b4 is the first cell which doesn't belong to any area.
  let data = {"areas": [["a1", "b1", "c1", "d1"], ["a2", "a3", "a4"], ["b2", "c2", "b3", "c3"], ["d2", "d3"]]};

  assert("Cell without area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["b4"]});
}),

test('Cell in two areas',(suite) => {
  let clues = {"a1": "4", "d2": "2", "a3": "3", "c3": "4", "c4": "3"};
  // Solution with an extra area which consists of the cell a1.
  let data = {"areas": [["a1", "b1", "c1", "d1"], ["a2", "a3", "a4"], ["b2", "c2", "b3", "c3"], ["d2", "d3"], ["b4", "c4", "d4"], ["a1"]]};

  assert("Cell in two areas response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["a1"]});
}),

);
