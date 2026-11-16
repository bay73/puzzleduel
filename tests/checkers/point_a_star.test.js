checkerTestSuite("point_a_star", "Point a Star",

test('Correct solution',(suite) => {
  let clues = {"a1": "cross", "c2": "arrow_ur", "c3": "arrow_ul", "bottom": ["1",null,"1",null], "right": ["1",null,null,null]};
  let data = {"d1": "star", "b2": "star", "a4": "star", "c4": "star"}

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

);
