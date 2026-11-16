checkerTestSuite("tapa_classic", "Tapa",

test('Correct solution',(suite) => {
  let clues = {"a1": "1_1", "a5": "2", "c4": "2_4", "e1": "2"};
  let data = {"a2": "black", "a3": "black", "b1": "black", "b3": "black", "b4": "black", "b5": "black", "c1": "black", "c2": "black", "c3": "black", "d2": "black", "d4": "black", "d5": "black", "e2": "black", "e3": "black", "e4": "black"}

  assert("Correct solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status: "OK"});
}),

test('Incorrect white 2x2',(suite) => {
  let clues = {"a1": "1_1", "a5": "2", "c4": "2_4", "e1": "2"};
  let data = {"a2": "black", "a3": "black", "b1": "black", "b3": "black", "b4": "black", "b5": "black", "c1": "black", "c2": "black", "c3": "black", "d2": "black", "d4": "black", "d5": "black", "e2": "black", "e3": "black", "e4": "black", "e5": "black"}

  assert("Incorrect white 2x2 solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"No 2x2 black squares are allowed",errors:["d4","e4","d5","e5"]});
}),

test('Non-connected black',(suite) => {
  let clues = {"a1": "1_1", "a5": "2", "c4": "2_4", "e1": "2"};
  let data = {"a2": "black", "a3": "black", "b1": "black", "b3": "black", "b4": "black", "b5": "black", "c1": "black", "c2": "black", "c3": "black", "d2": "black", "d4": "black", "d5": "black", "e2": "black", "e4": "black"}

  assert("Non-connected black solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"Black area should be connected"});
}),

test('Incorrect clue',(suite) => {
  let clues = {"a1": "1_1", "a5": "2", "c4": "2_4", "e1": "2"};
  let data = {"a2": "black", "a3": "black", "b1": "black", "b3": "black", "b4": "black", "b5": "black", "c1": "black", "c2": "black", "c3": "black", "d2": "black", "d4": "black", "e2": "black", "e3": "black", "e4": "black"}

  assert("Ignore clue obverride solution response").that(Checker.check("5x5", clues, data)).isEqualTo({status:"The clue is not correct",errors:["c4"]});
}),

);
