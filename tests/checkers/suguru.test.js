// Areas of the 4x4 puzzle and its solution:
//   A A A A      1 3 4 2      a1 b1 c1 d1
//   A B C C      5 2 1 3      a2 b2 c2 d2
//   D B B C      1 3 5 2      a3 b3 c3 d3
//   D B B C      2 4 1 4      a4 b4 c4 d4
checkerTestSuite("suguru", "Suguru",

test('Correct solution',(suite) => {
  let clues = {"areas": [["a1","b1","c1","d1","a2"], ["b2","b3","c3","b4","c4"], ["c2","d2","d3","d4"], ["a3","a4"]], "a2": "5", "c3": "5", "d4": "4"};
  let data = {
    "a1": "1", "b1": "3", "c1": "4", "d1": "2",
    "b2": "2", "c2": "1", "d2": "3",
    "a3": "1", "b3": "3", "d3": "2",
    "a4": "2", "b4": "4", "c4": "1",
  };

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digits in area',(suite) => {
  let clues = {"areas": [["a1","b1","c1","d1","a2"], ["b2","b3","c3","b4","c4"], ["c2","d2","d3","d4"], ["a3","a4"]], "a2": "5", "c3": "5", "d4": "4"};
  // a4 is 1 instead of 2, so area D (a3, a4) contains 1 twice.
  let data = {
    "a1": "1", "b1": "3", "c1": "4", "d1": "2",
    "b2": "2", "c2": "1", "d2": "3",
    "a3": "1", "b3": "3", "d3": "2",
    "a4": "1", "b4": "4", "c4": "1",
  };

  assert("Repeated digits in area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Area should contain sequential numbers from 1 to N", errors: ["a3", "a4"]});
}),

test('Missing digit in area',(suite) => {
  let clues = {"areas": [["a1","b1","c1","d1","a2"], ["b2","b3","c3","b4","c4"], ["c2","d2","d3","d4"], ["a3","a4"]], "a2": "5", "c3": "5", "d4": "4"};
  // a4 is empty, so area D (a3, a4) does not contain 2.
  let data = {
    "a1": "1", "b1": "3", "c1": "4", "d1": "2",
    "b2": "2", "c2": "1", "d2": "3",
    "a3": "1", "b3": "3", "d3": "2",
    "b4": "4", "c4": "1",
  };

  assert("Missing digit in area response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Area should contain sequential numbers from 1 to N", errors: ["a3", "a4"]});
}),

test('Same digits touch',(suite) => {
  let clues = {"areas": [["a1","b1","c1","d1","a2"], ["b2","b3","c3","b4","c4"], ["c2","d2","d3","d4"], ["a3","a4"]], "a2": "5", "c3": "5", "d4": "4"};
  // a3 and a4 are swapped: all areas are still correct, but a3 and b2 touch diagonally and both contain 2.
  let data = {
    "a1": "1", "b1": "3", "c1": "4", "d1": "2",
    "b2": "2", "c2": "1", "d2": "3",
    "a3": "2", "b3": "3", "d3": "2",
    "a4": "1", "b4": "4", "c4": "1",
  };

  assert("Same digits touch response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Two cells sharing a point should contain different digits", errors: ["b2", "a3"]});
}),

test('Areas are not kept from the previous puzzle',(suite) => {
  let clues = {"areas": [["a1","b1","c1","d1","a2"], ["b2","b3","c3","b4","c4"], ["c2","d2","d3","d4"], ["a3","a4"]], "a2": "5", "c3": "5", "d4": "4"};
  let data = {
    "a1": "1", "b1": "3", "c1": "4", "d1": "2",
    "b2": "2", "c2": "1", "d2": "3",
    "a3": "1", "b3": "3", "d3": "2",
    "a4": "2", "b4": "4", "c4": "1",
  };
  assert("Puzzle with areas response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});

  // The next puzzle has no areas, so it is checked only that the same digits don't touch.
  // The grid would be wrong for the areas of the previous puzzle (a1, b1, c1, d1, a2 contain 1 twice).
  let otherData = {
    "a1": "1", "b1": "2", "c1": "1", "d1": "2",
    "a2": "3", "b2": "4", "c2": "3", "d2": "4",
    "a3": "1", "b3": "2", "c3": "1", "d3": "2",
    "a4": "3", "b4": "4", "c4": "3", "d4": "4",
  };
  assert("Puzzle without areas response").that(Checker.check("4x4", {}, otherData)).isEqualTo({status: "OK"});
}),

);
