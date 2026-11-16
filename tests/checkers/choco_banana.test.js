checkerTestSuite("choco_banana", "Choco Banana",

test('Correct solution',(suite) => {
  let clues = {"a2": "5", "b1": "2", "d5": "3", "e4": "2"};
  let data = {"a3": "1", "b1": "1", "b3": "1", "b5": "1", "c1": "1", "c4": "1", "d2": "1", "d3": "1", "e4": "1", "e5": "1"}

  assert("Correct solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "OK"});
}),

test('Wrong size of white area',(suite) => {
  let clues = {"a2": "5", "b1": "2", "d5": "3", "e4": "2"};
  let data = {"a3": "1", "b1": "1", "b3": "1", "c1": "1", "c4": "1", "d2": "1", "d3": "1", "e4": "1", "e5": "1"}

  assert("Wrong solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"The clue is not correct", errors:["d5"]});
}),

test('Wrong shape of white area',(suite) => {
  let clues = {"a2": "5", "b1": "2", "d5": "3", "e4": "2"};
  let data = {"a3": "1", "a5": "1", "b1": "1", "b3": "1", "b5": "1", "c1": "1", "c4": "1", "d2": "1", "d3": "1", "e4": "1", "e5": "1"}

  assert("Wrong solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"Unshaded area should have non-rectnagular shape", errors:["a4","b4"]});
}),

test('Wrong shape of black area',(suite) => {
  let clues = {"a2": "5", "b1": "2", "d5": "3", "e4": "2"};
  let data = {"a5": "1", "b1": "1", "b2": "1", "b4": "1", "b5": "1", "c3": "1", "c5": "1", "d2": "1", "d3": "1", "e4": "1", "e5": "1"}

  assert("Wrong solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"Shaded area should have rectnagular or square shape", errors:["d2","c3","d3"]});
}),

);
