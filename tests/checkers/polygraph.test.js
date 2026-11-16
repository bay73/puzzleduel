// Puzzle 4x4 and its solution (cells inside the loop are marked with #).
// The clue shows the number of neighbouring cells which are outside of the loop
// (everything beyond the grid is outside too).
//   3 # . .      a1 b1 c1 d1
//   . 1 3 .      a2 b2 c2 d2
//   . # 2 .      a3 b3 c3 d3
//   . . . .      a4 b4 c4 d4
// The loop is submitted as the list of edges: <cell>-<side>, where side is 0 - top, 1 - right, 2 - bottom, 3 - left.
checkerTestSuite("polygraph", "Polygraph",

test('Correct solution',(suite) => {
  let clues = {"a1": "3", "b2": "1", "c2": "3", "c3": "2"};
  let data = {"edges": {"b1-0": "1", "a1-1": "1", "b1-1": "1", "a2-1": "1", "c1-2": "1", "c2-1": "1", "c2-2": "1", "a3-1": "1", "b3-1": "1", "b3-2": "1"}};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('No loop',(suite) => {
  let clues = {"a1": "3", "b2": "1", "c2": "3", "c3": "2"};
  // Nothing is drawn.
  let data = {};

  assert("No loop response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Loop is not closed',(suite) => {
  let clues = {"a1": "3", "b2": "1", "c2": "3", "c3": "2"};
  // The edge below b3 is missing.
  let data = {"edges": {"b1-0": "1", "a1-1": "1", "b1-1": "1", "a2-1": "1", "c1-2": "1", "c2-1": "1", "c2-2": "1", "a3-1": "1", "b3-1": "1"}};

  assert("Loop is not closed response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Loop with extra edge',(suite) => {
  let clues = {"a1": "3", "b2": "1", "c2": "3", "c3": "2"};
  // Extra edge below d3 is not a part of the loop.
  let data = {"edges": {"b1-0": "1", "a1-1": "1", "b1-1": "1", "a2-1": "1", "c1-2": "1", "c2-1": "1", "c2-2": "1", "a3-1": "1", "b3-1": "1", "b3-2": "1", "d3-2": "1"}};

  assert("Loop with extra edge response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Two loops',(suite) => {
  let clues = {};
  // One loop is around a1, another one is around c3.
  let data = {"edges": {"a1-0": "1", "a1-3": "1", "a1-1": "1", "a1-2": "1", "c2-2": "1", "b3-1": "1", "c3-1": "1", "c3-2": "1"}};

  assert("Two loops response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Loop inside loop',(suite) => {
  let clues = {};
  // One loop is around the square a1-c3, another one is around b2 inside the first one.
  let data = {"edges": {
    "a1-0": "1", "b1-0": "1", "c1-0": "1", "a1-3": "1", "a2-3": "1", "a3-3": "1",
    "c1-1": "1", "c2-1": "1", "c3-1": "1", "a3-2": "1", "b3-2": "1", "c3-2": "1",
    "b1-2": "1", "a2-1": "1", "b2-1": "1", "b2-2": "1"}};

  assert("Loop inside loop response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "There should be single loop without bifurcations"});
}),

test('Wrong clue',(suite) => {
  // Cell c3 has 2 neighbours outside of the loop (d3 and c4), not 1.
  let clues = {"a1": "3", "b2": "1", "c2": "3", "c3": "1"};
  let data = {"edges": {"b1-0": "1", "a1-1": "1", "b1-1": "1", "a2-1": "1", "c1-2": "1", "c2-1": "1", "c2-2": "1", "a3-1": "1", "b3-1": "1", "b3-2": "1"}};

  assert("Wrong clue response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "The clue is not correct", errors: ["c3"]});
}),

);
