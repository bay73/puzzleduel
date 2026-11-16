checkerTestSuite("skyscrapers_gaps", "Gapped Skyscrapers",

test('Correct solution',(suite) => {
  let clues = {"bottom": [null,null,"3",null], "right": ["1",null,"1",null], "top": ["3","2",null,null], "left": [null,null,"3",null]};
  let data = {"a1": "1", "a2": "2", "a4": "3", "b1": "2", "b2": "3", "b3": "1", "c1": "3", "c3": "2", "c4": "1", "d2": "1", "d3": "3", "d4": "2"}

  assert("Correct solution response").that(Checker.check("4x4-3", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digits',(suite) => {
  let clues = {"bottom": [null,null,"3",null], "right": ["1",null,"1",null], "top": ["3","2",null,null], "left": [null,null,"3",null]};
  let data = {"a1": "1", "a2": "2", "a4": "3", "b1": "2", "b2": "3", "b3": "1", "c1": "3", "c3": "2", "c4": "1", "d2": "1", "d3": "3", "d4": "1"}

  assert("Repeated digits solution response").that(Checker.check("4x4-3", clues, data)).isEqualTo({status:"All digits should be exactly once in every row",errors:["a4","b4","c4","d4"]});
}),

test('Wrong clue',(suite) => {
  let clues = {"bottom": [null,null,"3",null], "right": ["1",null,"1",null], "top": ["3","2",null,null], "left": [null,"3",null,null]};
  let data = {"a1": "1", "a2": "2", "a4": "3", "b1": "3", "b3": "1", "b4": "2", "c2": "3", "c3": "2", "c4": "1", "d1": "2", "d2": "1", "d3": "3"}

  assert("Wrong clue solution response").that(Checker.check("4x4-3", clues, data)).isEqualTo({status:"Wrong number of visible buldings in the row",errors:["b1","b2","b3","b4"]});
}),

);
