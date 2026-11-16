checkerTestSuite("sudoku_x_sums", "X Sums Sudoku",

test('Correct solution',(suite) => {
  let clues = {"bottom": [null,null,null,"6"], "right": ["10",null,null,null], "top": ["1",null,null,null], "left": [null,"6",null,null,null]};
  let data = {"a1": "1", "a2": "2", "a3": "3", "a4": "4", "b1": "3", "b2": "4", "b3": "1", "b4": "2", "c1": "2", "c2": "3","c3": "4", "c4": "1", "d1": "4", "d2": "1", "d3": "2", "d4": "3"}

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Repeated digits in row',(suite) => {
  let clues = {"bottom": [null,null,null,"6"], "right": ["10",null,null,null], "top": ["1",null,null,null], "left": [null,"6",null,null]};
  // Every 2x2 area is correct, but the first row contains 1 twice.
  let data = {"a1": "1", "a2": "3", "a3": "2", "a4": "4", "b1": "2", "b2": "4", "b3": "3", "b4": "1", "c1": "1", "c2": "4","c3": "2", "c4": "3", "d1": "3", "d2": "2", "d3": "1", "d4": "4"}

  assert("Repeated digits in row solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"All digits should be exactly once in every row",errors:["a1","b1","c1","d1"]});
}),

test('Correct 6x6',(suite) => {
  let clues = {"bottom": [null,"5","12",null,"11",null], "right": [null,"9","17",null,"8",null], "top": [null,null,"11","7","12",null], "left": [null,"6","6","18",null,null]};
  let data = {"a1":"1","a2":"2","a3":"3","a4":"4","a5":"5","a6":"6", "b1":"5","b2":"4","b3":"1","b4":"6","b5":"3","b6":"2", "c1":"3","c2":"6","c3":"2","c4":"5","c5":"1","c6":"4", "d1":"2","d2":"5","d3":"6","d4":"3","d5":"4","d6":"1", "e1":"4","e2":"1","e3":"5","e4":"2","e5":"6","e6":"3", "f1":"6","f2":"3","f3":"4","f4":"1","f5":"2","f6":"5"}

  assert("Correct 6x6 solution response").that(Checker.check("6x6", clues, data)).isEqualTo({status:"OK"});
}),

test('Repeated digits in area',(suite) => {
  let clues = {"bottom": [null,null,"3",null,null,"2"], "right": ["1","3",null,"5",null,null], "top": ["6",null,null,null,"3",null], "left": [null,null,null,null,null,null]};
  let data = {"a1":"1","a2":"2","a3":"3","a4":"4","a5":"5","a6":"6", "b1":"5","b2":"4","b3":"1","b4":"6","b5":"3","b6":"2", "c1":"2","c2":"5","c3":"6","c4":"3","c5":"4","c6":"1", "d1":"3","d2":"6","d3":"2","d4":"5","d5":"1","d6":"4", "e1":"4","e2":"1","e3":"5","e4":"2","e5":"6","e6":"3", "f1":"6","f2":"3","f3":"4","f4":"1","f5":"2","f6":"5"}

  assert("Repeated digits in area solution response").that(Checker.check("6x6", clues, data)).isEqualTo({status:"All digits should be exactly once in every area",errors:["a1","a2","b1","b2","c1","c2"]});
}),

test('Wrong clue',(suite) => {
  let clues = {"bottom": [null,null,null,"2"], "right": ["1",null,null,null], "top": ["4",null,null,null], "left": [null,null,null,null]};
  let data = {"a1": "1", "a2": "2", "a3": "3", "a4": "4", "b1": "3", "b2": "4", "b3": "1", "b4": "2", "c1": "4", "c2": "3","c3": "2", "c4": "1", "d1": "2", "d2": "1", "d3": "4", "d4": "3"}

  assert("Wrong clue solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Wrong sum of the first digits in the row",errors:["a1","a2","a3","a4"]});
}),

);
