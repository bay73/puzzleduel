// Puzzle 4x4 and its solution (areas are marked with letters):
//   1 . 5 3      P P P Q
//   7 . . .      R R R Q
//   . . 2 .      R R R Q
//   2 . 4 6      S S S Q
checkerTestSuite("araf", "Araf",

test('Correct solution',(suite) => {
  let clues = {"a1": "1", "c1": "5", "d1": "3", "a2": "7", "c3": "2", "a4": "2", "c4": "4", "d4": "6"};
  let data = {"areas": [["a1", "b1", "c1"], ["d1", "d2", "d3", "d4"], ["a2", "b2", "c2", "a3", "b3", "c3"], ["a4", "b4", "c4"]]};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Area with four clues',(suite) => {
  let clues = {"a1": "1", "c1": "5", "d1": "3", "a2": "7", "c3": "2", "a4": "2", "c4": "4", "d4": "6"};
  // Areas P and R are not divided.
  let data = {"areas": [["a1", "b1", "c1", "a2", "b2", "c2", "a3", "b3", "c3"], ["d1", "d2", "d3", "d4"], ["a4", "b4", "c4"]]};

  assert("Four clues response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each area should contain exactly two clues", errors: ["a1", "b1", "c1", "a2", "b2", "c2", "a3", "b3", "c3"]});
}),

test('Area with one clue',(suite) => {
  let clues = {"a1": "1", "c1": "5", "d1": "3", "a2": "7", "c3": "2", "a4": "2", "c4": "4", "d4": "6"};
  // Area P is divided into a1-b1 and c1.
  let data = {"areas": [["a1", "b1"], ["c1"], ["d1", "d2", "d3", "d4"], ["a2", "b2", "c2", "a3", "b3", "c3"], ["a4", "b4", "c4"]]};

  assert("One clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each area should contain exactly two clues", errors: ["a1", "b1"]});
}),

test('Size of the area equals to the clue',(suite) => {
  let clues = {"a1": "1", "c1": "5", "d1": "3", "a2": "7", "c3": "2", "a4": "2", "c4": "4", "d4": "6"};
  // Cell b3 belongs to area S: its size is 4, which is not strictly between 2 and 4.
  let data = {"areas": [["a1", "b1", "c1"], ["d1", "d2", "d3", "d4"], ["a2", "b2", "c2", "a3", "c3"], ["b3", "a4", "b4", "c4"]]};

  assert("Wrong size response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The size of an area should be strictly between numbers in area", errors: ["b3", "a4", "b4", "c4"]});
}),

test('Size of the area is greater than both clues',(suite) => {
  let clues = {"a1": "1", "c1": "5", "d1": "3", "a2": "7", "c3": "2", "a4": "2", "c4": "4", "d4": "6"};
  // Cells a3 and b3 belong to area S: its size is 5, which is greater than 2 and 4.
  let data = {"areas": [["a1", "b1", "c1"], ["d1", "d2", "d3", "d4"], ["a2", "b2", "c2", "c3"], ["a3", "b3", "a4", "b4", "c4"]]};

  assert("Too big area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The size of an area should be strictly between numbers in area", errors: ["a3", "b3", "a4", "b4", "c4"]});
}),

test('Cell without area',(suite) => {
  let clues = {"a1": "1", "c1": "5", "d1": "3", "a2": "7", "c3": "2", "a4": "2", "c4": "4", "d4": "6"};
  // Solution without the area a4-b4-c4: a4 is the first cell which doesn't belong to any area.
  let data = {"areas": [["a1", "b1", "c1"], ["d1", "d2", "d3", "d4"], ["a2", "b2", "c2", "a3", "b3", "c3"]]};

  assert("Cell without area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["a4"]});
}),

test('Cell in two areas',(suite) => {
  let clues = {"a1": "1", "c1": "5", "d1": "3", "a2": "7", "c3": "2", "a4": "2", "c4": "4", "d4": "6"};
  // Solution with an extra area which consists of the cell a1.
  let data = {"areas": [["a1", "b1", "c1"], ["d1", "d2", "d3", "d4"], ["a2", "b2", "c2", "a3", "b3", "c3"], ["a4", "b4", "c4"], ["a1"]]};

  assert("Cell in two areas response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each cell should belong to exactly one area", errors: ["a1"]});
}),

);
