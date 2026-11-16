checkerTestSuite("skyscrapers_products", "Product Skyscrapers",

test('Correct solution',(suite) => {
  let clues = {"bottom": [null,null,"12",null], "right": ["12",null,"4",null], "top": ["24",null,null,null], "left": [null,"24",null,null]};
  let data = {"a1": "1", "a2": "2", "a3": "3", "a4": "4", "b1": "4", "b2": "3", "b3": "2", "b4": "1", "c1": "2", "c2": "4","c3": "1", "c4": "3", "d1": "3", "d2": "1", "d3": "4", "d4": "2"}

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digits',(suite) => {
  let clues = {"bottom": [null,null,"12",null], "right": ["12",null,"4",null], "top": ["24",null,null,null], "left": [null,"24",null,null]};
  let data = {"a1": "2", "a2": "2", "a3": "3", "a4": "4", "b1": "4", "b2": "3", "b3": "2", "b4": "1", "c1": "2", "c2": "4","c3": "1", "c4": "3", "d1": "3", "d2": "1", "d3": "4", "d4": "2"}

  assert("Repeated digits solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"All digits should be exactly once in every row",errors:["a1","b1","c1","d1"]});
}),

test('Wrong clue',(suite) => {
  let clues = {"bottom": [null,null,"12",null], "right": ["12",null,"4",null], "top": ["24",null,null,null], "left": [null,"24",null,null]};
  let data = {"a1": "1", "a2": "2", "a3": "3", "a4": "4", "b1": "4", "b2": "3", "b3": "2", "b4": "1", "c1": "3", "c2": "4","c3": "1", "c4": "2", "d1": "2", "d2": "1", "d3": "4", "d4": "3"}

  assert("Wrong clue solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Wrong product of visible buldings in the row",errors:["c4","c3","c2","c1"]});
}),

);
