checkerTestSuite("easy_as_abc", "Easy as ABC",

test('Correct solution',(suite) => {
  let clues = {"a4": "cross", "bottom": ["A",null,null,null], "right": [null,null,"B","A"], "top": [null,"B",null,null], "left": ["C",null,null,null]};
  let data = {"a1": "C", "a2": "B", "a3": "A", "b1": "B", "b2": "A", "b4": "C", "c1": "A", "c3": "C", "c4": "B", "d2": "C", "d3": "B", "d4": "A"}

  assert("Correct solution response").that(Checker.check("4x4-ABC", clues, data)).isEqualTo({status: "OK"});
}),

test('Missing letters',(suite) => {
  let clues = {"a4": "cross", "bottom": ["A",null,null,null], "right": [null,null,"B","A"], "top": [null,"B",null,null], "left": ["C",null,null,null]};
  let data = {"a2": "B", "a3": "A", "b1": "B", "b2": "A", "b4": "C", "c1": "A", "c3": "C", "c4": "B", "d2": "C", "d3": "B", "d4": "A"}

  assert("Missing letters solution response").that(Checker.check("4x4-ABC", clues, data)).isEqualTo({status:"All letters should be exactly once in every column",errors:["a1","a2","a3","a4"]});
}),

test('Repeated letters',(suite) => {
  let clues = {"a4": "cross", "bottom": ["A",null,null,null], "right": [null,null,"B","A"], "top": [null,"B",null,null], "left": ["C",null,null,null]};
  let data = {"a1": "B", "a2": "B", "a3": "A", "b1": "B", "b2": "A", "b4": "C", "c1": "A", "c3": "C", "c4": "B", "d2": "C", "d3": "B", "d4": "A"}

  assert("Repeated letters solution response").that(Checker.check("4x4-ABC", clues, data)).isEqualTo({status:"All letters should be exactly once in every column",errors:["a1","a2","a3","a4"]});
}),

test('Wrong clue',(suite) => {
  let clues = {"a4": "cross", "bottom": ["A",null,null,null], "right": [null,null,"B","A"], "top": [null,"B",null,null], "left": ["C",null,null,null]};
  let data = {"a1": "B", "a2": "C", "a3": "A", "b1": "C", "b2": "A", "b4": "B", "c1": "A", "c3": "B", "c4": "C", "d2": "B", "d3": "C", "d4": "A"}

  assert("Wrong clue solution response").that(Checker.check("4x4-ABC", clues, data)).isEqualTo({status:"Wrong first letter in the row",errors:["b1","b2","b3","b4"]});
}),

);
