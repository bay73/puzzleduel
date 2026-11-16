checkerTestSuite("doubleblock", "Double Block",

test('Correct solution',(suite) => {
  let clues = {"b2": "cross", "bottom": [null,"5",null,null,"4"], "right": ["4",null,"2",null,"5"]};
  let data = {"a2": "3", "a4": "2", "a5": "1", "b1": "1", "b3": "2", "b4": "3", "c1": "3", "c2": "1", "c5": "2", "d2": "2", "d3": "1", "d5": "3", "e1": "2", "e3": "3", "e4": "1"}

  assert("Correct solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "OK"});
}),

test('Missing number',(suite) => {
  let clues = {"b2": "cross", "bottom": [null,"5",null,null,"4"], "right": ["4",null,"2",null,"5"]};
  let data = {"a2": "3", "a4": "2", "a5": "1", "b1": "1", "b3": "2", "c1": "3", "c2": "1", "c5": "2", "d2": "2", "d3": "1", "d5": "3", "e1": "2", "e3": "3", "e4": "1"}

  assert("Missing letters solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"All digits should be exactly once in every column",errors:["b1","b2","b3","b4","b5"]});
}),

test('Repeated numer',(suite) => {
  let clues = {"b2": "cross", "bottom": [null,"5",null,null,"4"], "right": ["4",null,"2",null,"5"]};
  let data = {"a2": "3", "a4": "2", "a5": "1", "b1": "1", "b3": "2", "b4": "3", "c1": "3", "c2": "1", "c5": "2", "d2": "2", "d3": "1", "d5": "3", "e1": "2", "e3": "3", "e4": "1", "e5": "2"}

  assert("Repeated letters solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"All digits should be exactly once in every column",errors:["e1","e2","e3","e4","e5"]});
}),

test('Wrong clue',(suite) => {
  let clues = {"b2": "cross", "bottom": [null,"5",null,null,"4"], "right": ["4",null,"2",null,"5"]};
  let data = {"a2": "3", "a3": "2", "a5": "1", "b1": "1", "b3": "3", "b4": "2", "c1": "3", "c2": "1", "c5": "2", "d2": "2", "d4": "1", "d5": "3", "e1": "2", "e3": "1", "e4": "3"}

  assert("Wrong clue solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"Wrong sum for the row",errors:["a3","b3","c3","d3","e3"]});
}),

);
