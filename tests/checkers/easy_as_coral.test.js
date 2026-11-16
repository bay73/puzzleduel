checkerTestSuite("easy_as_coral", "Easy as Coral",

test('Correct solution',(suite) => {
  let clues = {"bottom": ["2",null,null,null], "right": [null,null,"1","1"], "top": [null,"3",null,"4"], "left": ["4",null,2,null]};
  let data = {"a1": "black", "a3": "black", "a4": "black", "b1": "black", "b2": "black", "b3": "black", "c1": "black", "d1": "black", "d2": "black", "d3": "black", "d4": "black"}

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Not connected',(suite) => {
  let clues = {"bottom": ["2",null,null,null], "right": [null,null,"1","1"], "top": [null,"3",null,"4"], "left": ["4",null,2,null]};
  let data = {"a1": "black", "a3": "black", "a4": "black", "b1": "black", "c1": "black", "d1": "black", "d2": "black", "d3": "black", "d4": "black"}

  assert("Not connected solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Black area should be connected"});
}),

test('Non-connected black',(suite) => {
  let clues = {"bottom": ["2",null,null,null], "right": [null,null,"1","1"], "top": [null,"3",null,"4"], "left": ["4",null,2,null]};
  let data = {"a1": "black", "b1": "black", "c1": "black", "d1": "black", "d2": "black", "d3": "black", "d4": "black"}

  assert("Incorrect clue solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Wrong last fragment in the row",errors:["a1","a2","a3","a4"]});
}),

test('2x2 block',(suite) => {
  let clues = {"bottom": ["2",null,null,null], "right": [null,null,"1","1"], "top": [null,"3",null,"4"], "left": ["4",null,2,null]};
  let data = {"a1": "black", "b1": "black", "c1": "black", "c2": "black", "d1": "black", "d2": "black", "d3": "black", "d4": "black"}

  assert("2x2 block solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"No 2x2 black squares are allowed","errors":["c1","d1","c2","d2"]});
}),

test('Isolated white',(suite) => {
  let clues = {"bottom": ["2",null,null,null], "right": [null,null,"1","1"], "top": [null,"3",null,"4"], "left": ["4",null,2,null]};
  let data = {"a1": "black", "b1": "black", "b2": "black", "c1": "black", "c3": "black", "d1": "black", "d2": "black", "d3": "black", "d4": "black"}

  assert("2x2 block solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"All white cells should be connected to the edge of the grid",errors:["c2"]});
}),

);
