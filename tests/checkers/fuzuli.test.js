checkerTestSuite("fuzuli", "Fuzuli",

test('Correct solution',(suite) => {
  let clues = {"a4": "1", "b1": "1", "b5": "2", "c2": "3", "c3": "1", "d3": "2", "e4": "3"};
  let data = {"a2": "2", "a5": "3", "b3": "3", "c4": "2", "d1": "3", "d5": "1", "e1": "2", "e2": "1"}

  assert("Correct solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "OK"});
}),

test('Missing number',(suite) => {
  let clues = {"a4": "1", "b1": "1", "b5": "2", "c2": "3", "c3": "1", "d3": "2", "e4": "3"};
  let data = {"a2": "2", "a5": "3", "b3": "3", "c4": "2", "d1": "3", "e1": "2", "e2": "1"}

  assert("Missing letters solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"All digits should be exactly once in every column",errors:["d1","d2","d3","d4","d5"]});
}),

test('Repeated number',(suite) => {
  let clues = {"a4": "1", "b1": "1", "b5": "2", "c2": "3", "c3": "1", "d3": "2", "e4": "3"};
  let data = {"a2": "2", "a5": "3", "b3": "3", "c4": "2", "d1": "3", "d5": "1", "e1": "2", "e2": "3"}

  assert("Repeated letters solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"All digits should be exactly once in every column",errors:["e1","e2","e3","e4","e5"]});
}),

test('2x2 square',(suite) => {
  let clues = {"a4": "1", "b1": "1", "b5": "2", "c2": "3", "c3": "1", "d3": "2", "e4": "3"};
  let data = {"a2": "2", "a5": "3", "b3": "3", "c4": "2", "d1": "3", "d2": "1", "e1": "2", "e5": "1"}

  assert("2x2 square solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"No 2x2 squares fully occupied with digits are allowed",errors:["c2","d2","c3","d3"]});
}),

);
