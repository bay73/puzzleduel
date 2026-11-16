checkerTestSuite("sudoku_antiknight", "Antiknight Sudoku",

test('Correct solution',(suite) => {
  let clues = {"a1": "1", "a2":"2","a3":"3"};
  let data = {"a1": "1", "a2": "2", "a3": "3", "a4": "4", "b1": "4", "b2": "3", "b3": "2", "b4": "1", "c1": "3", "c2": "4","c3": "1", "c4": "2", "d1": "2", "d2": "1", "d3": "4", "d4": "3"}

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digits in row',(suite) => {
  let clues = {"a1": "1", "a2":"2","a3":"3"};
  let data = {"a1": "1", "a2": "2", "a3": "3", "a4": "3", "b1": "4", "b2": "3", "b3": "2", "b4": "1", "c1": "3", "c2": "4","c3": "1", "c4": "2", "d1": "2", "d2": "1", "d3": "4", "d4": "3"}

  assert("Repeated digits in row solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"All digits should be exactly once in every column",errors:["a1","a2","a3","a4"]});
}),

test('Knight rule violated',(suite) => {
  let clues = {"a1": "1", "a2":"2","a3":"3"};
  let data = {"a1": "1", "a2": "2", "a3": "3", "a4": "4", "b1": "4", "b2": "3", "b3": "1", "b4": "2", "c1": "3", "c2": "4","c3": "2", "c4": "1", "d1": "2", "d2": "1", "d3": "4", "d4": "3"}

  assert("Knight rule violated solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Two cells connected by the knight move should contain different digits",errors:["a1","b3"]});
}),

);
