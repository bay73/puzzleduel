checkerTestSuite("slash_pack", "Slash Pack",

test('Correct solution',(suite) => {
  let clues = {"a2": "A", "a3": "B", "b3": "C", "a5": "A", "c1": "C", "e1": "B", "c5": "A", "e3": "C", "e5": "B"};
  let data = {"a4": "\\", "b1": "\\", "b4": "/", "b5": "/", "c2": "\\", "c3": "/", "c4": "/", "d3": "/", "e2": "/"}

  assert("Correct solution response").that(Checker.check("5x5-ABC", clues, data)).isEqualTo({status: "OK"});
}),

test('Not finished line',(suite) => {
  let clues = {"a2": "A", "a3": "B", "b3": "C", "a5": "A", "c1": "C", "e1": "B", "c5": "A", "e3": "C", "e5": "B"};
  let data = {"a4": "\\", "b1": "\\", "b4": "/", "b5": "/", "c2": "\\", "c3": "/", "c4": "/", "d3": "/"}

  assert("Not finished line solution response").that(Checker.check("5x5-ABC", clues, data)).isEqualTo({status: "Each area should contain all letters exactly once",errors:["a4","a5","b1","b4","b5","c1","c2","c3","c4","c5","d1","d2","d3","d4","d5","e1","e2","e3","e4","e5"]});
}),

test('Wrong letters in area',(suite) => {
  let clues = {"a2": "A", "a3": "B", "b3": "C", "a5": "A", "c1": "C", "e1": "B", "c5": "A", "e3": "C", "e5": "B"};
  let data = {"a4": "\\", "d1": "\\", "b4": "/", "b5": "/", "d  2": "/", "c3": "/", "c4": "/", "d3": "/", "e2": "/"}

  assert("Wrong letters line solution response").that(Checker.check("5x5-ABC", clues, data)).isEqualTo({status: "Each area should contain all letters exactly once",errors:["a1","a2","a3","a4","b1","b2","b3","b4","c1","c2","c3","d1","d2"]});
}),

);
