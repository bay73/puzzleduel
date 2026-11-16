// Puzzle 4x4 (numbers up to 5) and its solution (b2 and d1 are given):
//   2   1 | 4   1      a1 b1 c1 d1
//     +---+
//   3 | 5 | 3   2      a2 b2 c2 d2
//   ---+   +-------
//   1   4 | 1   4      a3 b3 c3 d3
//
//   2   3 | 2   3      a4 b4 c4 d4
// Areas: a1-b1-a2, c1-d1-c2-d2, b2-a3-b3-a4-b4, c3-d3-c4-d4.
checkerTestSuite("meandering_numbers", "Meandering numbers",

test('Correct solution',(suite) => {
  let clues = {"areas": [["a1","b1","a2"], ["c1","d1","c2","d2"], ["b2","a3","b3","a4","b4"], ["c3","d3","c4","d4"]],
               "d1": "1", "b2": "5"};
  let data = {"a1": "2", "b1": "1", "c1": "4", "a2": "3", "c2": "3", "d2": "2",
              "a3": "1", "b3": "4", "c3": "1", "d3": "4", "a4": "2", "b4": "3", "c4": "2", "d4": "3"};

  assert("Correct solution response").that(Checker.check("4x4-5", clues, data)).isEqualTo({status: "OK"});
}),

test('Empty cell',(suite) => {
  let clues = {"areas": [["a1","b1","a2"], ["c1","d1","c2","d2"], ["b2","a3","b3","a4","b4"], ["c3","d3","c4","d4"]],
               "d1": "1", "b2": "5"};
  // Cell a1 is not filled.
  let data = {"b1": "1", "c1": "4", "a2": "3", "c2": "3", "d2": "2",
              "a3": "1", "b3": "4", "c3": "1", "d3": "4", "a4": "2", "b4": "3", "c4": "2", "d4": "3"};

  assert("Empty cell response").that(Checker.check("4x4-5", clues, data)).isEqualTo(
    {status: "Area should contain sequential numbers from 1 to N", errors: ["a1","b1","a2"]});
}),

test('Repeated number in the area',(suite) => {
  let clues = {"areas": [["a1","b1","a2"], ["c1","d1","c2","d2"], ["b2","a3","b3","a4","b4"], ["c3","d3","c4","d4"]],
               "d1": "1", "b2": "5"};
  // Number 2 in d3 instead of 4: area c3-d3-c4-d4 has two 2s and doesn't have 4.
  let data = {"a1": "2", "b1": "1", "c1": "4", "a2": "3", "c2": "3", "d2": "2",
              "a3": "1", "b3": "4", "c3": "1", "d3": "2", "a4": "2", "b4": "3", "c4": "2", "d4": "3"};

  assert("Repeated number response").that(Checker.check("4x4-5", clues, data)).isEqualTo(
    {status: "Area should contain sequential numbers from 1 to N", errors: ["c3","d3","c4","d4"]});
}),

test('Consecutive numbers do not share an edge',(suite) => {
  let clues = {"areas": [["a1","b1","a2"], ["c1","d1","c2","d2"], ["b2","a3","b3","a4","b4"], ["c3","d3","c4","d4"]],
               "d1": "1", "b2": "5"};
  // Numbers in a1 and b1 are swapped: 2 in b1 and 3 in a2 touch only diagonally.
  let data = {"a1": "1", "b1": "2", "c1": "4", "a2": "3", "c2": "3", "d2": "2",
              "a3": "1", "b3": "4", "c3": "1", "d3": "4", "a4": "2", "b4": "3", "c4": "2", "d4": "3"};

  assert("Consecutive numbers response").that(Checker.check("4x4-5", clues, data)).isEqualTo(
    {status: "Consecutive numbers should share an edge in the area", errors: ["a2", "b1"]});
}),

test('Same numbers touch diagonally',(suite) => {
  let clues = {"areas": [["a1","b1","a2"], ["c1","d1","c2","d2"], ["b2","a3","b3","a4","b4"], ["c3","d3","c4","d4"]],
               "b2": "5"};
  // Area c1-d1-c2-d2 is filled as 4-3-2-1 starting from c1 (d1 is not given):
  // 1 in c2 touches 1 in b1 diagonally (and 1 in c3).
  let data = {"a1": "2", "b1": "1", "c1": "4", "d1": "3", "a2": "3", "c2": "1", "d2": "2",
              "a3": "1", "b3": "4", "c3": "1", "d3": "4", "a4": "2", "b4": "3", "c4": "2", "d4": "3"};

  assert("Same numbers touch response").that(Checker.check("4x4-5", clues, data)).isEqualTo(
    {status: "Two cells sharing a point should contain different digits", errors: ["b1", "c2"]});
}),

test('Same numbers share an edge',(suite) => {
  // Other puzzle: areas are the rows of the grid 3x2.
  //   1 2 3
  //   -----
  //   1 2 3
  let clues = {"areas": [["a1","b1","c1"], ["a2","b2","c2"]]};
  let data = {"a1": "1", "b1": "2", "c1": "3", "a2": "1", "b2": "2", "c2": "3"};

  assert("Same numbers share an edge response").that(Checker.check("3x2-3", clues, data)).isEqualTo(
    {status: "Two cells sharing a point should contain different digits", errors: ["a1", "a2"]});
}),

);
