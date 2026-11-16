checkerTestSuite("chaos", "Chaos",

test('Correct solution',(suite) => {
  let clues = {"a1": "1", "a5": "1", "b2": "2", "b4": "2", "c3": "3", "d2": "4", "d4": "2", "e1": "2", "e5": "1"};
  let data = {"a2": "4", "a3": "1", "a4": "4", "b1": "2", "b3": "3", "b5": "4", "c1": "2", "c2": "4", "c4": "3", "c5": "1", "d1": "1", "d3": "4", "d5": "4", "e2": "1", "e3": "2", "e4": "2"}

  assert("Correct solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "OK"});
}),

test('Missing number',(suite) => {
  let clues = {"a1": "1", "a5": "1", "b2": "2", "b4": "2", "c3": "3", "d2": "4", "d4": "2", "e1": "2", "e5": "1"};
  let data = {"a2": "4", "a3": "1", "a4": "4", "b1": "2", "b3": "3", "c1": "2", "c2": "4", "c4": "3", "c5": "1", "d1": "1", "d3": "4", "d5": "4", "e2": "1", "e3": "2", "e4": "2"}

  assert("Missing number solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"All cells should be filled",errors:["b5"]});
}),

test('Repeated number in row',(suite) => {
  let clues = {"a1": "1", "a5": "1", "b2": "2", "b4": "2", "c3": "3", "d2": "4", "d4": "2", "e1": "2", "e5": "1"};
  let data = {"a2": "4", "a3": "1", "a4": "4", "b1": "2", "b3": "3", "b5": "4", "c1": "2", "c2": "4", "c4": "3", "c5": "1", "d1": "4", "d3": "4", "d5": "4", "e2": "1", "e3": "2", "e4": "2"}

  assert("Repeated number in row solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"Three cells in a row shouldn't contain the same digits",errors:["d1","d2","d3"]});
}),

test('Repeated number by knight move',(suite) => {
  let clues = {"a1": "1", "a5": "1", "b2": "2", "b4": "2", "c3": "3", "d2": "4", "d4": "2", "e1": "2", "e5": "1"};
  let data = {"a2": "4", "a3": "1", "a4": "2", "b1": "2", "b3": "3", "b5": "4", "c1": "2", "c2": "4", "c4": "3", "c5": "1", "d1": "1", "d3": "4", "d5": "4", "e2": "1", "e3": "2", "e4": "2"}

  assert("Repeated number by knight move solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"Two cells connected by the knight move should contain different digits",errors:["b2","a4"]});
}),

);
