checkerTestSuite("magic_snail", "Magic Snail",

test('Correct solution',(suite) => {
  let clues = {"d3": "1", "b3":"3", "bottom": [null,null,null,null,null], "right": [null,null,null,null,null], "top": ["2",null,null,null,null], "left": [null,null,null,null,null]};
  let data = {"a2": "2", "a4": "1", "a5": "3", "b1": "1", "b5": "2", "c1": "2", "c2":"3", "c5": "1", "d1": "3", "d4": "2", "e2": "1","e3": "2", "e4": "3"}

  assert("Correct solution response").that(Checker.check("5x5-123", clues, data)).isEqualTo({status: "OK"});
}),

test('Wrong spiral',(suite) => {
  let clues = {"d3": "1", "b3":"3", "bottom": [null,null,null,null,null], "right": [null,null,null,null,null], "top": ["2",null,null,null,null], "left": [null,null,null,null,null]};
  let data = {"a1": "1", "a2": "2", "a4": "1", "a5": "3", "b1": "1", "b5": "2", "c1": "2", "c2":"3", "c5": "1", "d1": "3", "d4": "2", "e2": "1","e3": "2", "e4": "3"}

  assert("Wrong spiral solution response").that(Checker.check("5x5-123", clues, data)).isEqualTo({status:"Wrong digit reading along spiral",errors:["b1"]});
}),

);
