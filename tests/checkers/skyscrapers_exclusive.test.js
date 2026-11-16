checkerTestSuite("skyscrapers_exclusive", "Exclusive Skyscrapers",

test('Correct solution',(suite) => {
  let clues = {"bottom": [null,"2",null,"0"], "right": [null,"2",null,null], "top": [null,null,"2","2"], "left": [null,"2",null,"2"]};
  let data = {"a1": "3", "a2": "1", "a3": "4", "a4": "2", "b1": "4", "b2": "3", "b3": "2", "b4": "1", "c1": "2", "c2": "4","c3": "1", "c4": "3", "d1": "1", "d2": "2", "d3": "3", "d4": "4"}

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digits',(suite) => {
  let clues = {"bottom": [null,"2",null,"0"], "right": [null,"2",null,null], "top": [null,null,"2","2"], "left": [null,"2",null,"2"]};
  let data = {"a1": "3", "a2": "1", "a3": "4", "a4": "2", "b1": "4", "b2": "3", "b3": "2", "b4": "1", "c1": "2", "c2": "4","c3": "1", "c4": "3", "d1": "2", "d2": "2", "d3": "3", "d4": "4"}

  assert("Repeated digits solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"All digits should be exactly once in every row",errors:["a1","b1","c1","d1"]});
}),

test('Wrong clue',(suite) => {
  let clues = {"bottom": [null,"2",null,"0"], "right": [null,"2",null,null], "top": [null,null,"2","2"], "left": [null,"2",null,"2"]};
  let data = {"a1": "1", "a2": "2", "a3": "3", "a4": "4", "b1": "4", "b2": "3", "b3": "2", "b4": "1", "c1": "2", "c2": "4","c3": "1", "c4": "3", "d1": "3", "d2": "1", "d3": "4", "d4": "2"}

  assert("Wrong clue solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Wrong number of visible buldings in the row",errors:["d1","d2","d3","d4"]});
}),

);
