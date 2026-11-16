checkerTestSuite("snake_simple", "Snake",

test('Correct solution',(suite) => {
  let clues = {"a1": "black", "a4": "black", "bottom": ["3",null,"3","3","4"], "right": ["4","4",null,"4","3"]};
  let data = {"a2":"black","b2":"black","c2":"black","c1":"black","d1":"black","e1":"black","e2":"black","e3":"black","e4":"black","d4":"black","d5":"black","c5":"black","b5":"black","b4":"black"}

  assert("Correct solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "OK"});
}),

test('Missing cell',(suite) => {
  let clues = {"a1": "black", "a4": "black", "bottom": [null,null,null,null,null], "right": [null,null,null,null,null]};
  let data = {"a2":"black","b2":"black","c2":"black","c1":"black","e1":"black","e2":"black","e3":"black","e4":"black","d4":"black","d5":"black","c5":"black","b5":"black","a5":"black"}

  assert("Missing cell solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Black cells should form single snake without bifurcations",errors:["c1"]});
}),

test('Self touch',(suite) => {
  let clues = {"a1": "black", "a4": "black", "bottom": [null,null,null,null,null], "right": [null,null,null,null,null]};
  let data = {"a2":"black","b2":"black","c2":"black","c1":"black","d1":"black","e1":"black","e2":"black","e3":"black","d3":"black","d4":"black","d5":"black","c5":"black","b5":"black","a5":"black"}

  assert("Self touch solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Snake shouldn't touch itself",errors:["d3","c2"]});
}),

test('Wrong bootom clue',(suite) => {
  let clues = {"a1": "black", "a4": "black", "bottom": ["3",null,"3","3","4"], "right": ["4","4",null,"4","3"]};
  let data = {"a2":"black","b2":"black","c2":"black","c1":"black","d1":"black","e1":"black","e2":"black","e3":"black","e4":"black","d4":"black","d5":"black","c5":"black","b5":"black","a5":"black"}

  assert("Solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Wrong number of blackened cells in the column",errors:["a1","a2","a3","a4","a5"]});
}),

test('Wrong right clue',(suite) => {
  let clues = {"a1": "black", "a4": "black", "bottom": [null,null,"3","3","4"], "right": ["4","4",null,"4","3"]};
  let data = {"a2":"black","b2":"black","c2":"black","c1":"black","d1":"black","e1":"black","e2":"black","e3":"black","e4":"black","d4":"black","d5":"black","c5":"black","b5":"black","a5":"black"}

  assert("Solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Wrong number of blackened cells in the row",errors:["a4","b4","c4","d4","e4"]});
}),

);
