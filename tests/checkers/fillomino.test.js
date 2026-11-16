checkerTestSuite("fillomino", "Fillomino",

test('Correct solution',(suite) => {
  let clues = {"a1": "3", "b1": "2","a4":"3","d2":"2"};
  let data = {"areas":[["b1","c1"],["d1"],["a1","a2","b2"],["c2","a3","b3","c3"],["d2","d3"],["a4","b4","c4"],["d4"]]};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Incorrect area size',(suite) => {
  let clues = {"a1": "3", "b1": "2","a4":"3","d2":"2"};
  let data = {"areas":[["b1","c1","d1"],["a1","a2","b2"],["c2","a3","b3","c3"],["d2","d3"],["a4","b4","c4"],["d4"]]};

  assert("Incorrect area size").that(Checker.check("4x4", clues, data)).isEqualTo({status:"The size of an area should be equal to numbers in area",errors:["b1","c1","d1"]});
}),

test('Touching areas of the same size',(suite) => {
  let clues = {"a1": "3", "b1": "2","a4":"3","d2":"2"};
  let data = {"areas":[["b1","c1"],["d1"],["a1","a2","b2"],["c2"],["a3","b3","c3"],["d2","d3"],["a4","b4","c4"],["d4"]]};

  assert("Touching areas of the same size").that(Checker.check("4x4", clues, data)).isEqualTo({status:"Areas of the same size shouldn't share an edge",errors:["a1","a2","b2","a3","b3","c3"]});
}),

);
