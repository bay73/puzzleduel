checkerTestSuite("snake_scope", "Snakescope",

test('Correct solution',(suite) => {
  let clues =  {"c3": "cross","nodes": {"a1-2": "3","d1-2": "1","b2-2": "0","c2-2": "2","b3-2": "1","c3-2": "1"}};
  let data = {"a1": "1", "b1": "1", "a2": "1", "d2": "1", "a3": "1", "d3": "1", "e3": "1", "a4": "1", "b4": "1", "e4": "1", "b5": "1", "c5": "1", "d5": "1", "e5": "1"}

  assert("Correct solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "OK"});
}),

test('Missing cell',(suite) => {
  let clues =  {"c3": "cross","nodes": {"a1-2": "3","d1-2": "1","b2-2": "0","c2-2": "2","b3-2": "1","c3-2": "1"}};
  let data = {"a1": "1", "b1": "1", "a2": "1", "d2": "1", "a3": "1", "d3": "1", "e3": "1", "a4": "1", "b4": "1", "b5": "1", "c5": "1", "d5": "1", "e5": "1"}

  assert("Missing cell solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "All black cells should be part of single snake",errors:["d2"]});
}),

test('Self touch',(suite) => {
  let clues =  {"c3": "cross","nodes": {"a1-2": "3","d1-2": "1","b2-2": "0","c2-2": "2","b3-2": "1","c3-2": "1"}};
  let data = {"a1": "1", "b1": "1", "c1": "1", "a2": "1", "d2": "1", "a3": "1", "d3": "1", "e3": "1", "a4": "1", "b4": "1", "e4": "1", "b5": "1", "c5": "1", "d5": "1", "e5": "1"}

  assert("Self touch solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "Snake shouldn't touch itself",errors:["d2","c1"]});
}),

test('Wrong clue',(suite) => {
  let clues =  {"c3": "cross","nodes": {"a1-2": "3","d1-2": "1","b2-2": "0","c2-2": "2","b3-2": "1","c3-2": "1"}};
  let data = {"a1": "1", "b1": "1", "a2": "1", "d2": "1", "a3": "1", "d3": "1", "e3": "1", "a4": "1", "a5": "1", "e4": "1", "b5": "1", "c5": "1", "d5": "1", "e5": "1"}

  assert("Solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "The clue is not correct", errors:["b3","c3","b4","c4"]});
}),

);
