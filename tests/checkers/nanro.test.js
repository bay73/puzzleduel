checkerTestSuite("nanro", "Nanro",

test('Correct solution',(suite) => {
  let clues = {"a1": "2", "a3":"3", "d2":"1", "areas": [["a1","a2","b1","b2"],["d1","d2"],["a4","b4"],["d4"],["c1","c2","a3","b3","c3","d3","c4"]]};
  let data = {"a2": "2", "a4": "2", "b4": "2", "c4": "3", "d3": "3", "d4": "1"}

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Wrong numbers in area',(suite) => {
  let clues = {"a1": "2", "a3":"3", "d2":"1", "areas": [["a1","a2","b1","b2"],["d1","d2"],["a4","b4"],["d4"],["c1","c2","a3","b3","c3","d3","c4"]]};
  let data = {"a2": "2", "a4": "1", "b4": "1", "c4": "3", "d3": "3", "d4": "1"}

  assert("Wrong numbers in area response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"All numbers in the area should be equal to the number of cells in the area containing a number",errors:["a4","b4"]});
}),

test('Touching numbers',(suite) => {
  let clues = {"a3":"3", "d2":"1", "areas": [["a1","a2","b1","b2"],["d1","d2"],["a4","b4"],["d4"],["c1","c2","a3","b3","c3","d3","c4"]]};
  let data = {"a1": "3", "a2": "3", "b1": "3", "a4": "2", "b4": "2", "c4": "3", "d3": "3", "d4": "1"}

  assert("Touching numbers response").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Two cells sharing a bold edge shouldn't contain the same numbers",errors:["a2","a3"]});
}),

test('2x2 square',(suite) => {
  let clues = {"a3":"3", "d2":"1", "areas": [["a1","a2","b1","b2"],["d1","d2"],["a4","b4"],["d4"],["c1","c2","a3","b3","c3","d3","c4"]]};
  let data = {"a1": "4", "a2": "4", "b1": "4", "b2": "4", "a4": "2", "b4": "2", "c4": "3", "d3": "3", "d4": "1"}

  assert("2x2 square").that(Checker.check("4x4", clues, data)).isEqualTo({status:"No 2x2 squares fully occupied with digits are allowed",errors:["a1","b1","a2","b2"]});
}),

test('Not connected',(suite) => {
  let clues = {"a1": "2", "a3":"3", "d2":"1", "areas": [["a1","a2","b1","b2"],["d1","d2"],["a4","b4"],["d4"],["c1","c2","a3","b3","c3","d3","c4"]]};
  let data = {"a2": "2", "a4": "1", "c4": "3", "d3": "3", "d4": "1"}

  assert("Not connected").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Area occupied by the digits should be connected"});
}),

);
