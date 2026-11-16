checkerTestSuite("snake_max", "Maxi Snake",

test('Correct solution',(suite) => {
  let clues = {"a1": "black", "a4": "black", "bottom": ["2",null,"2","2","4"], "right": ["3","3","1","2","4"]};
  let data = {"a2":"black","b2":"black","c2":"black","c1":"black","d1":"black","e1":"black","e2":"black","e3":"black","e4":"black","d4":"black","d5":"black","c5":"black","b5":"black","a5":"black"}

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
  let clues = {"a1": "black", "a4": "black", "bottom": ["2",null,"2","2","4"], "right": ["3","3","1","2","4"]};
  let data = {"a2":"black","b2":"black","c2":"black","c1":"black","d1":"black","e1":"black","e2":"black","e3":"black","e4":"black","e5":"black","d5":"black","c5":"black","b5":"black","b4":"black"}

  assert("Solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Wrong length of blackened fragment in the column",errors:["d1","d2","d3","d4","d5"]});
}),

test('Wrong right clue',(suite) => {
  let clues = {"a1": "black", "a4": "black", "bottom": ["2",null,"2","2","4"], "right": ["3","3","1","2","4"]};
  let data = {"a2":"black","b2":"black","c2":"black","c1":"black","d1":"black","e1":"black","e2":"black","e3":"black","e4":"black","d4":"black","d5":"black","c5":"black","b5":"black","b4":"black"}

  assert("Solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Wrong length of blackened fragment in the row",errors:["a5","b5","c5","d5","e5"]});
}),

);
