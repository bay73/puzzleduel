checkerTestSuite("sudoku_classic", "Sudoku",

test('Correct solution',(suite) => {
  let clues = {"a1": "1", "d2":"2","b3":"3"};
  let data = {"a1": "1", "a2": "3", "a3": "4", "a4": "2", "b1": "2", "b2": "4", "b3": "3", "b4": "1", "c1": "3", "c2": "1","c3": "2", "c4": "4", "d1": "4", "d2": "2", "d3": "1", "d4": "3"}

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digits in row',(suite) => {
  let clues = {"a1": "1", "d2":"2","b3":"3"};
  // Every 2x2 area is correct, but the first row contains 1 twice.
  let data = {"a1": "1", "a2": "3", "a3": "2", "a4": "4", "b1": "2", "b2": "4", "b3": "3", "b4": "1", "c1": "1", "c2": "4","c3": "2", "c4": "3", "d1": "3", "d2": "2", "d3": "1", "d4": "4"}

  assert("Repeated digits in row solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"All digits should be exactly once in every row",errors:["a1","b1","c1","d1"]});
}),

test('Repeated digits in diagonal',(suite) => {
  let clues = {"a1": "1", "d2":"2","b3":"3"};
  let data = {"a1": "1", "a2": "3", "a3": "2", "a4": "4", "b1": "2", "b2": "4", "b3": "3", "b4": "1", "c1": "3", "c2": "1","c3": "4", "c4": "2", "d1": "4", "d2": "2", "d3": "1", "d4": "3"}

  assert("Repeated digits in diagonal solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

);
