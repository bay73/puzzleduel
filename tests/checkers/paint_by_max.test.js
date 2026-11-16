checkerTestSuite("paint_by_max", "Paint by Max",

test('Correct solution',(suite) => {
  let clues = {"bottom": ["1","3",null,null], "right": [null,"2",null,"3"], "top": [null,null,"1","2"], "left": ["3",null,2,null]};
  let data = {"a1": "black", "a2": "black", "a3": "grey", "a4": "black", "b1": "black", "b2": "grey", "b3": "grey", "b4": "grey", "c1": "black", "c2": "grey", "c3":"black", "c4": "grey", "d1": "grey", "d2": "black", "d3": "black", "d4": "grey"}

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Not all painted',(suite) => {
  let clues = {"bottom": ["1","3",null,null], "right": [null,"2",null,"3"], "top": [null,null,"1","2"], "left": ["3",null,2,null]};
  let data = {"a1": "black", "a2": "black", "a3": "grey", "a4": "black", "b1": "black", "b2": "grey", "b3": "grey", "b4": "grey", "c1": "black", "c2": "grey", "c3":"black", "c4": "grey", "d2": "black", "d3": "black", "d4": "grey"}

  assert("Not connected solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"All cells should be painted", errors: ["d1"]});
}),

test('Incorrect clue',(suite) => {
  let clues = {"bottom": ["1","3",null,null], "right": [null,"2",null,"3"], "top": [null,null,"1","2"], "left": ["3",null,2,null]};
  let data = {"a1": "black", "a2": "black", "a3": "black", "a4": "black", "b1": "black", "b2": "grey", "b3": "grey", "b4": "grey", "c1": "black", "c2": "grey", "c3":"black", "c4": "grey", "d1": "grey", "d2": "black", "d3": "black", "d4": "grey"}

  assert("Incorrect clue solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Wrong max length of painted cell block in the column",errors:["a1","a2","a3","a4"]});
}),

);
