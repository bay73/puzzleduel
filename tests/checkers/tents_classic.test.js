// Puzzle 4x4 and its solution (T is a tree, ^ is a tent), numbers are tent counts:
//   ^ T . ^  2     a1 b1 c1 d1
//   . . . T  0     a2 b2 c2 d2
//   . T . .  0     a3 b3 c3 d3
//   . ^ . .  1     a4 b4 c4 d4
//   1 1 0 1
checkerTestSuite("tents_classic", "Tents",

test('Correct solution',(suite) => {
  let clues = {"b1": "tree1", "d2": "tree2", "b3": "tree3", "bottom": ["1", "1", "0", "1"], "right": ["2", "0", "0", "1"]};
  let data = {"a1": "1", "d1": "1", "b4": "1"};

  assert("Correct solution response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "OK"});
}),

test('Tents touch each other',(suite) => {
  let clues = {"b1": "tree1", "d2": "tree2", "b3": "tree3", "bottom": ["1", "1", "0", "1"], "right": ["2", "0", "0", "1"]};
  // Extra tent in b2 touches the tent in a1 diagonally.
  let data = {"a1": "1", "d1": "1", "b2": "1", "b4": "1"};

  assert("Tents touch response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Cells with tents cannot share a point", errors: ["a1", "b2"]});
}),

test('Wrong number of tents in the column',(suite) => {
  let clues = {"b1": "tree1", "d2": "tree2", "b3": "tree3", "bottom": ["1", "1", "0", "1"], "right": ["2", "0", "0", "1"]};
  // The tent of the tree b3 is placed to a3 instead of b4, so column a contains two tents.
  let data = {"a1": "1", "d1": "1", "a3": "1"};

  assert("Wrong column response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Wrong number of tents in the column", errors: ["a1", "a2", "a3", "a4"]});
}),

test('Wrong number of tents in the row',(suite) => {
  let clues = {"b1": "tree1", "d2": "tree2", "b3": "tree3", "bottom": ["1", "1", "0", "1"], "right": ["2", "0", "0", "1"]};
  // The tent of the tree d2 is placed to d3 instead of d1: columns are still correct, but the first row has only one tent.
  let data = {"a1": "1", "d3": "1", "b4": "1"};

  assert("Wrong row response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Wrong number of tents in the row", errors: ["a1", "b1", "c1", "d1"]});
}),

test('Tent without a tree',(suite) => {
  // The tree is moved from d2 to c3: the tent in d1 has no adjacent tree (and the tree c3 has no tent).
  let clues = {"b1": "tree1", "c3": "tree2", "b3": "tree3", "bottom": ["1", "1", "0", "1"], "right": ["2", "0", "0", "1"]};
  let data = {"a1": "1", "d1": "1", "b4": "1"};

  assert("Tent without a tree response").that(Checker.check("4x4", clues, data)).isEqualTo({status: "Each tree should have one corresponding tent", errors: ["d1"]});
}),

);
