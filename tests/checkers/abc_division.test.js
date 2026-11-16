// Puzzle 4x3 with letters ABC and its solution (areas are marked with digits):
//   A B C A      1 1 1 2
//   C A B B      3 3 3 2
//   B C A C      4 4 4 2
checkerTestSuite("abc_division", "ABC division",

test('Correct solution',(suite) => {
  let clues = {"a1": "A", "b1": "B", "c1": "C", "d1": "A", "a2": "C", "b2": "A", "c2": "B", "d2": "B", "a3": "B", "b3": "C", "c3": "A", "d3": "C"};
  let data = {"areas": [["a1", "b1", "c1"], ["d1", "d2", "d3"], ["a2", "b2", "c2"], ["a3", "b3", "c3"]]};

  assert("Correct solution response").that(Checker.check("4x3-ABC", clues, data)).isEqualTo({status: "OK"});
}),

test('Area without one of the letters',(suite) => {
  let clues = {"a1": "A", "b1": "B", "c1": "C", "d1": "A", "a2": "C", "b2": "A", "c2": "B", "d2": "B", "a3": "B", "b3": "C", "c3": "A", "d3": "C"};
  // Area a1 contains only letter A (and area b1-c1-d1-d2 has no letter A).
  let data = {"areas": [["a1"], ["b1", "c1", "d1", "d2"], ["a2", "b2", "c2"], ["a3", "b3", "c3", "d3"]]};

  assert("Missing letter response").that(Checker.check("4x3-ABC", clues, data)).isEqualTo({status: "Each area should contain all letters exactly once", errors: ["a1"]});
}),

test('Area with repeated letter',(suite) => {
  let clues = {"a1": "A", "b1": "B", "c1": "C", "d1": "A", "a2": "C", "b2": "A", "c2": "B", "d2": "B", "a3": "B", "b3": "C", "c3": "A", "d3": "C"};
  // Two top rows are not divided, so the area contains every letter at least twice.
  let data = {"areas": [["a1", "b1", "c1", "d1", "a2", "b2", "c2", "d2"], ["a3", "b3", "c3"], ["d3"]]};

  assert("Repeated letter response").that(Checker.check("4x3-ABC", clues, data)).isEqualTo({status: "Each area should contain all letters exactly once", errors: ["a1", "b1", "c1", "d1", "a2", "b2", "c2", "d2"]});
}),

);
