// Puzzle 4x4 with areas and its solution:
//   +---+---+---+---+
//   | 1 | 3   2   1 |      a1 b1 c1 d1
//   +   +---+---+---+
//   | 2 | 1   3   2 |      a2 b2 c2 d2
//   +---+---+   +---+
//   | 1   2 | 4 | 3 |      a3 b3 c3 d3
//   +   +---+---+   +
//   | 3 | 1   2   4 |      a4 b4 c4 d4
//   +---+---+---+---+
// Given digits are b1, c3 and a4.
checkerTestSuite("ripple_effect", "Ripple effect",

test('Correct solution',(suite) => {
  let clues = {"areas": [["a1","a2"],["b1","c1","d1"],["b2","c2","d2","c3"],["a3","b3","a4"],["d3","d4","c4","b4"]],
               "b1": "3", "c3": "4", "a4": "3"};
  let data = {"a1": "1", "c1": "2", "d1": "1",
              "a2": "2", "b2": "1", "c2": "3", "d2": "2",
              "a3": "1", "b3": "2", "d3": "3",
              "b4": "1", "c4": "2", "d4": "4"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Same digits are too close in a row',(suite) => {
  let clues = {"areas": [["a1","a2"],["b1","c1","d1"],["b2","c2","d2","c3"],["a3","b3","a4"],["d3","d4","c4","b4"]],
               "b1": "3", "c3": "4", "a4": "3"};
  // Digits in d3 and d4 are swapped, so two 4's are side by side in c3 and d3.
  let data = {"a1": "1", "c1": "2", "d1": "1",
              "a2": "2", "b2": "1", "c2": "3", "d2": "2",
              "a3": "1", "b3": "2", "d3": "4",
              "b4": "1", "c4": "2", "d4": "3"};

  assert("Close digits in row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Distance between digits is too small", errors: ["c3", "d3"]});
}),

test('Same digits are too close in a column',(suite) => {
  let clues = {"areas": [["a1","a2"],["b1","c1","d1"],["b2","c2","d2","c3"],["a3","b3","a4"],["d3","d4","c4","b4"]],
               "b1": "3", "c3": "4", "a4": "3"};
  // Digits in a3 and b3 are swapped, so two 2's are one above the other in a2 and a3.
  let data = {"a1": "1", "c1": "2", "d1": "1",
              "a2": "2", "b2": "1", "c2": "3", "d2": "2",
              "a3": "2", "b3": "1", "d3": "3",
              "b4": "1", "c4": "2", "d4": "4"};

  assert("Close digits in column response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Distance between digits is too small", errors: ["a2", "a3"]});
}),

test('Area is not filled with all digits',(suite) => {
  let clues = {"areas": [["a1","a2"],["b1","c1","d1"],["b2","c2","d2","c3"],["a3","b3","a4"],["d3","d4","c4","b4"]],
               "b1": "3", "c3": "4", "a4": "3"};
  // Cell d1 is empty, so there is no digit 1 in the area b1-d1.
  let data = {"a1": "1", "c1": "2",
              "a2": "2", "b2": "1", "c2": "3", "d2": "2",
              "a3": "1", "b3": "2", "d3": "3",
              "b4": "1", "c4": "2", "d4": "4"};

  assert("Incomplete area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Area should contain sequential numbers from 1 to N", errors: ["b1", "c1", "d1"]});
}),

test('Areas are not kept from the previous puzzle',(suite) => {
  let clues = {"areas": [["a1", "a2"], ["b1", "c1", "d1"], ["b2", "c2", "d2", "c3"], ["a3", "b3", "a4"], ["d3", "d4", "c4", "b4"]], "b1": "3", "c3": "4", "a4": "3"};
  let data = {"a1": "1", "c1": "2", "d1": "1", "a2": "2", "b2": "1", "c2": "3", "d2": "2", "a3": "1", "b3": "2", "d3": "3", "b4": "1", "c4": "2", "d4": "4"};
  assert("Puzzle with areas response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});

  // The next puzzle has the same clues, but no areas, so the rules for areas are not applied.
  // With the areas of the previous puzzle this grid is wrong (see 'Area is not filled with all digits').
  let otherClues = {"b1": "3", "c3": "4", "a4": "3"};
  let otherData = {"a1": "1", "c1": "2", "a2": "2", "b2": "1", "c2": "3", "d2": "2", "a3": "1", "b3": "2", "d3": "3", "b4": "1", "c4": "2", "d4": "4"};
  assert("Puzzle without areas response").that(Checker.check("4x4", otherClues, otherData)).isEqualTo({status: "OK"});
}),

);
